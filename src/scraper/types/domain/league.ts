export type League = 'premier-league' | 'laliga' | 'serie' | 'bundesliga'

export type LeagueInfo = {
  acrom: League
  name: string
  id: number
  country: string
}

export type LeaguesAvailable = LeagueInfo[]
