import { InsertionArgs, InsertionEntity } from '../types/core.js'
import { insertCountries } from './handlers/Country.handler.js'
import { insertStadiums } from './handlers/Stadiums.handler.js'
import { insertTeams } from './handlers/Teams.handler.js'
import { insertPlayers } from './handlers/Players.handler.js'
import { insertMatches } from './handlers/Matches.handler.js'

export async function handleInsertion(input: InsertionArgs) {
  const { Country, Stadium, Teams, Players, Matches } = InsertionEntity
  switch (input.insertion) {
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
  }
}
