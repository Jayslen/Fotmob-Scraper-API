import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { scapeQuote } from '../utils/scapeSqlQuote.js'
import { dbTableInfo } from 'src/scraper/dbEntities.js'

export async function insertMatchStats(
  entity: InsertionArgs<Entities.FullMatchTeamsMatchStats>
) {
  const { table, columns, dependenciesTables } = dbTableInfo[entity]

  // return await insertValues(table, columns, teams, entity)
}
