import type { MatchParsed } from './Match.js'
import type { Entities } from '../database/entities.js'

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

export type PostInsertMethodParams = {
  table: string
  columns: string[]
  dependenciesTables?: readonly Entities[]
  matchesData: MatchParsed[]
}

export type InsertionArgs<E extends Entities> = E

export enum Actions {
  Matches = 'Matches',
  Teams = 'Teams'
}
