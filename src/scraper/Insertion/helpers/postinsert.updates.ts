import { MatchParsed } from '../../types/Match.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { getMatchKey } from '../utils/getMatchKey.js'
import { generateMissingKeys } from '../helpers/missingPlayerStats.js'
import { PreloadDB } from './preload.js'
import { insertValues } from './dbQuery.js'
import { getGoalKey } from '../utils/getGoalKey.js'

export class PostInsertUpdates {
  static async matchesGoals(input: {
    matchesData: MatchParsed[]
    table: string
    columns: string[]
  }) {
    const { matchesData, table, columns } = input
    const teamsDb = await PreloadDB.teams()
    const playersDb = await PreloadDB.players()
    const matchesDb = await PreloadDB.matches(true)

    const values = matchesData.flatMap((matches) =>
      matches.matches.flatMap((mt) =>
        mt.goals.flatMap((g) =>
          g.map((goal) => {
            const teamScoredAgainst =
              goal.scoredFor === 0 ? mt.teams[1] : mt.teams[0]
            return [
              newUUID(),
              uuidToSQLBinary(
                matchesDb.get(
                  getMatchKey(
                    mt.teams[0],
                    mt.teams[1],
                    matches.league,
                    matches.season,
                    matches.round
                  )
                )
              ),
              uuidToSQLBinary(playersDb.get(goal.name)),
              uuidToSQLBinary(teamsDb.get(mt.teams[goal.scoredFor])),
              uuidToSQLBinary(teamsDb.get(teamScoredAgainst)),
              goal.minute,
              goal.addedTime ?? 'NULL',
              goal.ownGoal ?? 'NULL',
              goal.penalty ?? 'NULL'
            ]
          })
        )
      )
    )

    await insertValues(table, columns, values, 'matchGoals')
  }

  static async matchesAssists(input: {
    matchesData: MatchParsed[]
    table: string
    columns: string[]
  }) {
    const { matchesData, table, columns } = input
    const goalsDB = await PreloadDB.goals()
    const matchesDb = await PreloadDB.matches()
    const teamsDb = await PreloadDB.teams()
    const playersDb = await PreloadDB.players()

    const values = matchesData
      .flatMap((matches) =>
        matches.matches.flatMap((mt) =>
          mt.goals.flatMap((g) =>
            g.map((goal) => {
              if (!goal.assistBy) return undefined
              const matchKey = getMatchKey(
                mt.teams[0],
                mt.teams[1],
                matches.league,
                matches.season,
                matches.round
              )
              const matchUUID = matchesDb.get(matchKey)
              const teamScoreForUUID = teamsDb.get(mt.teams[goal.scoredFor])
              const assisterUUID = playersDb.get(goal.assistBy)
              const goalScorerUUID = playersDb.get(goal.name)

              const goalKey = getGoalKey({
                match_id: matchUUID as string,
                player_id: goalScorerUUID as string,
                scored_for: teamScoreForUUID as string,
                main_minute: goal.minute
              })
              const goalUUID = goalsDB.get(goalKey)
              return [
                newUUID(),
                uuidToSQLBinary(assisterUUID),
                uuidToSQLBinary(goalUUID),
                uuidToSQLBinary(matchUUID)
              ]
            })
          )
        )
      )
      .filter((assist) => assist !== undefined)

    await insertValues(table, columns, values, 'matchAssists')
  }

  static async matchCards(input: {
    matchesData: MatchParsed[]
    table: string
    columns: string[]
  }) {
    const { matchesData, table, columns } = input
    const matchesDb = await PreloadDB.matches()
    const playersDB = await PreloadDB.players()
    const values = matchesData.flatMap((matches) =>
      matches.matches.flatMap((mt) =>
        mt.matchCards.map((mc) => {
          const matchKey = getMatchKey(
            mt.teams[0],
            mt.teams[1],
            matches.league,
            matches.season,
            matches.round
          )
          const matchUUID = matchesDb.get(matchKey)
          const playerUUID = playersDB.get(mc.name)

          return [
            newUUID(),
            uuidToSQLBinary(matchUUID),
            uuidToSQLBinary(playerUUID),
            mc.card,
            mc.time,
            mc.added || 'NULL'
          ]
        })
      )
    )

    await insertValues(table, columns, values, 'matchCards')
  }

  static async PlayersMatchStats(input: {
    matchesData: MatchParsed[]
    table: string
    columns: string[]
  }) {
    const { matchesData, table, columns } = input
    const playersDb = await PreloadDB.players()
    const matchesDb = await PreloadDB.matches()

    const values = matchesData.flatMap((matches) =>
      matches.matches.flatMap((mt) =>
        mt.playerMatchStats.map((ps) => {
          const playerUUID = playersDb.get(ps.player)
          const matchKey = getMatchKey(
            mt.teams[0],
            mt.teams[1],
            matches.league,
            matches.season,
            matches.round
          )
          const matchUUID = matchesDb.get(matchKey)
          const id = newUUID()
          const playerMatchStats = ps.stats.flatMap(
            (stat): [string, number | 'NULL' | string][] => {
              const key = stat.key
                .replace(/[-\s]/g, '_')
                .replaceAll('+', 'plus')
                .replace(/[()]/g, '')
                .toLowerCase()

              if (!stat.total) {
                return [[key, stat.value ?? 'NULL']]
              }
              //
              return generateMissingKeys(key, stat.value ?? 0, stat.total)
            }
          )

          const statsValues = columns
            .map((col) => {
              const playerHasStats = playerMatchStats.find(
                ([key]) => key === col
              )
              return playerHasStats ? playerHasStats[1] : 'NULL'
            })
            .splice(3)

          statsValues.unshift(
            id,
            uuidToSQLBinary(playerUUID),
            uuidToSQLBinary(matchUUID)
          )
          return statsValues
        })
      )
    )
    await insertValues(table, columns, values, 'playerMatchStats')
  }
}
