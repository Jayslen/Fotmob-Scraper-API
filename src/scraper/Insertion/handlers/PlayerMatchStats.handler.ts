import { dbTableInfo } from '../../dbEntities.js'
import { loadMatchesData } from '../../parsers/parseScrapedData.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { insertValues } from '../helpers/dbQuery.js'
import { generateMissingKeys } from '../helpers/missingPlayerStats.js'
import { PreloadDB } from '../helpers/preload.js'
import { getMatchKey } from '../../utils/getMatchKey.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { normalizeDbColumnName } from '../utils/dbColumnKey.js'

export async function insertPlayerMatchStats(
  entity: InsertionArgs<Entities.PlayerMatchStats>
) {
  const { table, columns } = dbTableInfo[entity]

  const playersDb = await PreloadDB.players()
  const matchesDb = await PreloadDB.matches()

  const matchesData = await loadMatchesData()

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
            const key = normalizeDbColumnName(stat.key)

            if (!stat.total) {
              return [[key, stat.value ?? 'NULL']]
            }
            return generateMissingKeys(key, stat.value ?? 0, stat.total)
          }
        )

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
      })
    )
  )
  await insertValues(table, columns, values, 'playerMatchStats')
}
