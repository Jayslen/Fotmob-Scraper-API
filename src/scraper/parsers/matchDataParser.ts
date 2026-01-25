import { PreloadDB } from '../Insertion/helpers/preload.js'
import { normalizeDbColumnName } from '../Insertion/utils/dbColumnKey.js'
import { MatchParsed } from '../types/Match.js'
import { getMatchKey } from '../utils/getMatchKey.js'

export class MatchDataParser {
  static async parseTeams(
    matchesData: MatchParsed[]
  ): Promise<{ team: string; competition: string }[]> {
    const teamsDb = await PreloadDB.teams()

    return Array.from(
      new Map(
        matchesData
          .flatMap((matches) =>
            matches.matches.flatMap((mt) =>
              mt.teams.map((team) => ({
                team,
                competition: matches.league
              }))
            )
          )
          .filter(({ team }) => !teamsDb.has(team))
          .map((item) => [item.team, item])
      ).values()
    )
  }

  static async parseStadiums(matchesData: MatchParsed[]) {
    const stadiumsDb = await PreloadDB.stadiums()
    return Array.from(
      new Map(
        matchesData.flatMap((matches) =>
          matches.matches.flatMap((mt) => {
            const stadium = mt.details.stadium

            if (stadiumsDb.has(stadium.name)) return []

            return [[stadium.name, { stadium }]]
          })
        )
      ).values()
    ).map((std) => std.stadium)
  }

  static async parsePlayers(matchesData: MatchParsed[]) {
    const playersDb = await PreloadDB.players()
    return matchesData
      .flatMap(({ matches }) =>
        matches.flatMap(
          ({ goals, matchFacts, matchCards, playerMatchStats }) => [
            ...playerMatchStats.flatMap((pl) => pl.player),

            // Goal scorers
            ...goals.flatMap((pl) => pl.flatMap((goal) => goal.name)),

            // Man of the match
            matchFacts?.manOfTheMatch,

            // Assist providers
            ...goals.flatMap((goal) =>
              goal.flatMap((g) => g.assistBy).filter(Boolean)
            ),
            // cards
            ...matchCards.flatMap((pl) => pl.name)
          ]
        )
      )
      .filter((g) => typeof g === 'string')
      .filter((player) => !playersDb.has(player))
  }

  static async parseCompetitions(matchesData: MatchParsed[]) {
    const competitionsDb = await PreloadDB.competitions()
    return matchesData
      .map((mt) => mt.league)
      .filter((competition) => !competitionsDb.has(competition))
  }

  static parseReferees(matchesData: MatchParsed[]) {
    return [
      ...new Set(
        matchesData.flatMap((matches) =>
          matches.matches
            .map((mt) => mt.details.referee ?? null)
            .filter((referee) => referee !== null)
        )
      )
    ]
  }
  static async parseMatchStats(matchesData: MatchParsed[]) {
    const matchesDB = await PreloadDB.matches()

    const matchesStatsData = matchesData.flatMap((matches) =>
      matches.matches.map((mt) => {
        const matchKey = getMatchKey(
          mt.teams[0],
          mt.teams[1],
          matches.league,
          matches.season,
          matches.round
        )
        const matchUUID = matchesDB.get(matchKey)

        const statsByPeriod = mt.teamsMatchStats.reduce(
          (acc, { period, stats }) => {
            acc[period] = stats
              .flatMap((teamStats) =>
                teamStats.stats.map(({ name, value }) => {
                  // These properties in the file does not have the word 'passes'
                  const newKey = normalizeDbColumnName(name) + '_passes'
                  if (['Own half', 'Opposition half'].includes(name)) {
                    newKey.concat('_passes')
                  }
                  return { name: newKey, value }
                })
              )
              //filter to avoid some key/value pair that are [null, null]
              .filter((stat) => stat.value.every((value) => value !== null))
            return acc
          },
          {} as Record<
            string,
            {
              name: string
              value: (number | string | null)[]
            }[]
          >
        )

        const {
          All: allStats,
          FirstHalf: firstHalfStats,
          SecondHalf: secondHalfStats
        } = statsByPeriod

        return {
          teams: mt.teams,
          matchUUID,
          allStats,
          firstHalfStats,
          secondHalfStats
        }
      })
    )
    const fullMatchStats = matchesStatsData.map((match) => {
      const { teams, matchUUID, allStats } = match
      return { teams, matchUUID, allStats }
    })
    const firstHalfStats = matchesStatsData.map((match) => {
      const { teams, matchUUID, firstHalfStats } = match
      return { teams, matchUUID, firstHalfStats }
    })
    const secondHalfStats = matchesStatsData.map((match) => {
      const { teams, matchUUID, secondHalfStats } = match
      return { teams, matchUUID, secondHalfStats }
    })
    return { fullMatchStats, firstHalfStats, secondHalfStats }
  }
}
