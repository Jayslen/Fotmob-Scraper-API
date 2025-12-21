import { PreloadDB } from '../Insertion/helpers/preload.js'
import { MatchParsed } from '../types/Match.js'

export class PreinsertParser {
  static async parseTeams(
    matchesData: MatchParsed[]
  ): Promise<{ team: string; competition: string }[]> {
    const teamsDb = await PreloadDB.teams()

    return Array.from(
      new Map(
        matchesData
          .flatMap((matches) =>
            matches.matches.flatMap((mt) =>
              mt.teams.map((team) => ({
                team,
                competition: matches.league
              }))
            )
          )
          .filter(({ team }) => !teamsDb.has(team))
          .map((item) => [item.team, item])
      ).values()
    )
  }
}
