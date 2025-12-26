import { ScrapeMatchesController } from '../Controller/ScrapeMatches.js'
import { ScrapeTeamsController } from '../Controller/ScrapeTeams.js'
import { InsertionDB } from '../Controller/Insertion.js'
import {
  Entities,
  ScrapeMatchesInput,
  ScrapeTeamsInput
} from '../types/core.js'

export class Commands {
  static async ScrapeMatches(input: ScrapeMatchesInput) {
    await ScrapeMatchesController(input)
  }

  static async ScrapeTeams(league: ScrapeTeamsInput) {
    await ScrapeTeamsController(league)
  }

  static async Insertion(entities: Entities[]) {
    await InsertionDB(entities)
  }
}
