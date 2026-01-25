import { PreloadDB } from '../Insertion/helpers/preload.js'
import { MatchParsed } from '../types/Match.js'

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
}
