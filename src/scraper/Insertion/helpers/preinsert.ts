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
    const teams = await PreinsertParser.parseTeams(matchesData)
    if (!teams.length) return

    const { Teams } = InsertionEntity
    const teamsTable = dbTableInfo[Teams]
    const countriesDb = await PreloadDB.countries()

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
    await insertValues(
      teamsTable.table,
      teamsTable.columns,
      values,
      'teams',
      `\t Inserted ${values.length} missing teams`
    )
  }
  static async stadiums(matchesData: MatchParsed[]) {
    const stadiums = await PreinsertParser.parseStadiums(matchesData)
    if (!stadiums.length) return

    const { Stadium } = InsertionEntity
    const { table, columns } = dbTableInfo[Stadium]
    const values = stadiums.map(({ name, capacity, surface }) => {
      return [
        newUUID(),
        scapeQuote(name),
        'NULL',
        capacity ?? 'NULL',
        'NULL',
        surface ?? 'NULL'
      ]
    })
    await insertValues(
      table,
      columns,
      values,
      'stadiums',
      `\t Inserted ${values.length} missing stadiums`
    )
  }

  static async players(matchesData: MatchParsed[]) {
    const players = await PreinsertParser.parsePlayers(matchesData)
    if (!players.length) return

    const { Players } = InsertionEntity
    const { table, columns } = dbTableInfo[Players]
    const values = players.map((player) => {
      return [
        newUUID(),
        scapeQuote(player),
        'NULL',
        'NULL',
        'NULL',
        'NULL',
        'NULL'
      ]
    })
    await insertValues(
      table,
      columns,
      values,
      'players',
      `\t Inserted ${values.length} missing players`
    )
  }

  // find a opmimal way to store all the schema into a object
  // without interfere with the 'dbTableInfo' object
  static async competitions(matchesData: MatchParsed[]) {
    const competitions = await PreinsertParser.parseCompetitions(matchesData)
    const values = competitions.map((competition) => {
      return [newUUID(), scapeQuote(competition)]
    })
    await insertValues(
      'competitions',
      ['league_id', 'league_name'],
      values,
      'competitions',
      `\t Inserted ${values.length} missing competitions`
    )
  }

  // find a opmimal way to store all the schema into a object
  // without interfere with the 'dbTableInfo' object
  static async referees(matchesData: MatchParsed[]) {
    const referees = await PreinsertParser.parseReferees(matchesData)
    const values = referees.map((referee) => {
      return [newUUID(), scapeQuote(referee)]
    })
    await insertValues(
      'referee',
      ['referee_id', 'referee_name'],
      values,
      'referees',
      `\t Inserted ${values.length} missing referees`
    )
  }
  static async seasons(matchesData: MatchParsed[]) {
    const seasons = [...new Set(matchesData.map((mt) => mt.season))]
    await insertValues(
      'seasons',
      ['season_id', 'season'],
      seasons.map((season) => [newUUID(), season]),
      'seasons',
      `\t Inserted ${seasons.length} missing seasons`
    )
  }
}
