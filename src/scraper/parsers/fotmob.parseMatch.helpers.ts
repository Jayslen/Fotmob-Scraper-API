import { Card, Key, Period, Reason, StatKeyCategory } from '../types/Match.js'
import type {
  AllStat,
  AwayTeam,
  AwayTeamGoals,
  EventsEvent,
  HomeTeam,
  HomeTeamGoals,
  PlayerStat,
  StatsPeriods
} from '../types/match.Fotmob.js'
import type { Description } from '../types/Match.js'

// do this function with flatMap instead flat().map()
export function parseGoalscorer(
  teamGoals: [HomeTeamGoals | undefined, AwayTeamGoals | undefined]
) {
  return teamGoals.map((teamGoalData) => {
    if (!teamGoalData) return []
    const index = teamGoals.indexOf(teamGoalData) as 0 | 1
    if (!teamGoalData) return []
    return Object.values(teamGoalData)
      .flat()
      .map((player) => ({
        name: player.fullName,
        ownGoal: player.ownGoal ?? false,
        minute: player.time,
        addedTime: player.overloadTime,
        penalty: player.goalDescription === 'Penalty' ? true : false,
        assistBy: player.assistInput,
        scoredFor: index
      }))
  })
}

export function parseLineups(linups: [HomeTeam, AwayTeam]) {
  return linups.map((lineup) => {
    return {
      formation: lineup.formation,
      starters: lineup.starters.map((player) => player.name),
      bench: lineup.subs.map((player) => player.name),
      unavailable:
        lineup?.unavailable?.map((player) => ({
          name: player.name,
          reason: player.unavailability.type as unknown as Reason,
          expectedReturn: player.unavailability.expectedReturn
        })) ?? []
    }
  })
}

export function parseMatchCards(matchEvents: EventsEvent[]) {
  return matchEvents
    .filter((event) => ['Yellow', 'Card'].includes(event.type))
    .map((event) => ({
      name: event.fullName as string,
      time: event.time,
      added: event.overloadTime,
      card: event.card as unknown as Card,
      description: event.cardDescription as unknown as Description
    }))
}

export function parseMatchTeamsStats(Periods: StatsPeriods) {
  return Object.entries(Periods).map((stat) => ({
    period: stat[0] as unknown as Period,
    stats: stat[1].stats.map((childStat: AllStat) => ({
      category: childStat.title,
      stats: childStat.stats.map((data) => ({
        name: data.title,
        value: data.stats
      }))
    }))
  }))
}

export function parsePlayerMatchStats(playerStats: {
  [key: string]: PlayerStat
}) {
  return Object.entries(playerStats).map(([key, data]) => ({
    player: data.name,
    stats: data.stats.flatMap((data) => {
      return Object.entries(data.stats).map(([key, values]) => {
        const currentStat = {
          category: data.key as unknown as StatKeyCategory,
          key: key as unknown as Key,
          value: values.stat.value,
          total: values.stat.total
        }
        return currentStat
      })
    })
  }))
}
