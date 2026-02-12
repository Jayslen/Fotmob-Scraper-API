import type { Command } from 'commander'
import { prettifyError } from 'zod'
import { ScrapeTeams } from '../application/ScrapeTeams'
import { ScrapeMatches } from '../application/ScrapeMatches'
import { InsertionDB } from '../application/Insertion'
import { LEAGUES_AVAILABLE } from '../config.js'
import type { Entities } from '../types/database/entities'
import { ValidateMatchSchema } from './validationSchema'

export function registerCommands(program: Command) {
  program
    .command('teams <league>')
    .description('Fetch teams for a specific league')
    .addHelpText(
      'afterAll',
      `<league> parameter: ${LEAGUES_AVAILABLE.map((l) => l.acrom).join(', ')} (e.g.) scraper teams laliga`
    )
    .action(async (league: string) => {
      const leagueSelected = LEAGUES_AVAILABLE.find(
        (l) => l.acrom.toLowerCase() === league.toLowerCase()
      )

      if (!leagueSelected) {
        console.error(`League ${league} not found`)
        process.exit(1)
      }

      await ScrapeTeams(leagueSelected)
      process.exit(0)
    })

  program
    .command('matches <league> <season>')
    .description('Fetch Matches for a specific league and season')
    .addHelpText(
      'afterAll',
      `<league> parameter: ${LEAGUES_AVAILABLE.map((l) => l.acrom).join(', ')}`
    )
    .addHelpText('afterAll', '<season> parameter: 2023-2024')
    .addHelpText('afterAll', '(e.g.) scraper matches laliga 2023-2024 1')
    .option('-r, --round <string>', 'Specify the round to scrape')
    .option('-f, --from <number>', 'Specify the starting round')
    .option('-t, --to <number>', 'Specify the ending round')
    .action(async (league: unknown, season: unknown, options) => {
      const { round, from, to } = options
      const { success, data, error } = ValidateMatchSchema({
        league,
        season,
        round,
        from,
        to
      })

      if (!success) {
        console.log(prettifyError(error))
        process.exit(1)
      }

      const {
        league: { acrom, id, name },
        season: parsedSeason,
        from: start,
        to: end,
        round: roundSelected
      } = data

      const roundStart = roundSelected ?? start
      const roundEnd = roundSelected ?? end

      const params = {
        league: { acrom, id, name },
        season: parsedSeason,
        from: roundStart,
        to: roundEnd
      }

      await ScrapeMatches(params)

      process.exit(0)
    })

  program
    .command('insert <entities>')
    .description('Insert data into the database specifying the entities')
    .addHelpText(
      'afterAll',
      '<entities> parameter: countries, stadiums, teams, players, matches, matchLineUps, playerMatchStats,fullMatchTeamStats. (e.g.) scraper insert teams,players'
    )
    .action(async (entities: string) => {
      const entitiesArray = entities.split(',')
      if (entitiesArray.length === 0) {
        console.error('No entities provided')
        process.exit(1)
      }
      await InsertionDB(entitiesArray as Entities[])
      process.exit(0)
    })
}
