import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { getMatchKey } from '../../utils/getMatchKey.js'
import { PreloadDB } from './preload.js'
import { insertValues } from './dbQuery.js'
import { getGoalKey } from '../../utils/getGoalKey.js'
import type { MatchParsed } from '../../types/application/Match.js'
import type { PostInsertMethodParams } from '../../types/application/core.js'

export class PostInsertUpdates {
  static async matchesGoals(input: PostInsertMethodParams) {
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
                    mt.teams[0] ?? '',
                    mt.teams[1] ?? '',
                    matches.league,
                    matches.season,
                    matches.round
                  )
                )
              ),
              uuidToSQLBinary(playersDb.get(goal.name)),
              uuidToSQLBinary(teamsDb.get(mt.teams[goal.scoredFor] ?? '')),
              uuidToSQLBinary(teamsDb.get(teamScoredAgainst ?? '')),
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

  static async matchesAssists(input: PostInsertMethodParams) {
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
                mt.teams[0] ?? '',
                mt.teams[1] ?? '',
                matches.league,
                matches.season,
                matches.round
              )
              const matchUUID = matchesDb.get(matchKey)
              const teamScoreForUUID = teamsDb.get(
                mt.teams[goal.scoredFor] ?? ''
              )
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
            mt.teams[0] ?? '',
            mt.teams[1] ?? '',
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
}
