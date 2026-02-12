import type {
  StatsByPeriod,
  TeamMatchStatEntry
} from '../../types/domain/stats'
import { buildPassesKey } from '../utils/buildPasseskey.js'

export function buildStatsByPeriod(
  teamsMatchStats: {
    period: string
    stats: { stats: { name: string; value: TeamMatchStatEntry['value'] }[] }[]
  }[]
): StatsByPeriod {
  return teamsMatchStats.reduce<StatsByPeriod>((acc, { period, stats }) => {
    acc[period] = stats
      .flatMap((teamStats) =>
        teamStats.stats.map(({ name, value }) => ({
          name: buildPassesKey(name),
          value
        }))
      )
      .filter((stat) => stat.value.every((value) => value !== null))

    return acc
  }, {})
}
