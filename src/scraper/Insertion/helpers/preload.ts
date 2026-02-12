import db from '../../dbInstance.js'
import { getGoalKey } from '../../utils/getGoalKey.js'
import { getMatchKey } from '../../utils/getMatchKey.js'
import { ENTITIES_VIEWS } from '../../types/database/entities.js'
import { getViewQuery } from '../utils/generateViewQuery.js'

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
    const query = getViewQuery(ENTITIES_VIEWS.COUNTRIES)
    const rows = (await db.unsafe(query)) as {
      country_id: string
      country: string
    }[]

    rows.forEach((row) => countriesMap.set(row.country, row.country_id))

    return countriesMap
  }

  static async stadiums(refresh?: boolean): Promise<Map<string, string>> {
    if (stadiumsMap.size > 0 && !refresh) {
      return stadiumsMap
    }
    const query = getViewQuery(ENTITIES_VIEWS.STADIUMS)
    const rows = (await db.unsafe(query)) as {
      stadium_id: string
      stadium: string
    }[]

    rows.forEach((stadium) => {
      stadiumsMap.set(stadium.stadium, stadium.stadium_id)
    })

    return stadiumsMap
  }
  static async teams(refresh?: boolean): Promise<Map<string, string>> {
    if (teamsMap.size > 0 && !refresh) {
      return teamsMap
    }

    const query = getViewQuery(ENTITIES_VIEWS.TEAMS)
    const rows = (await db.unsafe(query)) as {
      team_id: string
      name: string
    }[]
    rows.forEach((team) => {
      teamsMap.set(team.name, team.team_id)
    })
    return teamsMap
  }

  static async positions(): Promise<Map<string, string>> {
    if (positionsMap.size > 0) {
      return positionsMap
    }

    const query = getViewQuery(ENTITIES_VIEWS.POSITIONS)
    const rows = (await db.unsafe(query)) as {
      position_id: string
      position: string
    }[]
    rows.forEach((row) => positionsMap.set(row.position, row.position_id))
    return positionsMap
  }

  static async players(refresh?: boolean) {
    if (playersMap.size > 0 && !refresh) {
      return playersMap
    }

    const query = getViewQuery(ENTITIES_VIEWS.PLAYERS)
    const rows = (await db.unsafe(query)) as {
      player_id: string
      player_name: string
    }[]
    rows.forEach((row) => playersMap.set(row.player_name, row.player_id))
    return playersMap
  }

  static async referees(refresh?: boolean) {
    if (refereesMap.size > 0 && !refresh) {
      return refereesMap
    }

    const query = getViewQuery(ENTITIES_VIEWS.REFEREES)
    const rows = (await db.unsafe(query)) as {
      referee_id: string
      referee_name: string
    }[]
    rows.forEach((row) => refereesMap.set(row.referee_name, row.referee_id))
    return refereesMap
  }

  static async competitions(refresh?: boolean) {
    if (competitionsMap.size > 0 && !refresh) {
      return competitionsMap
    }
    const query = getViewQuery(ENTITIES_VIEWS.COMPETITIONS)
    const rows = (await db.unsafe(query)) as {
      league_id: string
      league_name: string
    }[]
    rows.forEach((row) => competitionsMap.set(row.league_name, row.league_id))
    return competitionsMap
  }

  static async seasons(refresh?: boolean) {
    if (seasonsMap.size > 0 && !refresh) {
      return seasonsMap
    }
    const query = getViewQuery(ENTITIES_VIEWS.SEASONS)
    const rows = (await db.unsafe(query)) as {
      season_id: string
      season: string
    }[]
    rows.forEach((row) => seasonsMap.set(row.season, row.season_id))
    return seasonsMap
  }

  static async matches(refresh?: boolean) {
    if (matchesMap.size > 0 && !refresh) {
      return matchesMap
    }
    const query = getViewQuery(ENTITIES_VIEWS.MATCHES)
    const rows = (await db.unsafe(query)) as {
      match_id: string
      home_team: string
      visit_team: string
      competition: string
      season: string
      match_week: number
    }[]
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
    const query = getViewQuery(ENTITIES_VIEWS.GOALS)
    const rows = (await db.unsafe(query)) as {
      goal_id: string
      match_id: string
      player_id: string
      scored_for: string
      main_minute: number
    }[]

    rows.forEach((row) => {
      const goalKey = getGoalKey(row)
      goalsMap.set(goalKey, row.goal_id)
    })

    return goalsMap
  }
}
