import { dbTableInfo } from 'src/scraper/dbEntities.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { getMatchKey } from '../../utils/getMatchKey.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { loadMatchesData } from 'src/scraper/parsers/parseScrapedData.js'

export async function insertMatchLineups(
  entity: InsertionArgs<Entities.MatchLineUps>
) {
  const { table, columns, dependenciesTables } = dbTableInfo[entity]

  const teamsDB = await PreloadDB.teams()
  const matchesDb = await PreloadDB.matches()
  const playersDB = await PreloadDB.players()

  const matchesData = await loadMatchesData()

  const lineupsData = matchesData.flatMap((matches) =>
    matches.matches.flatMap((mt) =>
      mt.matchFacts.lineups.map((ln, i) => {
        const players: { name: string; status: string }[] = [
          ...ln.starters.map((player) => ({
            name: player,
            status: 'starter'
          })),
          ...ln.bench.map((player) => ({ name: player, status: 'bench' })),
          ...ln.unavailable.map((player) => ({
            name: player.name,
            status: 'unavailable'
          }))
        ]
        const matchKey = getMatchKey(
          mt.teams[0],
          mt.teams[1],
          matches.league,
          matches.season,
          matches.round
        )
        const matchUUID = matchesDb.get(matchKey)
        return {
          id: Bun.randomUUIDv7(),
          teamUUID: teamsDB.get(mt.teams[i]),
          matchUUID,
          formation: ln.formation,
          players
        }
      })
    )
  )
  const lineupsValues = lineupsData.map((ln) => [
    uuidToSQLBinary(ln.id),
    uuidToSQLBinary(ln.matchUUID),
    uuidToSQLBinary(ln.teamUUID),
    ln.formation
  ])

  const lineupPlayerValues = lineupsData.flatMap((ln) =>
    ln.players.map((pl) => {
      const playerUUID = uuidToSQLBinary(playersDB.get(pl.name))
      return [newUUID(), playerUUID, uuidToSQLBinary(ln.id), pl.status]
    })
  )

  await insertValues(table, columns, lineupsValues, 'matchLineups')

  if (dependenciesTables) {
    const matchLineupPlayersKey = dependenciesTables[0]
    const { table, columns } = dbTableInfo[matchLineupPlayersKey]
    await insertValues(table, columns, lineupPlayerValues, 'playersLineups')
  }
}
