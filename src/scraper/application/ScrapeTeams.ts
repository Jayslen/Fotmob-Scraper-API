import { parseTeamData } from '../parsers/fotmob.parseTeam.js'
import { writeData } from '../utils/writeFiles.js'
import { newPage } from '../utils/createNewPage.js'
import { Area, Roles } from '../types/teams.Fotmob.js'
import type { ScrapeTeamsInput } from '../types/core.js'

export async function ScrapeTeams(league: ScrapeTeamsInput) {
  const { page, browser } = await newPage()
  await page.goto(
    `https://www.fotmob.com/leagues/${league.id}/table/${league.acrom}`
  )
  console.log(`Starting scraping teams from ${league.name}`)
  const teamsLinks = await page.$$eval('.esi6yk81', (anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href'))
  )

  const allTeams: {
    country: string
    teams: {
      name: any
      players: {
        name: string
        birthDate: Date
        country: string
        shirtNumber: number | undefined
        height: number | null
        transferValue: number | undefined
        role: Roles
        positions: string[] | undefined
      }[]
      trophies: {
        name: string[]
        area: Area[]
        won: string[]
        runnerup: string[]
        season_won: string[] | undefined
        season_runnerup: string[] | undefined
      }[]
    }[]
  } = {
    country: league.country,
    teams: []
  }

  for (const team of teamsLinks) {
    const response = page.waitForResponse(
      (res) => res.url().includes('teams?id') && res.status() === 200
    )
    await page.goto(`https://www.fotmob.com/${team}`)
    const json = await response
    const teamData = await parseTeamData(json)

    allTeams.teams.push(teamData)
    console.log(`${teamData.name} team scraped`)
  }
  await browser.close()
  await writeData({
    data: allTeams,
    dir: `teams/`,
    fileName: `/${league.acrom}-teams.json`
  })
}
