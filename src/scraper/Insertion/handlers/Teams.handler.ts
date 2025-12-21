import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadTeamsData } from '../../parsers/parseScrapedData.js'
import { InsertionArgs } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../helpers/uuid.helper.js'
import { scapeQuote } from '../helpers/scapeSqlQuote.js'

export async function insertTeams(input: InsertionArgs) {
  const { table, columns, insertion } = input
  const countriesDB = await PreloadDB.countries()
  const stadiumsDB = await PreloadDB.stadiums()

  const teamsData = await loadTeamsData()
  const teams = teamsData.map((team) => {
    const countryUUID = countriesDB.get(team.country)
    const stadiumUUID = stadiumsDB.get(team.stadium.name)
    return [
      newUUID(),
      scapeQuote(team.name),
      countryUUID ? uuidToSQLBinary(countryUUID) : 'NULL',
      stadiumUUID ? uuidToSQLBinary(stadiumUUID) : 'NULL'
    ]
  })
  return await insertValues(table, columns, teams, insertion)
}
