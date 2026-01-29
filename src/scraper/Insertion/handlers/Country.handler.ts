import { insertValues } from '../helpers/dbQuery.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { scapeQuote } from '../utils/scapeSqlQuote.js'
import { newUUID } from '../utils/uuid.helper.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { dbTableInfo } from '../../dbEntities.js'

export async function insertCountries(entity: InsertionArgs<Entities.Country>) {
  const { table, columns } = dbTableInfo[entity]
  const teamsData = await loadTeamsData()
  const values = [
    ...new Set(
      teamsData.flatMap((team) => team.players.map((player) => player.country))
    )
  ].map((country) => [newUUID(), scapeQuote(country)])
  return await insertValues(table, columns, values, entity)
}
