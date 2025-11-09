import fs from 'node:fs/promises' import { scrapeMatchResult } from './scrapeMatch.js'
import { initializeBrowser } from '../utils/initializeBrowser.js'
import { writeData } from '../utils/writeFiles.js'

export class Commands {
  static async ScrapeMatches(input: {
    league: { acrom: string; id: number; name: string }
    from: number
    to: number
    season: string
  }) {
    const { league, from, to, season } = input
    const { browser, page } = await initializeBrowser()
    console.log(
      `Starting to scrape matches for ${league.name} season ${season}`
    )

    for (let i = from; i <= to; i++) {
      const matchesRound = {
        league: league.name,
        round: i,
        season,
        matches: []
      }
      await page.goto(
        `https://www.fotmob.com/leagues/${league.id}/matches/${league.acrom}?season=${season}&group=by-round&round=${i}`,
        { waitUntil: 'load' }
      )

      const matchLinks = await page.$$eval('.e1mcimok0', (links) => {
        return links.map((link) => link.getAttribute('href'))
      })

      for (const link of matchLinks) {
        const match = link.split('/').at(2).replaceAll('-', ' ')
        const response = page.waitForResponse(
          (res) =>
            res.url().includes('api/data/matchDetails') && res.status() === 200
        )
        await page.goto(`https://www.fotmob.com/${link}`, { waitUntil: 'load' })
        try {
          const matchResponse = await response
          const match = await scrapeMatchResult(matchResponse)
          //@ts-ignore
          matchesRound.matches.push(match)
        } catch {
          console.log('Could not parse response as JSON')
        }
        console.log(`${match} match scraped`)
      }
      console.log(
        `Matches for ${matchesRound.league} season ${season} round ${matchesRound.round + 1} scraped`
      )
      await writeData({
        data: JSON.stringify(matchesRound),
        dir: `matches/${league.acrom}/${season}`,
        fileName: `${league.acrom}-${season}-${matchesRound.round + 1}.json`
      })
    }

    await browser.close()
  }
}
