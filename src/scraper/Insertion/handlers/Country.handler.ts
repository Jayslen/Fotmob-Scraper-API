import { insertValues } from '../helpers/dbQuery.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { scapeQuote } from '../helpers/scapeSqlQuote.js'
import { newUUID } from '../helpers/uuid.helper.js'
import { InsertionArgs } from '../../types/core.js'

export async function insertCountries(input: InsertionArgs) {
  const { table, columns, insertion } = input
  const teamsData = await loadTeamsData()
  const values = [
    ...new Set(
      teamsData.flatMap((team) => team.players.map((player) => player.country))
    )
  ].map((country) => [newUUID(), scapeQuote(country)])
  return await insertValues(table, columns, values, insertion)
}
