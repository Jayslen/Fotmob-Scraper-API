import inquirer from 'inquirer'
import { Actions } from '../types/application/core'
import { InsertionTables, LEAGUES_AVAILABLE } from '../config'
import { parseAnswers } from '../parsers/parseAnswers'
import { ScrapeTeams } from '../application/ScrapeTeams'
import { ScrapeMatches } from '../application/ScrapeMatches'
import { InsertionDB } from '../application/Insertion'

export async function runInteractive() {
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
      await ScrapeMatches({ ...parsed })
    }

    if (action === Actions.Teams) {
      const league = LEAGUES_AVAILABLE.find(
        (league) => league.name === competition
      )
      if (!league) throw new Error('League not found')
      await ScrapeTeams({
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
    await InsertionDB(entities)
    process.exit()
  }
}
