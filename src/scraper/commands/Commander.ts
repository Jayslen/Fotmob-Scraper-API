import { ResultSetHeader } from 'mysql2/promise'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Area, Roles } from '../types/teams.Fotmob.js'
import { League, MatchParsed } from '../types/Match.js'
import { InsertionEntity } from '../types/core.js'
import DB from '../dbInstance.js'
import { parseValues } from '../parse/parseDbValues.js'
import { scrapeMatchResult } from '../parse/parseMatchData.js'
import { parseTeamData } from '../parse/parseTeamData.js'
import { newPage } from '../utils/createNewPage.js'
import { writeData } from '../utils/writeFiles.js'
import { generateQuery } from '../utils/generateQuery.js'
import { dbTableInfo } from '../config.js'

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
    country: string
  }) {
    const { page, browser } = await newPage()
    await page.goto(
      `https://www.fotmob.com/leagues/${league.id}/table/${league.acrom}`
    )
    console.log(`Starting scraping teams from ${league.name}`)
    const teamsLinks = await page.$$eval('.e1ytqae11', (anchors) =>
      anchors.map((anchor) => anchor.getAttribute('href'))
    )

    // type Team =
    const allTeams: {
      country: string
      teams: {
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

  static async Insertion(entities: InsertionEntity[]) {
    const db = await DB.getInstance()
    for (const entity of entities) {
      const { table, columns } = dbTableInfo[entity]
      const values = await parseValues(entity)
      const query = generateQuery(table, columns, values)
      try {
        const [results] = await db.query<ResultSetHeader>(query)
        if (results.affectedRows > 0) {
          console.log(`Inserted ${results.affectedRows} rows into ${entity}`)
        } else {
          console.log(`No rows inserted into ${entity}`)
        }
      } catch (error: any) {
        const errorMsg = `Error inserting ${entity}: ${error.message}`
        const errorsPath = path.join(process.cwd(), '/debug/logs-errors')
        await fs.mkdir(errorsPath, { recursive: true })
        console.error(errorMsg)
        await fs.writeFile(
          path.join(errorsPath, `error-${entity}.txt`),
          `${errorMsg}\n${query}`
        )
      }
    }
    await db.end()
  }
}
