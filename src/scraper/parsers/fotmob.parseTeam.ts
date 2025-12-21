import { Response } from 'playwright'
import { Team } from '../types/teams.Fotmob.js'

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
    Opened
  }: { Surface?: string; Capacity?: number; Opened?: number } =
    Object.fromEntries(venue.statPairs)
  return {
    name: teamScrapeData.details.name,
    players: Object.entries(squad.squad).flatMap((squad) =>
      squad[1].members.flatMap((player) => ({
        name: player.name,
        birthDate: player.dateOfBirth,
        country: player.cname,
        shirtNumber: player.shirtNumber,
        height: player.height,
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
      season_won: trophy.season_won[0].split(','),
      season_runnerup: trophy.season_runnerup[0].split(',')
    })),
    stadium: {
      name: venue.widget.name,
      city: venue.widget.city,
      capacity: Capacity,
      surface: Surface,
      opened: Opened
    }
  }
}
