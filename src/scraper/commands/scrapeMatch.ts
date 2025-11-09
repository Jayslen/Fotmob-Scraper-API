import { Response } from 'playwright'
import { AllStat, ScrapeMatchData } from '../types/scraper.js'

export async function scrapeMatchResult(matchResponse: Response) {
  const json = (await matchResponse.json()) as ScrapeMatchData
  const parsedData = {
    teams: [json.general.homeTeam.name, json.general.awayTeam.name],
    goals: [
      Object.values(json.header.events.homeTeamGoals)
        .flat()
        .map((player) => ({
          name: player.fullName,
          ownGoal: player.ownGoal,
          minute: player.time,
          addedTime: player.overloadTime,
          penalty: player.penShootoutScore,
          assistBy: player.assistInput
        })),
      Object.values(json.header.events.awayTeamGoals)
        .flat()
        .map((player) => ({
          name: player.fullName,
          ownGoal: player.ownGoal,
          minute: player.time,
          addedTime: player.overloadTime,
          penalty: player.penShootoutScore,
          assistBy: player.assistInput
        }))
    ],
    details: {
      stadium: {
        name: json.content.matchFacts.infoBox.Stadium.name,
        capacity: json.content.matchFacts.infoBox.Stadium.capacity,
        surface: json.content.matchFacts.infoBox.Stadium.surface
      },
      fullDate: json.header.status.utcTime,
      attendance: json.content.matchFacts.infoBox.Attendance,
      wasGameFinished: json.header.status.finished,
      wasGameCancelled: json.header.status.cancelled,
      firstHalfStarted: json.header.status.halfs.firstHalfStarted,
      secondHalfStarted: json.header.status.halfs.secondHalfStarted,
      firstHalfEnded: json.header.status.halfs.firstHalfEnded,
      secondHalfEnded: json.header.status.halfs.secondHalfEnded,
      highlights: json.content.matchFacts.highlights.url,
      referee: json.content.matchFacts.infoBox.Referee.text,
      league: json.general.leagueName,
      round: json.general.matchRound
    },
    matchFacts: {
      manOfTheMatch: json.content.matchFacts.playerOfTheMatch.name.fullName,
      lineups: [
        {
          formation: json.content.lineup.homeTeam.formation,
          starters: json.content.lineup.homeTeam.starters.map(
            (player) => player.name
          ),
          bench: json.content.lineup.homeTeam.subs.map((player) => player.name),
          unavailable: json.content.lineup.homeTeam?.unavailable
            ? json.content.lineup.homeTeam?.unavailable.map((player) => ({
                name: player.name,
                reason: player.unavailability.type,
                expectedReturn: player.unavailability.expectedReturn
              }))
            : []
        },
        {
          formation: json.content.lineup.awayTeam.formation,
          starters: json.content.lineup.awayTeam.starters.map(
            (player) => player.name
          ),
          bench: json.content.lineup.awayTeam.subs.map((player) => player.name),
          unavailable: json.content.lineup.awayTeam?.unavailable
            ? json.content.lineup.awayTeam.unavailable.map((player) => ({
                name: player.name,
                reason: player.unavailability.type,
                expectedReturn: player.unavailability.expectedReturn
              }))
            : []
        }
      ]
    },
    matchCards: json.content.matchFacts.events.events
      .filter((event) => ['Yellow', 'Card'].includes(event.type))
      .map((event) => ({
        name: event.fullName,
        time: event.time,
        added: event.overloadTime,
        card: event.card,
        description: event.cardDescription
      })),
    teamsMatchStats: Object.entries(json.content.stats.Periods).map((stat) => ({
      period: stat[0],
      stats: stat[1].stats.map((childStat: AllStat) => ({
        category: childStat.title,
        stats: childStat.stats.map((data) => ({
          name: data.title,
          value: data.stats
        }))
      }))
    })),
    playerMatchStats: Object.entries(json.content.playerStats).map(
      ([key, data]) => ({
        player: data.name,
        stats: data.stats.flatMap((data) => {
          return Object.entries(data.stats).map(([key, values]) => {
            const currentStat = {
              category: data.key,
              key,
              value: values.stat.value,
              total: values.stat.total
            }
            return currentStat
          })
        })
      })
    )
  }
  return parsedData
}
