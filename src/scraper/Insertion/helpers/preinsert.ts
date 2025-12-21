import { MatchParsed } from '../../types/Match.js'
import { PreloadDB } from './preload.js'
import { dbTableInfo, LEAGUES_AVAILABLE } from 'src/scraper/config.js'
import { InsertionEntity } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from './uuid.helper.js'
import { scapeQuote } from './scapeSqlQuote.js'
import { insertValues } from './dbQuery.js'
import { PreinsertParser } from '../../parsers/preinsertParser.js'

// class to held the method for pre-insert values that are required for the insertion of some entities
export class Preinsert {
  static async teams(matchesData: MatchParsed[]) {
    const { Teams } = InsertionEntity
    const teamsTable = dbTableInfo[Teams]
    const teams = await PreinsertParser.parseTeams(matchesData)
    const countriesDb = await PreloadDB.countries()

    if (!teams.length) return

    const values = teams.map(({ team, competition }) => {
      const teamCountry = LEAGUES_AVAILABLE.find(
        (lg) => lg.name.toLowerCase() === competition.toLowerCase()
      )
      const countryUUID = countriesDb.get(teamCountry?.country ?? '')
      return [
        newUUID(),
        scapeQuote(team),
        countryUUID ? uuidToSQLBinary(countryUUID) : 'NULL',
        'NULL'
      ]
    })
    await insertValues(teamsTable.table, teamsTable.columns, values, 'teams')
  }
}
