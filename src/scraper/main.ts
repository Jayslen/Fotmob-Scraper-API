import inquirer from 'inquirer'
import { program } from 'commander'
import { Commands } from './commands/Commander.js'
import { parseAnswers } from './utils/parseAnswers.js'
import { LEAGUES_AVAILABLE } from './config.js'
import { Actions } from './types/core.js'

program
  .name('Scrape Football Results')
  .version('1.0.0')
  .description(
    '⚽ Welcome to Scrape Football Results! ⚽\n Get the latest scores and match data from your favorite leagues.'
  )

console.log('⚽ Ready to scrape football data!')

program.action(async () => {
  const { action, competition } = await inquirer.prompt([
    {
      type: 'list',
      choices: Object.values(Actions),
      name: 'action',
      message: 'What you want to scrape'
    },
    {
      type: 'list',
      choices: LEAGUES_AVAILABLE.map((league) => league.name),
      name: 'competition',
      message: `Which competition do you want to scrape?`
    }
  ])

  if (action === Actions.Matches) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
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
  } else {
    // TEAMS LOGIC
  }
})

program.parseAsync()
