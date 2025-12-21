import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { newUUID, uuidToSQLBinary } from '../helpers/uuid.helper.js'
import { scapeQuote } from '../helpers/scapeSqlQuote.js'
import { InsertionArgs } from '../../types/core.js'

export async function insertPlayers(input: InsertionArgs) {
  const { table, columns, insertion, dependenciesTables } = input
  const teamsDB = await PreloadDB.teams(true)
  const countriesDb = await PreloadDB.countries()

  const teamsData = await loadTeamsData()
  const players = teamsData.flatMap((team) =>
    team.players.map((pl) => ({ ...pl, team: team.name }))
  )
  const playersValues = players.map((pl) => {
    const teamUUID = teamsDB.get(pl.team)
    const countryUUID = countriesDb.get(pl.country)
    return [
      newUUID(),
      scapeQuote(pl.name),
      pl.shirtNumber ?? 'NULL',
      pl.height ?? 'NULL',
      pl.transferValue ?? 'NULL',
      teamUUID ? uuidToSQLBinary(teamUUID) : 'NULL',
      countryUUID ? uuidToSQLBinary(countryUUID) : 'NULL'
    ]
  })
  await insertValues(table, columns, playersValues, insertion)

  if (dependenciesTables) {
    const { positions, playerPositions } = dependenciesTables
    const positionsValues = [...new Set(players.flatMap((pl) => pl.positions))]
      .filter((pos) => pos !== undefined)
      .map((pos) => [newUUID(), pos])

    await insertValues(
      positions.table,
      positions.columns,
      positionsValues,
      'positions'
    )

    const positionsDB = await PreloadDB.positions()
    const playersDB = await PreloadDB.players()

    const playerPositionsValues = players.flatMap((pl) => {
      const playerUUID = playersDB.get(pl.name)
      return (
        pl.positions?.map((pos) => {
          const positionsUUID = positionsDB.get(pos)
          return [
            playerUUID ? uuidToSQLBinary(playerUUID) : 'NULL',
            positionsUUID ? uuidToSQLBinary(positionsUUID) : 'NULL'
          ]
        }) ?? []
      )
    })

    await insertValues(
      playerPositions.table,
      playerPositions.columns,
      playerPositionsValues,
      'playerPositions'
    )
  }
}
