import { randomUUID } from 'node:crypto'
import { insertValues } from './dbQuery.js'
import { PreloadDB } from './preload.js'
import { scapeQuote } from '../../utils/scapeSqlQuote.js'
import { InsertionEntity } from '../../types/core.js'
import { loadTeamsData } from '../parse/parseScrapedData.js'

const { Country, Stadium, Teams, Players, Matches } = InsertionEntity

export async function handleInsertion(
  insertion: InsertionEntity,
  table: string,
  columns: string[],
  dependenciesTables?: Record<string, { table: string; columns: string[] }>
) {
  const teamsData = await loadTeamsData()
  switch (insertion) {
    case Country:
      const values = [
        ...new Set(
          teamsData.flatMap((team) =>
            team.players.map((player) => player.country)
          )
        )
      ].map((country) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(country)
      ])
      return await insertValues(table, columns, values, insertion)
    case Stadium:
      const stadiums = teamsData
        .map((team) => team.stadium)
        .map((stadium) => [
          `UUID_TO_BIN('${randomUUID()}',1)`,
          scapeQuote(stadium.name),
          scapeQuote(stadium.city),
          stadium.capacity ?? 0,
          stadium.opened || 'NULL',
          stadium.surface ? scapeQuote(stadium.surface) : 'NULL'
        ])
      return await insertValues(table, columns, stadiums, insertion)
    case Teams: {
      const teamsDB = await PreloadDB.countries()
      const stadiumDB = await PreloadDB.stadiums()
      const teams = teamsData.map((team) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(team.name),
        `UUID_TO_BIN('${teamsDB.get(team.country)}',1)`,
        `UUID_TO_BIN('${stadiumDB.get(team.stadium.name)}',1)`
      ])
      return await insertValues(table, columns, teams, insertion)
    }
    case Players: {
      const teamsDB = await PreloadDB.teams()
      const countriesDb = await PreloadDB.countries()
      const players = teamsData.flatMap((team) =>
        team.players.map((pl) => ({ ...pl, team: team.name }))
      )
      const playersValues = players.map((pl) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(pl.name),
        pl.shirtNumber ?? 'NULL',
        pl.height ?? 'NULL',
        pl.transferValue ?? 'NULL',
        `UUID_TO_BIN('${teamsDB.get(pl.team)}',1)`,
        `UUID_TO_BIN('${countriesDb.get(pl.country)}',1)`
      ])
      await insertValues(table, columns, playersValues, insertion)
      if (dependenciesTables) {
        const { positions, playerPositions } = dependenciesTables
        const positionsValues = [
          ...new Set(players.flatMap((pl) => pl.positions).filter((pos) => pos))
        ].map((pos) => [`UUID_TO_BIN('${randomUUID()}',1)`, pos])
        await insertValues(
          positions.table,
          positions.columns,
          positionsValues,
          'positions'
        )
        const positionsDB = await PreloadDB.positions()
        const playersDB = await PreloadDB.players()

        const playerPositionsValues = players
          .flatMap((pl) =>
            pl.positions?.map((pos) => [
              `UUID_TO_BIN('${playersDB.get(pl.name)}',1)`,
              `UUID_TO_BIN('${positionsDB.get(pos)}',1)`
            ])
          )
          .filter((value) => value)
        await insertValues(
          playerPositions.table,
          playerPositions.columns,
          playerPositionsValues,
          'playerPositions'
        )
      }
    }
  }
}
