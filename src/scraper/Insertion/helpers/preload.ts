import DB from '../../dbInstance.js'
import { getGoalKey } from '../utils/getGoalKey.js'
import { getMatchKey } from '../utils/getMatchKey.js'

const countriesMap = new Map<string, string>()
const stadiumsMap = new Map<string, string>()
const teamsMap = new Map<string, string>()
const positionsMap = new Map<string, string>()
const playersMap = new Map<string, string>()
const refereesMap = new Map<string, string>()
const competitionsMap = new Map<string, string>()
const seasonsMap = new Map<string, string>()
const matchesMap = new Map<string, string>()
const goalsMap = new Map<string, string>()

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

  static async matches(refresh?: boolean) {
    if (matchesMap.size > 0 && !refresh) {
      return matchesMap
    }
    const db = await DB.getInstance()
    const [rows] = (await db.query(
      `SELECT
  BIN_TO_UUID(m.match_id,1) AS match_id,
  ht.name AS home_team,
  vt.name AS visit_team,
  c.league_name AS competition,
  s.season AS season,
  m.match_week
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.team_id
LEFT JOIN teams vt ON m.visit_team_id = vt.team_id
LEFT JOIN competitions c ON m.competition = c.league_id
LEFT JOIN seasons s ON m.season = s.season_id`
    )) as [
      {
        match_id: string
        home_team: string
        visit_team: string
        competition: string
        season: string
        match_week: number
      }[],
      any
    ]
    rows.forEach((row) => {
      const key = getMatchKey(
        row.home_team,
        row.visit_team,
        row.competition,
        row.season,
        row.match_week
      )
      matchesMap.set(key, row.match_id)
    })
    return matchesMap
  }
  static async goals() {
    const db = await DB.getInstance()
    const [rows] = (await db.query(`
      SELECT BIN_TO_UUID(goal_id,1) AS goal_id,
        BIN_TO_UUID(match_id,1) AS match_id,
        BIN_TO_UUID(player_id,1) AS player_id,
        BIN_TO_UUID(scored_for,1) AS scored_for,
        main_minute
        FROM match_goals;
      `)) as [
      {
        goal_id: string
        match_id: string
        player_id: string
        scored_for: string
        main_minute: number
      }[],
      any
    ]

    rows.forEach((row) => {
      const goalKey = getGoalKey(row)
      goalsMap.set(goalKey, row.goal_id)
    })

    return goalsMap
  }
}
