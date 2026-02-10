#!/usr/bin/env bun
import inquirer from 'inquirer'
import { program } from 'commander'
import { Commands } from './commands/Commander.js'
import { parseAnswers } from './parsers/parseAnswers.js'
import { LEAGUES_AVAILABLE } from './config.js'
import { InsertionTables } from './config.js'
import { Actions } from './types/core.js'
import type { League } from './types/core.js'
import { ValidateMatchSchema } from './schemas/Schemas.js'
import { prettifyError } from 'zod'

program
  .name('Scrape Football Results')
  .version('1.0.0')
  .description(
    '⚽ Welcome to Scrape Football Results! ⚽\n Get the latest scores and match data from your favorite leagues.'
  )

console.log('⚽ Ready to scrape football data!')

program
  .command('teams <league>')
  .description('Fetch teams for a specific league')
  .addHelpText(
    'afterAll',
    `<league> parameter: ${LEAGUES_AVAILABLE.map((l) => l.acrom).join(', ')} (e.g.) scraper teams laliga`
  )
  .action(async (league: League) => {
    const leagueSelected = LEAGUES_AVAILABLE.find(
      (l) => l.acrom.toLowerCase() === league.toLowerCase()
    )

    if (!leagueSelected) {
      console.error(`League ${league} not found`)
      process.exit(1)
    }

    await Commands.ScrapeTeams(leagueSelected)
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

    let roundStart = roundSelected ?? start
    let roundEnd = roundSelected ?? end

    const params = {
      league: { acrom, id, name },
      season: parsedSeason,
      from: roundStart,
      to: roundEnd
    }

    await Commands.ScrapeMatches(params)

    process.exit(0)
  })

program
  .command('insert <entities>')
  .description('Insert data into the database specifying the entities')
  .addHelpText(
    'afterAll',
    '<entities> parameter: countries, stadiums, teams, players, matches, matchLineUps, playerMatchStats,fullMatchTeamStats. (e.g.) scraper insert teams,players'
  )
  .action(async (entities) => {
    const entitiesArray = entities.split(',')
    if (entitiesArray.length === 0) {
      console.error('No entities provided')
      process.exit(1)
    }
    await Commands.Insertion(entitiesArray)
    process.exit(0)
  })

program.action(async () => {
  const { mainAction } = await inquirer.prompt([
    {
      type: 'select',
      name: 'mainAction',
      message: 'What do you want to do?',
      choices: [
        { name: 'Scrape Data', value: 'Scrape' },
        { name: 'Insert Data into DB', value: 'Insert' }
      ]
    }
  ])

  if (mainAction === 'Scrape') {
    const { action, competition } = await inquirer.prompt([
      {
        type: 'select',
        choices: Object.values(Actions),
        name: 'action',
        message: 'What you want to scrape'
      },
      {
        type: 'select',
        choices: LEAGUES_AVAILABLE.map((league) => league.name),
        name: 'competition',
        message: `Which competition do you want to scrape?`
      }
    ])

    if (action === Actions.Matches) {
      const answers = await inquirer.prompt([
        {
          type: 'select',
          choices: ['2022-2023', '2023-2024', '2024-2025'],
          name: 'season',
          message: 'Which season do you want to scrape?'
        },
        {
          type: 'input',
          name: 'rounds',
          message: 'Which rounds do you want to scrape? (e.g. 1-6 or 2)',
          default: 'All'
        }
      ])
      const parsed = parseAnswers({ ...answers, competition })
      await Commands.ScrapeMatches({ ...parsed })
    }

    if (action === Actions.Teams) {
      const league = LEAGUES_AVAILABLE.find(
        (league) => league.name === competition
      )
      if (!league) throw new Error('League not found')
      await Commands.ScrapeTeams({
        acrom: league.acrom,
        id: league.id,
        name: league.name,
        country: league.country ?? ''
      })
    }
  }

  if (mainAction === 'Insert') {
    const { entities } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'entities',
        message: 'Which entity do you want to insert?',
        choices: InsertionTables
      }
    ])
    await Commands.Insertion(entities)
    process.exit()
  }
})

await program.parseAsync(process.argv)
