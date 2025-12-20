import DB from '../../dbInstance.js'

const countriesMap = new Map<string, string>()
const stadiumsMap = new Map<string, string>()
const teamsMap = new Map<string, string>()
const positionsMap = new Map<string, string>()
const playersMap = new Map<string, string>()
const refereesMap = new Map<string, string>()
const competitionsMap = new Map<string, string>()
const seasonsMap = new Map<string, string>()

export class PreloadDB {
  static async countries(): Promise<Map<string, string>> {
    if (countriesMap.size > 0) {
      return countriesMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(country_id, 1) AS country_id, country FROM countries'
    )) as [{ country_id: string; country: string }[], any]

    rows.forEach((row) => countriesMap.set(row.country, row.country_id))

    return countriesMap
  }

  static async stadiums(refresh?: boolean): Promise<Map<string, string>> {
    if (stadiumsMap.size > 0 && !refresh) {
      return stadiumsMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(stadium_id, 1) AS stadium_id, stadium FROM stadiums'
    )) as [{ stadium_id: string; stadium: string }[], any]

    rows.forEach((stadium) => {
      stadiumsMap.set(stadium.stadium, stadium.stadium_id)
    })

    return stadiumsMap
  }
  static async teams(refresh?: boolean): Promise<Map<string, string>> {
    if (teamsMap.size > 0 && !refresh) {
      return teamsMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(team_id,1) AS team_id, name FROM teams'
    )) as [{ team_id: string; name: string }[], any]
    rows.forEach((team) => {
      teamsMap.set(team.name, team.team_id)
    })
    return teamsMap
  }

  static async positions(): Promise<Map<string, string>> {
    if (positionsMap.size > 0) {
      return positionsMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(position_id, 1) AS position_id, position FROM positions'
    )) as [{ position_id: string; position: string }[], any]
    rows.forEach((row) => positionsMap.set(row.position, row.position_id))
    return positionsMap
  }

  static async players(refresh?: boolean) {
    if (playersMap.size > 0 && !refresh) {
      return playersMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(player_id, 1) AS player_id, player_name FROM players'
    )) as [{ player_id: string; player_name: string }[], []]
    rows.forEach((row) => playersMap.set(row.player_name, row.player_id))
    return playersMap
  }

  static async referees(refresh?: boolean) {
    if (refereesMap.size > 0 && !refresh) {
      return refereesMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(referee_id, 1) AS referee_id, referee_name FROM referee'
    )) as [{ referee_id: string; referee_name: string }[], []]
    rows.forEach((row) => refereesMap.set(row.referee_name, row.referee_id))
    return refereesMap
  }

  static async competitions(refresh?: boolean) {
    if (competitionsMap.size > 0 && !refresh) {
      return competitionsMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(league_id, 1) AS league_id, league_name FROM competitions'
    )) as [{ league_id: string; league_name: string }[], []]
    rows.forEach((row) => competitionsMap.set(row.league_name, row.league_id))
    return competitionsMap
  }

  static async seasons(refresh?: boolean) {
    if (seasonsMap.size > 0 && !refresh) {
      return seasonsMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      'SELECT BIN_TO_UUID(season_id, 1) AS season_id, season FROM seasons'
    )) as [{ season_id: string; season: string }[], []]
    rows.forEach((row) => seasonsMap.set(row.season, row.season_id))
    return seasonsMap
  }
}
