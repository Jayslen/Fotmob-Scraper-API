import { UUID } from 'node:crypto'

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

export type sqlUUID = `UUID_TO_BIN('${UUID}', 1)`

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
  MatchAssits = 'matchAssists'
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
  [Entities.Matches]: DBTableConfig<[Entities.MatchGoals, Entities.MatchAssits]>
  [Entities.MatchGoals]: DBTableConfig
  [Entities.MatchAssits]: DBTableConfig
}
