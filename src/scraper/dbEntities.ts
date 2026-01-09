import { DBTableInfoMap, Entities } from './types/core.js'

export const dbTableInfo: DBTableInfoMap = {
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
  },
  players: {
    table: 'players',
    columns: [
      'player_id',
      'player_name',
      'shirt_number',
      'height',
      'market_value',
      'team_id',
      'country_id'
    ],
    dependenciesTables: [Entities.Positions, Entities.PlayerPositions]
  },
  positions: {
    table: 'positions',
    columns: ['position_id', 'position']
  },
  playerPositions: {
    table: 'player_positions',
    columns: ['player_id', 'position_id']
  },
  matches: {
    table: 'matches',
    columns: [
      'match_id',
      'home_team_id',
      'visit_team_id',
      'attendance',
      'season',
      'competition',
      'match_week',
      'match_date',
      'stadium_id',
      'is_neutral',
      'was_game_finished',
      'was_game_cancelled',
      'first_half_started',
      'second_half_started',
      'first_half_ended',
      'second_half_ended',
      'highlights',
      'referee_id',
      'man_of_the_match'
    ],
    dependenciesTables: [
      Entities.MatchGoals,
      Entities.MatchAssits,
      Entities.MatchCards
    ]
  },
  matchGoals: {
    table: 'match_goals',
    columns: [
      'goal_id',
      'match_id',
      'player_id',
      'scored_for',
      'scored_to',
      'main_minute',
      'added_minute',
      'is_own_goal',
      'is_penalty'
    ]
  },
  matchAssists: {
    table: 'match_assists',
    columns: ['assists_id', 'player_id', 'goal_assisted', 'match_id']
  },
  matchCards: {
    table: 'match_cards',
    columns: [
      'mc_id',
      'match_id',
      'player_id',
      'card',
      'main_minute',
      'added_minute'
    ]
  }
}
