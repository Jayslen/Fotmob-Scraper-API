import { Entities, LeaguesAvailable } from './types/core.js'

export const databaseConfig = {
  host: process.env.HOST,
  user: process.env.DBUSER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3306
}

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
