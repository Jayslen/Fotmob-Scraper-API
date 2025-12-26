import { insertValues } from '../helpers/dbQuery.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { scapeQuote } from '../utils/scapeSqlQuote.js'
import { newUUID } from '../utils/uuid.helper.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { dbTableInfo } from 'src/scraper/dbEntities.js'

export async function insertStadiums(entity: InsertionArgs<Entities.Stadium>) {
  const { table, columns } = dbTableInfo[entity]
  const teamsData = await loadTeamsData()
  const stadiums = teamsData
    .map((team) => team.stadium)
    .map((stadium) => [
      newUUID(),
      scapeQuote(stadium.name),
      scapeQuote(stadium.city),
      stadium.capacity ?? 0,
      stadium.opened || 'NULL',
      stadium.surface ? scapeQuote(stadium.surface) : 'NULL'
    ])
  return await insertValues(table, columns, stadiums, entity)
}
