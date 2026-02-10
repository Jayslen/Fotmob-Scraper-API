import { Entities } from '../types/core.js'
import { insertCountries } from './handlers/Country.handler.js'
import { insertStadiums } from './handlers/Stadiums.handler.js'
import { insertTeams } from './handlers/Teams.handler.js'
import { insertPlayers } from './handlers/Players.handler.js'
import { insertMatches } from './handlers/Matches.handler.js'
import { insertPlayerMatchStats } from './handlers/PlayerMatchStats.handler.js'
import { insertMatchLineups } from './handlers/MatchLineups.handler.js'
import { insertMatchStats } from './handlers/MatchTeamStats.handler.js'
import type { InsertionArgs } from '../types/core.js'

export async function handleInsertion(input: InsertionArgs<Entities>) {
  const {
    Country,
    Stadium,
    Teams,
    Players,
    Matches,
    PlayerMatchStats,
    MatchLineUps,
    FullMatchTeamsMatchStats
  } = Entities
  switch (input) {
    case Country:
      return await insertCountries(input)
    case Stadium:
      return await insertStadiums(input)
    case Teams:
      return insertTeams(input)
    case Players: {
      return insertPlayers(input)
    }
    case Matches: {
      return insertMatches(input)
    }
    case PlayerMatchStats: {
      return insertPlayerMatchStats(input)
    }
    case MatchLineUps: {
      return insertMatchLineups(input)
    }
    case FullMatchTeamsMatchStats: {
      return insertMatchStats(input)
    }
    default:
      console.error(`Unknown entity ${input}`)
  }
}
