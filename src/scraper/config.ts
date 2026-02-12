import { Entities } from './types/database/entities'
import type { LeaguesAvailable } from './types/domain/league'

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
  Entities.Matches,
  Entities.PlayerMatchStats,
  Entities.MatchLineUps,
  Entities.FullMatchTeamsMatchStats
]
export const ANCHOR_MATCH_SELECTOR = '[data-testid="livescores-match"]'
