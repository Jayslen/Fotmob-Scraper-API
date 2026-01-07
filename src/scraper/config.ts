import { Entities, LeaguesAvailable } from './types/core.js'

export const LEAGUES_AVAILABLE: LeaguesAvailable = [
  {
    acrom: 'premier-league',
    name: 'Premier League',
    id: 47,
    country: 'England'
  },
  { acrom: 'laliga', name: 'La Liga', id: 87, country: 'Spain' },
  { acrom: 'serie', name: 'Serie A', id: 55, country: 'Italy' },
  { acrom: 'bundesliga', name: 'Bundesliga', id: 54, country: 'Germany' }
]

export const InsertionTables = [
  Entities.Country,
  Entities.Stadium,
  Entities.Teams,
  Entities.Players,
  Entities.Matches
]
