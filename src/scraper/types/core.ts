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

export enum InsertionEntity {
  Country = 'countries',
  Stadium = 'stadiums',
  Teams = 'teams',
  Players = 'players',
  Matches = 'matches'
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

export interface InsertionArgs {
  insertion: InsertionEntity
  table: string
  columns: string[]
  dependenciesTables?: Record<string, { table: string; columns: string[] }>
}
