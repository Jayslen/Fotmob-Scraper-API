import { Response } from 'playwright'
import { Team } from '../types/teamsParsed.js'

export async function parseTeamData(team: Response) {
  const teamScrapeData = await team.json()
  const {
    squad,
    history: { trophyList }
  } = teamScrapeData as Team

  const players = Object.entries(squad.squad).flatMap((squad) =>
    squad[1].members.flatMap(
      ({
        name,
        dateOfBirth: birthDate,
        cname: country,
        transferValue,
        positionIdsDesc,
        role: { fallback: role }
      }) => ({
        name,
        birthDate,
        country,
        transferValue,
        role,
        positions: positionIdsDesc?.split(',')
      })
    )
  )
  const trophies = trophyList.map(
    ({ name, area, won, runnerup, season_won, season_runnerup }) => ({
      name,
      area,
      won,
      runnerup,
      season_won,
      season_runnerup
    })
  )
  return {
    name: teamScrapeData.details.name,
    players,
    trophies
  }
}
