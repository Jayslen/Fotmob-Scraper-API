import { Response } from 'playwright'
import {
  parseGoalscorer,
  parseLineups,
  parseMatchCards,
  parseMatchTeamsStats,
  parsePlayerMatchStats
} from './parseMatchData.helpers.js'
import { ScrapeMatchData } from '../types/match.Fotmob.js'
import { League, Match, Surface } from '../types/Match.js'

export async function scrapeMatchResult(matchResponse: Response) {
  const json = (await matchResponse.json()) as ScrapeMatchData
  const {
    general: { homeTeam, awayTeam, leagueName, matchRound },
    header: {
      status,
      status: { halfs },
      events: { awayTeamGoals, homeTeamGoals }
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
      highlights: highlights.url,
      referee: Referee.text,
      league: leagueName as League,
      round: matchRound
    },
    matchFacts: {
      manOfTheMatch: playerOfTheMatch.name.fullName,
      lineups: parseLineups([homeTeamLineup, awayTeamLineup])
    },
    matchCards: parseMatchCards(matchEvents),
    teamsMatchStats: parseMatchTeamsStats(Periods),
    playerMatchStats: parsePlayerMatchStats(playerStats)
  }
  return parsedData
}
