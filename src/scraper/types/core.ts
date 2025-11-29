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
  Teams = 'teams'
  // Players,
  // Positions
}
