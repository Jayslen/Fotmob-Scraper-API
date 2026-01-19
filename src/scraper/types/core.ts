import { MatchParsed } from './Match.js'

export type League = 'premier-league' | 'laliga' | 'serie' | 'bundesliga'

export type LeaguesAvailable = {
  acrom: League
  name: string
  id: number
  country?: string
}[]

export enum Actions {
  Matches = 'Matches',
  Teams = 'Teams'
}

export interface ScrapeMatchesInput {
  league: { acrom: string; id: number; name: string }
  from: number
  to: number
  season: string
}

export interface ScrapeTeamsInput {
  acrom: string
  id: number
  name: string
  country: string
}

export type InsertionArgs<E extends Entities> = E

export enum Entities {
  Country = 'countries',
  Stadium = 'stadiums',
  Teams = 'teams',
  Players = 'players',
  Matches = 'matches',
  Positions = 'positions',
  PlayerPositions = 'playerPositions',
  MatchGoals = 'matchGoals',
  MatchAssits = 'matchAssists',
  MatchCards = 'matchCards',
  PlayerMatchStats = 'playerMatchStats',
  MatchLineUps = 'matchLineUps',
  MatchLineUpsPlayers = 'matchLineUpsPlayers'
}

export type DBTableConfig<
  T extends readonly Entities[] | undefined = undefined
> = {
  table: string
  columns: string[]
  dependenciesTables?: T
}

export type DBTableInfoMap = {
  [Entities.Country]: DBTableConfig
  [Entities.Stadium]: DBTableConfig
  [Entities.Teams]: DBTableConfig
  [Entities.Players]: DBTableConfig<
    readonly [Entities.Positions, Entities.PlayerPositions]
  >
  [Entities.Positions]: DBTableConfig
  [Entities.PlayerPositions]: DBTableConfig
  [Entities.Matches]: DBTableConfig<
    readonly [
      Entities.MatchGoals,
      Entities.MatchAssits,
      Entities.MatchCards,
      Entities.PlayerMatchStats,
      Entities.MatchLineUps,
      Entities.MatchLineUpsPlayers
    ]
  >
  [Entities.MatchGoals]: DBTableConfig
  [Entities.MatchAssits]: DBTableConfig
  [Entities.MatchCards]: DBTableConfig
  [Entities.PlayerMatchStats]: DBTableConfig
  [Entities.MatchLineUps]: DBTableConfig<
    readonly [Entities.MatchLineUpsPlayers]
  >
  [Entities.MatchLineUpsPlayers]: DBTableConfig
}

export type PostInsertMethodParams = {
  table: string
  columns: string[]
  dependenciesTables?: readonly Entities[]
  matchesData: MatchParsed[]
}

export enum ENTITIES_VIEWS {
  COUNTRIES = 'countries',
  STADIUMS = 'stadiums',
  TEAMS = 'teams',
  POSITIONS = 'positions',
  PLAYERS = 'players',
  REFEREES = 'referees',
  COMPETITIONS = 'competitions',
  SEASONS = 'seasons',
  MATCHES = 'matches',
  GOALS = 'goals'
}
