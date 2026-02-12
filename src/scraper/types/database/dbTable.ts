import type { Entities } from './entities.js'

export type DBTableConfig<
  T extends readonly Entities[] | undefined = undefined
> = {
  table: string
  columns: string[]
  dependenciesTables?: T
}

export type DBTableInfoMap = {
  [Entities.Country]: DBTableConfig
  [Entities.Stadium]: DBTableConfig
  [Entities.Teams]: DBTableConfig
  [Entities.Players]: DBTableConfig<
    readonly [Entities.Positions, Entities.PlayerPositions]
  >
  [Entities.Positions]: DBTableConfig
  [Entities.PlayerPositions]: DBTableConfig
  [Entities.Matches]: DBTableConfig<
    readonly [Entities.MatchGoals, Entities.MatchAssits, Entities.MatchCards]
  >
  [Entities.MatchGoals]: DBTableConfig
  [Entities.MatchAssits]: DBTableConfig
  [Entities.MatchCards]: DBTableConfig
  [Entities.PlayerMatchStats]: DBTableConfig
  [Entities.MatchLineUps]: DBTableConfig<
    readonly [Entities.MatchLineUpsPlayers]
  >
  [Entities.MatchLineUpsPlayers]: DBTableConfig
  [Entities.FullMatchTeamsMatchStats]: DBTableConfig<
    readonly [Entities.FirstHalfTeamStats, Entities.SecondHalfTeamStats]
  >
  [Entities.FirstHalfTeamStats]: DBTableConfig
  [Entities.SecondHalfTeamStats]: DBTableConfig
}
