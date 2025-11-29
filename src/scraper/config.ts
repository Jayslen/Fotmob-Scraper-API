import { InsertionEntity, LeaguesAvailable } from './types/core.js'
process.loadEnvFile()

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

export const dbTableInfo: Record<
  InsertionEntity,
  { table: string; columns: string[] }
> = {
  countries: {
    table: 'countries',
    columns: ['country_id', 'country']
  },
  stadiums: {
    table: 'stadiums',
    columns: [
      'stadium_id',
      'stadium',
      'city',
      'capacity',
      'inaguration',
      'surface'
    ]
  },
  teams: {
    table: 'teams',
    columns: ['team_id', 'name', 'country_id', 'stadium_id']
  }
}
