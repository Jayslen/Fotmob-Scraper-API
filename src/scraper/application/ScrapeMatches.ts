import { scrapeMatchResult } from '../parsers/footmob.parseMatch.js'
import { newPage } from '../utils/createNewPage.js'
import { writeData } from '../utils/writeFiles.js'
import { ANCHOR_MATCH_SELECTOR } from '../config.js'
import type { MatchParsed } from '../types/application/Match.js'
import type { ScrapeMatchesInput } from '../types/application/core.js'

export async function ScrapeMatches({
  league,
  from,
  to,
  season
}: ScrapeMatchesInput) {
  const { page, browser } = await newPage()
  console.log(`Starting to scrape matches for ${league.name} season ${season}`)

  const startRound = from - 1
  const endRound = to - 1

  for (let i = startRound; i <= endRound; i++) {
    const errorMatches: { matchLink: string; error: string }[] = []
    const matchesRound: MatchParsed = {
      league: league.name,
      round: i + 1,
      season,
      matches: []
    }

    console.log(`Scraping results for matchweek ${matchesRound.round}`)

    await page.goto(
      `https://www.fotmob.com/leagues/${league.id}/fixtures/${league.acrom}?season=${season}&group=by-round&round=${i}`,
      { waitUntil: 'load' }
    )

    const matchLinks = await page.$$eval(ANCHOR_MATCH_SELECTOR, (links) => {
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
        const errorMatch = {
          matchLink: `https://www.fotmob.com/${link}`,
          error: (error as Error).message as string
        }
        errorMatches.push(errorMatch)
        console.log(`${matchName} Could not parse response as JSON`)
      }
    }
    if (errorMatches.length > 0) {
      await Bun.write(
        `debug/matchesErrors/${league.acrom}-round-${matchesRound.round}-season-${matchesRound.season}-errors.json`,
        JSON.stringify(errorMatches)
      )
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
