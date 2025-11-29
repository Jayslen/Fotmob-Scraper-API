import path from 'node:path'
import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { InsertionEntity } from '../types/core.js'
import { Team, Teams } from '../types/Teams.js'
import { scapeQuote } from '../utils/scapeSqlQuote.js'
import { PreloadDB } from '../utils/preload.js'

interface TeamData extends Team {
  country: string
}
let teamsData: TeamData[] = []
const { Country, Stadium, Teams } = InsertionEntity

async function loadTeamsData() {
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

export async function parseValues(
  insertion: InsertionEntity
): Promise<(string | number)[][]> {
  const data = await loadTeamsData()
  switch (insertion) {
    case Country:
      const countries = [
        ...new Set(
          data.flatMap((team) => team.players.map((player) => player.country))
        )
      ]

      return countries.map((country) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(country)
      ])
    case Stadium:
      const stadiums = data.map((team) => team.stadium)
      return stadiums.map((stadium) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(stadium.name),
        scapeQuote(stadium.city),
        stadium.capacity ?? 0,
        stadium.opened || 'NULL',
        stadium.surface ? scapeQuote(stadium.surface) : 'NULL'
      ])
    case Teams:
      const teamsDB = await PreloadDB.countries()
      const stadiumDB = await PreloadDB.stadiums()
      return data.map((team) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(team.name),
        `UUID_TO_BIN('${teamsDB.get(team.country)}',1)`,
        `UUID_TO_BIN('${stadiumDB.get(team.stadium.name)}',1)`
      ])
  }
}
