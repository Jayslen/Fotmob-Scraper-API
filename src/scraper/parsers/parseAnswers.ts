import { LEAGUES_AVAILABLE } from '../config.js'

export function parseAnswers(answers: any): {
  season: string
  rounds: string
  from: number
  to: number
  league: { acrom: string; id: number; name: string }
} {
  const { season, rounds, competition } = answers as {
    season: string
    rounds: string
    competition: string
  }
  let from = 0
  let to = 38

  if (rounds.length <= 2) {
    const singleRound = parseInt(rounds.replaceAll(' ', '')) - 1
    from = singleRound
    to = singleRound
  } else {
    const [fromStr, toStr] = rounds
      .split('-')
      .map((str) => parseInt(str.replaceAll(' ', '')))

    from = fromStr ?? 0
    to = toStr ?? 38
  }

  const league = LEAGUES_AVAILABLE.find((league) => league.name === competition)
  if (!league) throw new Error(`League ${competition} not found`)

  return {
    season,
    rounds,
    from,
    to,
    league: {
      acrom: league.acrom,
      id: league.id,
      name: league.name
    }
  }
}
