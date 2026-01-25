import { TeamMatchStatEntry } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'

export function getMatchStatsValues(
  columns: string[],
  statsData: (
    | {
        teams: string[]
        matchUUID: string | undefined
        stats: TeamMatchStatEntry[]
      }
    | undefined
  )[],
  teamsDB: Map<string, string>
) {
  return statsData.flatMap((match) => {
    const statMap = new Map<string, (string | number | null)[]>()

    if (!match?.stats?.length) {
      return []
    }

    // Build lookup: stat_name -> [teamA, teamB]
    match.stats.forEach((stat) => {
      statMap.set(stat.name, stat.value)
    })

    return match.teams.map((team, teamIndex) =>
      columns.map((column) => {
        switch (column) {
          case 'id':
            return newUUID()

          case 'team_id':
            return uuidToSQLBinary(teamsDB.get(team))

          case 'match_id':
            return uuidToSQLBinary(match.matchUUID)

          default:
            const value = statMap.get(column)?.[teamIndex]
            if (typeof value === 'string') {
              return +value.split(' ')[0]
            }
            return value ?? 'NULL'
        }
      })
    )
  })
}
