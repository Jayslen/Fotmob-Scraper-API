import { Response } from 'playwright'
import { Team } from '../types/teamsParsed.js'

export async function parseTeamData(team: Response) {
  const teamScrapeData = await team.json()
  const {
    squad,
    history: { trophyList },
    overview: { venue }
  } = teamScrapeData as Team

  const {
    Surface,
    Capacity,
    openend
  }: { Surface?: string; Capacity?: number; openend?: number } =
    Object.fromEntries(venue.statPairs)
  return {
    name: teamScrapeData.details.name,
    players: Object.entries(squad.squad).flatMap((squad) =>
      squad[1].members.flatMap((player) => ({
        name: player.name,
        birthDate: player.dateOfBirth,
        country: player.cname,
        transferValue: player.transferValue,
        role: player.role.fallback,
        positions: player.positionIdsDesc?.split(',')
      }))
    ),
    trophies: trophyList.map((trophy) => ({
      name: trophy.name,
      area: trophy.area,
      won: trophy.won,
      runnerup: trophy.runnerup,
      season_won: trophy.season_won,
      season_runnerup: trophy.season_runnerup
    })),
    stadium: {
      name: venue.widget.name,
      city: venue.widget.city,
      capacity: Capacity,
      surface: Surface,
      opened: openend
    }
  }
}
