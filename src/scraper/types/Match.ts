export interface MatchParsed {
  league: League
  round: number
  season: string
  matches: Match[]
}

export enum League {
  PremierLeague = 'Premier League'
}

export interface Match {
  teams: string[]
  goals: Array<Goal[]>
  details: Details
  matchFacts: MatchFacts
  matchCards: MatchCard[]
  teamsMatchStats: TeamsMatchStat[]
  playerMatchStats: PlayerMatchStat[]
}

export interface Details {
  stadium: Stadium
  fullDate: Date
  attendance: number
  wasGameFinished: boolean
  wasGameCancelled: boolean
  firstHalfStarted: string
  secondHalfStarted: string
  firstHalfEnded: string
  secondHalfEnded: string
  highlights: string
  referee: string
  league: League
  round: string
}

export interface Stadium {
  name: string
  capacity: number
  surface: Surface
}

export enum Surface {
  Grass = 'grass'
}

export interface Goal {
  name: string
  ownGoal: null
  minute: number
  addedTime: number | null
  penalty: null
  assistBy?: string
}

export interface MatchCard {
  name: string
  time: number
  added: number | null
  card: Card
  description: Description | null
}

export enum Card {
  Red = 'Red',
  Yellow = 'Yellow',
  YellowRed = 'YellowRed'
}

export interface Description {
  localizedKey: string
  defaultText: string
}

export interface MatchFacts {
  manOfTheMatch: string
  lineups: Lineup[]
}

export interface Lineup {
  formation: string
  starters: string[]
  bench: string[]
  unavailable: Unavailable[]
}

export interface Unavailable {
  name: string
  reason: Reason
  expectedReturn: string
}

export enum Reason {
  Injury = 'injury'
}

export interface PlayerMatchStat {
  player: string
  stats: PlayerMatchStatStat[]
}

export interface PlayerMatchStatStat {
  category: StatKeyCategory
  key: Key
  value?: number
  total?: number
}

export enum StatKeyCategory {
  Attack = 'attack',
  Defense = 'defense',
  Duels = 'duels',
  TopStats = 'top_stats'
}

export enum Key {
  AccurateCrosses = 'Accurate crosses',
  AccurateLongBalls = 'Accurate long balls',
  AccuratePasses = 'Accurate passes',
  ActedAsSweeper = 'Acted as sweeper',
  AerialDuelsWon = 'Aerial duels won',
  Assists = 'Assists',
  BigChancesMissed = 'Big chances missed',
  BlockedShots = 'Blocked shots',
  Blocks = 'Blocks',
  ChancesCreated = 'Chances created',
  ClearanceOffTheLine = 'Clearance off the line',
  Clearances = 'Clearances',
  ConcededPenalty = 'Conceded penalty',
  Corners = 'Corners',
  DefensiveActions = 'Defensive actions',
  Dispossessed = 'Dispossessed',
  DivingSave = 'Diving save',
  DribbledPast = 'Dribbled past',
  DuelsLost = 'Duels lost',
  DuelsWon = 'Duels won',
  ErrorLEDToGoal = 'Error led to goal',
  ExpectedAssistsXA = 'Expected assists (xA)',
  ExpectedGoalsOnTargetXGOT = 'Expected goals on target (xGOT)',
  ExpectedGoalsXG = 'Expected goals (xG)',
  FantasyPoints = 'Fantasy points',
  FotMobRating = 'FotMob rating',
  FoulsCommitted = 'Fouls committed',
  Goals = 'Goals',
  GoalsConceded = 'Goals conceded',
  GoalsPrevented = 'Goals prevented',
  GroundDuelsWon = 'Ground duels won',
  HeadedClearance = 'Headed clearance',
  HighClaim = 'High claim',
  HitWoodwork = 'Hit woodwork',
  Interceptions = 'Interceptions',
  LastManTackle = 'Last man tackle',
  MinutesPlayed = 'Minutes played',
  Offsides = 'Offsides',
  PassesIntoFinalThird = 'Passes into final third',
  PenaltiesWon = 'Penalties won',
  Punches = 'Punches',
  Recoveries = 'Recoveries',
  Saves = 'Saves',
  SavesInsideBox = 'Saves inside box',
  Shotmap = 'Shotmap',
  ShotsOnTarget = 'Shots on target',
  SuccessfulDribbles = 'Successful dribbles',
  Tackles = 'Tackles',
  Throws = 'Throws',
  TotalShots = 'Total shots',
  Touches = 'Touches',
  TouchesInOppositionBox = 'Touches in opposition box',
  WasFouled = 'Was fouled',
  XGNonPenalty = 'xG Non-penalty',
  XGOTFaced = 'xGOT faced',
  XGXA = 'xG + xA'
}

export interface TeamsMatchStat {
  period: Period
  stats: TeamsMatchStatStat[]
}

export enum Period {
  All = 'All',
  FirstHalf = 'FirstHalf',
  SecondHalf = 'SecondHalf'
}

export interface TeamsMatchStatStat {
  category: FluffyCategory
  stats: StatStat[]
}

export enum FluffyCategory {
  Defence = 'Defence',
  Discipline = 'Discipline',
  Duels = 'Duels',
  ExpectedGoalsXG = 'Expected goals (xG)',
  Passes = 'Passes',
  Shots = 'Shots',
  TopStats = 'Top stats'
}

export interface StatStat {
  name: string
  value: Array<number | null | string>
}
