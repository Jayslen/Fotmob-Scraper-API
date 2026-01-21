export function getMatchKey(
  homeTeam: string,
  awayTeam: string,
  league: string,
  season: string,
  round: number
): string {
  return `${homeTeam} vs ${awayTeam} - ${league} - ${season} - Week ${round}`
    .toLowerCase()
    .replaceAll(' ', '')
}
