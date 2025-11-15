import { scrapeMatchResult } from '../parse/parseMatchData.js'
import { newPage } from '../utils/createNewPage.js'
import { writeData } from '../utils/writeFiles.js'
import { League, MatchParsed } from '../types/matchParsed.js'
import { LEAGUES_AVAILABLE } from '../config.js'
import { parseTeamData } from '../parse/parseTeamData.js'
import { Area, Roles } from '../types/teamsParsed.js'

export class Commands {
  static async ScrapeMatches(input: {
    league: { acrom: string; id: number; name: string }
    from: number
    to: number
    season: string
  }) {
    const { league, from, to, season } = input
    const { page, browser } = await newPage()
    console.log(
      `Starting to scrape matches for ${league.name} season ${season}`
    )

    for (let i = from; i <= to; i++) {
      const matchesRound: MatchParsed = {
        league: league.name as League,
        round: i + 1,
        season,
        matches: []
      }

      await page.goto(
        `https://www.fotmob.com/leagues/${league.id}/fixtures/${league.acrom}?season=${season}&group=by-round&round=${i}`,
        { waitUntil: 'load' }
      )

      const matchLinks = await page.$$eval('.e1mcimok0', (links) => {
        return links.map((link) => link.getAttribute('href'))
      })

      for (const link of matchLinks) {
        const matchName = link.split('/').at(2).replaceAll('-', ' ')
        const response = page.waitForResponse(
          (res) =>
            res.url().includes('api/data/matchDetails') && res.status() === 200
        )
        await page.goto(`https://www.fotmob.com/${link}`)
        try {
          const matchResponse = await response
          const match = await scrapeMatchResult(matchResponse)
          matchesRound.matches.push(match)
          console.log(`${matchName} match scraped`)
        } catch (error) {
          console.log(`${matchName} Could not parse response as JSON`)
          // console.log(error)
        }
      }
      console.log(
        `Matches for ${matchesRound.league} season ${season} round ${matchesRound.round} scraped`
      )
      await writeData({
        data: matchesRound,
        dir: `matches/${league.acrom}/${season}`,
        fileName: `/${league.acrom}-week-${matchesRound.round}.json`
      })
    }
    await browser.close()
  }

  static async ScrapeTeams(league: {
    acrom: string
    id: number
    name: string
  }) {
    const { page, browser } = await newPage()
    await page.goto(
      `https://www.fotmob.com/leagues/${league.id}/table/${league.acrom}`
    )
    const teamsLinks = await page.$$eval('.elydtfc1', (anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href'))
    )
    const allTeams: {
      name: any
      players: {
        name: string
        birthDate: Date
        country: string
        transferValue: number | undefined
        role: Roles
        positions: string[] | undefined
      }[]
      trophies: {
        name: string[]
        area: Area[]
        won: string[]
        runnerup: string[]
        season_won: string[]
        season_runnerup: string[]
      }[]
    }[] = []

    for (const team of teamsLinks) {
      const response = page.waitForResponse(
        (res) => res.url().includes('teams?id') && res.status() === 200
      )
      await page.goto(`https://www.fotmob.com/${team}`)
      const json = await response
      const teamData = await parseTeamData(json)

      allTeams.push(teamData)
      console.log(`${teamData.name} team scraped`)
    }
    await browser.close()
    await writeData({
      data: allTeams,
      dir: `teams/${league.acrom}`,
      fileName: `/${league.acrom}-teams.json`
    })
  }
}

const leagueToScrape = LEAGUES_AVAILABLE.find(
  (league) => league.name === 'Premier League'
)

if (leagueToScrape) {
  await Commands.ScrapeTeams(leagueToScrape)
}
