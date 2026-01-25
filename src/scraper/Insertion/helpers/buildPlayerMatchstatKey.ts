import { uuidToSQLBinary } from '../utils/uuid.helper.js'

export function buildPlayerStatKey({
  columns,
  playerMatchStats,
  id,
  playerUUID,
  matchUUID
}: {
  columns: string[]
  playerMatchStats: [string, string | number][]
  id: string
  playerUUID: string | undefined
  matchUUID: string | undefined
}) {
  const statsValues = columns
    .map((col) => {
      const playerHasStats = playerMatchStats.find(([key]) => key === col)
      return playerHasStats ? playerHasStats[1] : 'NULL'
    })
    .splice(3)

  statsValues.unshift(
    id,
    uuidToSQLBinary(playerUUID),
    uuidToSQLBinary(matchUUID)
  )

  return statsValues
}
