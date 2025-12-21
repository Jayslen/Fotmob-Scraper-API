import path from 'node:path'
import fs from 'node:fs/promises'
import { InsertionEntity } from '../types/core.js'
import { Team, Teams } from '../types/Teams.js'
import { MatchParsed } from 'src/scraper/types/Match.js'

interface TeamData extends Team {
  country: string
}
const teamsData: TeamData[] = []
const matchesData: MatchParsed[] = []

const { Teams } = InsertionEntity

export async function loadTeamsData() {
  if (teamsData.length > 0) return teamsData
  const cwd = process.cwd()
  const teamsPath = path.join(cwd, 'football-stats', 'teams')
  const teamsFiles = await fs.readdir(teamsPath)
  for (const file of teamsFiles) {
    const filePath = path.join(teamsPath, file)
    const fileData = await fs.readFile(filePath, 'utf-8')
    const jsonData = JSON.parse(fileData) as Teams
    const teams = jsonData.teams.map((team) => ({
      ...team,
      country: jsonData.country
    }))
    teamsData.push(...teams)
  }
  return teamsData
}

export async function loadMatchesData() {
  if (matchesData.length > 0) return matchesData
  const cwd = process.cwd()
  const matchesPath = path.join(cwd, 'football-stats', 'matches')
  const leaguesDir = await fs.readdir(matchesPath)

  for (const league of leaguesDir) {
    const leaguesMatchesSeason = path.join(matchesPath, league)
    const leagueSeason = await fs.readdir(leaguesMatchesSeason)
    for (const season of leagueSeason) {
      const leagueMatches = path.join(leaguesMatchesSeason, season)
      const matches = await fs.readdir(leagueMatches)
      for (const match of matches) {
        const matchPath = path.join(leagueMatches, match)
        const matchData = await fs.readFile(matchPath, 'utf8')
        matchesData.push(JSON.parse(matchData))
      }
    }
  }
  return matchesData
}
