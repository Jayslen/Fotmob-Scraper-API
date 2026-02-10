import type { Response } from 'playwright'
import {
  parseGoalscorer,
  parseLineups,
  parseMatchCards,
  parseMatchTeamsStats,
  parsePlayerMatchStats
} from './fotmob.parseMatch.helpers.js'
import { League, Surface } from '../types/Match.js'
import type { ScrapeMatchData } from '../types/match.Fotmob.js'
import type { Match } from '../types/Match.js'
import { isPlayerOfTheMatch } from '../utils/verifyMOTM.js'

export async function scrapeMatchResult(matchResponse: Response) {
  const json = (await matchResponse.json()) as ScrapeMatchData
  const {
    general: { homeTeam, awayTeam, leagueName, matchRound },
    header: {
      status,
      status: { halfs }
    },
    content: {
      stats: { Periods },
      lineup: { homeTeam: homeTeamLineup, awayTeam: awayTeamLineup },
      playerStats,
      matchFacts: {
        events: { events: matchEvents },
        infoBox: { Stadium, Attendance, Referee },
        highlights,
        playerOfTheMatch
      }
    }
  } = json

  const normalizedPlayerOfTheMatch = isPlayerOfTheMatch(playerOfTheMatch)
    ? playerOfTheMatch
    : undefined
  const awayTeamGoals = json.header.events?.awayTeamGoals
  const homeTeamGoals = json.header.events?.homeTeamGoals

  const parsedData: Match = {
    teams: [homeTeam.name, awayTeam.name],
    goals: parseGoalscorer([homeTeamGoals, awayTeamGoals]),
    details: {
      stadium: {
        name: Stadium.name,
        capacity: Stadium.capacity,
        surface: Stadium.surface as unknown as Surface
      },
      fullDate: status.utcTime,
      attendance: Attendance,
      wasGameFinished: status.finished,
      wasGameCancelled: status.cancelled,
      firstHalfStarted: halfs.firstHalfStarted,
      secondHalfStarted: halfs.secondHalfStarted,
      firstHalfEnded: halfs.firstHalfEnded,
      secondHalfEnded: halfs.secondHalfEnded,
      highlights: highlights ? highlights.url : undefined,
      referee: Referee.text,
      league: leagueName as League,
      round: matchRound
    },
    matchFacts: {
      manOfTheMatch: normalizedPlayerOfTheMatch?.name.fullName,
      lineups: parseLineups([homeTeamLineup, awayTeamLineup])
    },
    matchCards: parseMatchCards(matchEvents),
    teamsMatchStats: parseMatchTeamsStats(Periods),
    playerMatchStats: parsePlayerMatchStats(playerStats)
  }
  return parsedData
}
