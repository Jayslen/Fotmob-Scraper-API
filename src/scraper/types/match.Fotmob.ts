export interface ScrapeMatchData {
  general: General
  header: Header
  nav: string[]
  ongoing: boolean
  hasPendingVAR: boolean
  content: Content
  seo: SEO
}

export interface Content {
  matchFacts: MatchFacts
  liveticker: Liveticker
  superlive: Superlive
  buzz: null
  stats: ContentStats
  playerStats: { [key: string]: PlayerStat }
  shotmap: Shotmap
  lineup: Lineup
  hasPlayoff: boolean
  table: Table
  h2h: H2H
  momentum: Momentum
}

export interface H2H {
  summary: number[]
  matches: Match[]
}

export interface Match {
  time: Time
  matchUrl: string
  league: League
  home: MatchAway
  status: MatchStatus
  finished: boolean
  away: MatchAway
}

export interface MatchAway {
  name: NameElement
  id: string
}

export enum NameElement {
  Fulham = 'Fulham',
  ManchesterUnited = 'Manchester United'
}

export interface League {
  name: string
  id: string
  pageUrl: Link
}

export type LeagueName = string

export enum Link {
  Leagues132OverviewFaCup = '/leagues/132/overview/fa-cup',
  Leagues47OverviewPremierLeague = '/leagues/47/overview/premier-league'
}

export interface MatchStatus {
  utcTime: Date
  started: boolean
  cancelled: boolean
  finished: boolean
  awarded?: boolean
  scoreStr?: string
  reason?: ReasonClass
}

export interface ReasonClass {
  short: Short
  shortKey: ShortKey
  long: Long
  longKey: LongKey
  penalties?: string[]
}

export enum Long {
  FullTime = 'Full-Time',
  Pen34 = 'Pen 3 - 4'
}

export enum LongKey {
  Afterpenalties = 'afterpenalties',
  Finished = 'finished'
}

export enum Short {
  Ft = 'FT',
  Pen = 'Pen'
}

export enum ShortKey {
  FulltimeShort = 'fulltime_short',
  PenaltiesShort = 'penalties_short'
}

export interface Time {
  utcTime: Date
}

export interface Lineup {
  matchId: number
  lineupType: string
  source: string
  availableFilters: string[]
  homeTeam: HomeTeam
  awayTeam: AwayTeam
}

export interface AwayTeam {
  id: number
  name: NameElement
  rating: number
  formation: string
  starters: Starter[]
  unavailable?: Unavailable[]
  coach: Coach
  subs: Sub[]
  averageStarterAge: number
  totalStarterMarketValue: number
}

export interface Coach {
  id: number
  age: number
  name: string
  countryName: string
  countryCode: string
  firstName: string
  lastName: string
  primaryTeamId: number
  primaryTeamName: NameElement
  usualPlayingPositionId: null
  isCoach: boolean
}

export interface Starter {
  id: number
  age: number
  name: string
  positionId: number
  usualPlayingPositionId: number
  shirtNumber: string
  isCaptain?: boolean
  countryName: string
  countryCode: string
  horizontalLayout: AlLayout
  verticalLayout: AlLayout
  marketValue: number
  performance: Performance
  firstName: string
  lastName: string
  rankings: null
  shortName?: string
}

export interface AlLayout {
  x: number
  y: number
  height: number
  width: number
}

export interface Performance {
  rating?: number
  fantasyScore?: string
  events?: StatElement[]
  substitutionEvents?: SubstitutionEvent[]
  playerOfTheMatch?: boolean
}

export interface StatElement {
  type: EventType
}

export enum EventType {
  Assist = 'assist',
  Boolean = 'boolean',
  Double = 'double',
  FantasyPoints = 'fantasyPoints',
  Goal = 'goal',
  Integer = 'integer',
  YellowCard = 'yellowCard'
}

export interface SubstitutionEvent {
  time: number
  type: SubstitutionEventType
  reason: ReasonEnum
}

export enum ReasonEnum {
  Tactical = 'tactical'
}

export enum SubstitutionEventType {
  SubIn = 'subIn',
  SubOut = 'subOut'
}

export interface Sub {
  id: number
  age: number
  name: string
  usualPlayingPositionId: number
  shirtNumber: string
  countryName: string
  countryCode: string
  marketValue: number
  performance: Performance
  firstName: string
  lastName: string
  rankings: null
}

export interface HomeTeam {
  id: number
  name: NameElement
  rating: number
  formation: string
  starters: Starter[]
  coach: Coach
  subs: Sub[]
  unavailable?: Unavailable[]
  averageStarterAge: number
  totalStarterMarketValue: number
}

export interface Unavailable {
  id: number
  age: number
  name: string
  countryName: string
  countryCode: string
  marketValue: number
  unavailability: Unavailability
  firstName: string
  lastName: string
}

export interface Unavailability {
  injuryId: number
  type: string
  expectedReturn: string
}

export interface Liveticker {
  langs: string
  teams: NameElement[]
}

export interface MatchFacts {
  matchId: number
  highlights: Highlights
  playerOfTheMatch: PlayerOfTheMatch
  events: MatchFactsEvents
  infoBox: InfoBox
  teamForm: Array<TeamForm[]>
  poll: Poll
  topPlayers: TopPlayers
  insights: Insight[]
  momentum: Momentum
  countryCode: string
  postReview: Review[]
  preReview: Review[]
  QAData: QADatum[]
}

export interface QADatum {
  question: string
  answer: string
}

export interface MatchFactsEvents {
  ongoing: boolean
  events: EventsEvent[]
  eventTypes: string[]
  penaltyShootoutEvents: null
}

export interface EventsEvent {
  reactKey: string
  timeStr: number | string
  type: string
  time: number
  overloadTime: number | null
  eventId?: number
  player: Player
  homeScore: number
  awayScore: number
  profileUrl?: string
  overloadTimeStr?: boolean | string
  isHome?: boolean
  nameStr?: string
  firstName?: string
  lastName?: string
  fullName?: string
  playerId?: number
  card?: string
  cardDescription?: null
  minutesAddedStr?: string
  minutesAddedKey?: string
  minutesAddedInput?: number
  halfStrShort?: string
  halfStrKey?: string
  injuredPlayerOut?: boolean
  swap?: Swap[]
  ownGoal?: null
  goalDescription?: null
  goalDescriptionKey?: null
  suffix?: null
  suffixKey?: null
  isPenaltyShootoutEvent?: boolean
  newScore?: number[]
  penShootoutScore?: null
  shotmapEvent?: Shot
  assistStr?: string
  assistProfileUrl?: string
  assistPlayerId?: number
  assistKey?: string
  assistInput?: string
}

export interface Player {
  id: number | null
  name?: string
  profileUrl: string
}

export interface Shot {
  id: number
  eventType: EventTypeEnum
  teamId: number
  playerId: number
  playerName: string
  x: number
  y: number
  min: number
  minAdded: number | null
  isBlocked: boolean
  isOnTarget: boolean
  blockedX: number | null
  blockedY: number | null
  goalCrossedY: number
  goalCrossedZ: number
  expectedGoals: number
  expectedGoalsOnTarget: number
  shotType: ShotType
  situation: Situation
  period: Period
  isOwnGoal: boolean
  onGoalShot: OnGoalShot
  isSavedOffLine: boolean
  isFromInsideBox: boolean
  firstName?: string
  lastName?: string
  fullName?: string
  teamColor: TeamColorEnum
}

export enum EventTypeEnum {
  AttemptSaved = 'AttemptSaved',
  Goal = 'Goal',
  Miss = 'Miss'
}

export interface OnGoalShot {
  x: number
  y: number
  zoomRatio: number
}

export enum Period {
  FirstHalf = 'FirstHalf',
  SecondHalf = 'SecondHalf'
}

export enum ShotType {
  Header = 'Header',
  LeftFoot = 'LeftFoot',
  RightFoot = 'RightFoot'
}

export enum Situation {
  FastBreak = 'FastBreak',
  FromCorner = 'FromCorner',
  RegularPlay = 'RegularPlay',
  SetPiece = 'SetPiece'
}

export enum TeamColorEnum {
  C70101 = '#C70101',
  The000000 = '#000000'
}

export interface Swap {
  name: string
  id: string
  profileUrl: string
}

export interface Highlights {
  image: string
  url: string
  source: string
}

export interface InfoBox {
  legInfo: null
  'Match Date': MatchDate
  Tournament: Tournament
  Stadium: Stadium
  Referee: Referee
  Attendance: number
}

export interface MatchDate {
  utcTime: Date
  isDateCorrect: boolean
}

export interface Referee {
  imgUrl: string
  text: string
  country: string
}

export interface Stadium {
  name: string
  city: string
  country: string
  lat: number
  long: number
  capacity: number
  surface: string
}

export interface Tournament {
  id: number
  parentLeagueId: number
  link: Link
  leagueName: LeagueName
  roundName: string
  round: string
}

export interface Insight {
  type: string
  playerId: null
  teamId: number
  priority: number
  defaultText: string
  localizedTextId: string
  statValues: StatValue[]
  text: string
  color: TeamColorEnum
}

export interface StatValue {
  value: number
  name: NameElement | null
  type: string
}

export interface Momentum {
  main: Main
  alternateModels: any[]
}

export interface Main {
  data: Datum[]
  debugTitle: string
}

export interface Datum {
  minute: number
  value: number
}

export interface PlayerOfTheMatch {
  id: number
  name: NameClass
  teamName: NameElement
  teamId: number
  rating: Rating
  minutesPlayed: number
  shotmap: any[]
  pageUrl: string
  isHomeTeam: boolean
  stats: PlayerOfTheMatchStat[]
  role: string
  teamData: TeamData
}

export interface NameClass {
  firstName: string
  lastName: string
  fullName: string
}

export interface Rating {
  num: string
  isTop: IsTop
}

export interface IsTop {
  isTopRating: boolean
  isMatchFinished: boolean
}

export interface PlayerOfTheMatchStat {
  title: Title
  key: StatKey
  stats: PurpleStats
}

export enum StatKey {
  Attack = 'attack',
  Defense = 'defense',
  Duels = 'duels',
  TopStats = 'top_stats'
}

export interface PurpleStats {
  'FotMob rating'?: Assists
  'Minutes played'?: Assists
  Goals?: Assists
  Assists?: Assists
  'Total shots'?: Assists
  Shotmap?: Assists
  'Accurate passes'?: AccurateCrosses
  'Chances created'?: Assists
  'Fantasy points'?: Assists
  'Defensive actions'?: Assists
  Touches?: Assists
  'Touches in opposition box'?: Assists
  'Accurate long balls'?: AccurateCrosses
  Dispossessed?: Assists
  Tackles?: Assists
  Blocks?: Assists
  Clearances?: Assists
  'Headed clearance'?: Assists
  Interceptions?: Assists
  Recoveries?: Assists
  'Dribbled past'?: Assists
  'Aerial duels won'?: AccurateCrosses
  'Was fouled'?: WasFouled
  'Fouls committed'?: Assists
  'Duels lost'?: Duels
  'Ground duels won'?: AccurateCrosses
  'Duels won'?: Duels
  'Expected assists (xA)'?: Assists
  'xG + xA'?: Assists
  'Successful dribbles'?: AccurateCrosses
  'Passes into final third'?: Assists
  'Accurate crosses'?: AccurateCrosses
  Offsides?: Assists
}

export interface AccurateCrosses {
  key: AccurateCrossesKey
  stat: AccurateCrossesStat
}

export enum AccurateCrossesKey {
  AccurateCrosses = 'accurate_crosses',
  AccuratePasses = 'accurate_passes',
  AerialsWon = 'aerials_won',
  DribblesSucceeded = 'dribbles_succeeded',
  GroundDuelsWon = 'ground_duels_won',
  LongBallsAccurate = 'long_balls_accurate',
  ShotsOnTarget = 'ShotsOnTarget'
}

export interface AccurateCrossesStat {
  value: number
  total: number
  type: PurpleType
}

export enum PurpleType {
  FractionWithPercentage = 'fractionWithPercentage'
}

export interface Assists {
  key: null | string
  stat: AssistsStat
}

export interface AssistsStat {
  value?: number
  type: EventType
}

export interface Duels {
  key: string
  stat: AssistsStat
  hideInPopupCard: boolean
}

export interface WasFouled {
  key: WasFouledKey
  stat: StatElement
}

export enum WasFouledKey {
  ExpectedGoalsOnTargetVariant = 'expected_goals_on_target_variant',
  WasFouled = 'was_fouled'
}

export enum Title {
  Attack = 'Attack',
  Defense = 'Defense',
  Duels = 'Duels',
  TopStats = 'Top stats'
}

export interface TeamData {
  home: TeamDataAway
  away: TeamDataAway
}

export interface TeamDataAway {
  id: number
  color: TeamColorEnum
}

export interface Poll {
  oddspoll: Oddspoll
  renderToTop: boolean
}

export interface Oddspoll {
  PollName: string
  MatchId: number
  HomeTeamId: number
  AwayTeamId: number
  HomeTeam: string
  AwayTeam: NameElement
  Facts: Fact[]
}

export interface Fact {
  OddsType: string
  DefaultLabel: string
  TextLabelId: string
  DefaultTemplate: string
  TextTemplateId: string
  StatValues: string[]
  DefaultLabels: string[]
  LabelTemplates: string[]
  Icon: string
  defaultText: string
}

export interface Review {
  id: string
  title: string
  image: string
  description: string
  lang: string
  contentUrl?: string
  dateUpdated: Date
  source: string
  shareUrl: string
}

export interface TeamForm {
  result: number
  resultString: ResultString
  imageUrl: string
  linkToMatch: string
  date: Time
  teamPageUrl: string
  tooltipText: TooltipText
  score: string
  home: TeamFormAway
  away: TeamFormAway
}

export interface TeamFormAway {
  id: string
  name: string
  isOurTeam: boolean
}

export enum ResultString {
  D = 'D',
  L = 'L',
  W = 'W'
}

export interface TooltipText {
  utcTime: Date
  homeTeam: string
  homeTeamId: number
  homeScore: string
  awayTeam: string
  awayTeamId: number
  awayScore: string
}

export interface TopPlayers {
  homeTopPlayers: TopPlayer[]
  awayTopPlayers: TopPlayer[]
}

export interface TopPlayer {
  playerId: number
  name: NameClass
  playerRatingRounded: string
  playerRating: number
  color: AwayTopPlayerColor
  manOfTheMatch: boolean
  teamId: string
  positionLabel: PositionLabel | null
}

export enum AwayTopPlayerColor {
  RGBA2401283410 = 'rgba(240, 128, 34, 1.0)',
  RGBA5119911310 = 'rgba(51, 199, 113, 1.0)'
}

export interface PositionLabel {
  label: string
  key: string
}

export interface PlayerStat {
  name: string
  id: number
  optaId: string
  teamId: number
  teamName: NameElement
  isGoalkeeper: boolean
  stats: PlayerStatStat[]
  shotmap: Shot[]
  funFacts: FunFact[]
  isPotm?: boolean
}

export interface FunFact {
  key: string
  fallback: string
  inputValues: InputValue[]
}

export interface InputValue {
  type: InputValueType
  value: number | string
  roundTo?: number
}

export enum InputValueType {
  Double = 'double',
  Integer = 'integer',
  PlayerName = 'playerName'
}

export interface PlayerStatStat {
  title: Title
  key: StatKey
  stats: FluffyStats
}

export interface FluffyStats {
  'FotMob rating'?: Assists
  'Minutes played'?: Assists
  Goals?: Assists
  Assists?: Assists
  'Total shots'?: Assists
  Shotmap?: Assists
  'Accurate passes'?: AccurateCrosses
  'Chances created'?: Assists
  'Fantasy points'?: FantasyPoints
  'Defensive actions'?: Clearances
  Touches?: Assists
  'Touches in opposition box'?: Assists
  'Accurate long balls'?: AccurateCrosses
  Dispossessed?: Assists
  Tackles?: Clearances
  Blocks?: Assists
  Clearances?: Clearances
  'Headed clearance'?: Assists
  Interceptions?: Clearances
  Recoveries?: Assists
  'Dribbled past'?: Assists
  'Aerial duels won'?: AccurateCrosses
  'Was fouled'?: Clearances
  'Fouls committed'?: Clearances
  'Duels lost'?: Duels
  'Ground duels won'?: AccurateCrosses
  'Duels won'?: Duels
  'Expected assists (xA)'?: Assists
  'xG + xA'?: Assists
  'Successful dribbles'?: AccurateCrosses
  'Passes into final third'?: Clearances
  'Accurate crosses'?: AccurateCrosses
  Offsides?: Assists
  'Expected goals (xG)'?: Assists
  'Expected goals on target (xGOT)'?: Assists
  'Shots on target'?: AccurateCrosses
  'Blocked shots'?: Assists
  'xG Non-penalty'?: Assists
  'Big chances missed'?: Assists
  Corners?: Assists
  Saves?: Assists
  'Goals conceded'?: Assists
  'xGOT faced'?: Assists
  'Acted as sweeper'?: Assists
  'High claim'?: Assists
  'Diving save'?: Assists
  'Saves inside box'?: Assists
  Punches?: Assists
  Throws?: Assists
}

export interface Clearances {
  key: null | string
  stat: AssistsStat
  hideInPopupCard?: boolean
}

export interface FantasyPoints {
  key: null | string
  stat: PurpleStat
}

export interface PurpleStat {
  value?: number
  type: EventType
  bonus?: number
}

export interface Shotmap {
  shots: Shot[]
  Periods: ShotmapPeriods
}

export interface ShotmapPeriods {
  All: Shot[]
  FirstHalf: Shot[]
  SecondHalf: Shot[]
}

export interface ContentStats {
  Periods: StatsPeriods
}

export interface StatsPeriods {
  All: All
  FirstHalf: All
  SecondHalf: All
}

export interface All {
  stats: AllStat[]
  teamColors: TeamColors
}

export interface AllStat {
  title: string
  key: string
  stats: StatStatClass[]
}

export interface StatStatClass {
  title: string
  key: string
  stats: Array<number | null | string>
  format?: Format
  type: FluffyType
  highlighted: Highlighted
}

export enum Format {
  Double = 'double',
  Integer = 'integer',
  IntegerWithPercentage = 'integerWithPercentage'
}

export enum Highlighted {
  Away = 'away',
  Equal = 'equal',
  Home = 'home'
}

export enum FluffyType {
  Graph = 'graph',
  Text = 'text',
  Title = 'title'
}

export interface TeamColors {
  darkMode: Mode
  lightMode: Mode
  fontDarkMode: Mode
  fontLightMode: Mode
}

export interface Mode {
  home: Home
  away: string
}

export enum Home {
  C70101 = '#C70101',
  RGBA25525525510 = 'rgba(255, 255, 255, 1.0)'
}

export interface Superlive {
  superLiveUrl: null
  showSuperLive: boolean
}

export interface Table {
  leagueId: string
  url: string
  teams: number[]
  tournamentNameForUrl: LeagueName
  parentLeagueId: number
  countryCode: string
}

export interface General {
  matchId: string
  matchName: string
  matchRound: string
  teamColors: TeamColors
  leagueId: number
  leagueName: LeagueName
  leagueRoundName: string
  parentLeagueId: number
  countryCode: string
  homeTeam: GeneralAwayTeam
  awayTeam: GeneralAwayTeam
  coverageLevel: string
  matchTimeUTC: string
  matchTimeUTCDate: Date
  started: boolean
  finished: boolean
}

export interface GeneralAwayTeam {
  name: NameElement
  id: number
}

export interface Header {
  teams: Team[]
  status: HeaderStatus
  events: HeaderEvents
}

export interface HeaderEvents {
  homeTeamGoals?: HomeTeamGoals
  awayTeamGoals?: AwayTeamGoals
  homeTeamRedCards: AwayTeamGoals
  awayTeamRedCards: AwayTeamGoals
}

export interface AwayTeamGoals {
  [key: string]: GoalScorer
}

export interface HomeTeamGoals {
  [key: string]: GoalScorer
}

export interface GoalScorer {
  reactKey: string
  timeStr: number
  type: EventTypeEnum
  time: number
  overloadTime: null
  eventId: number
  player: Player
  homeScore: number
  awayScore: number
  profileUrl: string
  overloadTimeStr: boolean
  isHome: boolean
  ownGoal: null
  goalDescription: null
  goalDescriptionKey: null
  suffix: null
  suffixKey: null
  isPenaltyShootoutEvent: boolean
  nameStr: string
  firstName: string
  lastName: string
  fullName: string
  playerId: number
  newScore: number[]
  penShootoutScore: null
  shotmapEvent: Shot
  assistStr: string
  assistProfileUrl: string
  assistPlayerId: number
  assistKey: string
  assistInput: string
}

export interface HeaderStatus {
  utcTime: Date
  numberOfHomeRedCards: number
  numberOfAwayRedCards: number
  halfs: Halfs
  finished: boolean
  started: boolean
  cancelled: boolean
  awarded: boolean
  scoreStr: string
  reason: ReasonClass
  whoLostOnPenalties: null
  whoLostOnAggregated: string
}

export interface Halfs {
  firstHalfStarted: string
  firstHalfEnded: string
  secondHalfStarted: string
  secondHalfEnded: string
  firstExtraHalfStarted: string
  secondExtraHalfStarted: string
  gameEnded: string
}

export interface Team {
  name: NameElement
  id: number
  score: number
  imageUrl: string
  pageUrl: string
}

export interface SEO {
  path: string
  eventJSONLD: EventJSONLD
  breadcrumbJSONLD: BreadcrumbJSONLD[]
  faqJSONLD: FAQJSONLD
}

export interface BreadcrumbJSONLD {
  '@context': string
  '@type': string
  itemListElement: ItemListElement[]
}

export interface ItemListElement {
  '@type': Type
  position: number
  name: string
  item: string
}

export enum Type {
  ListItem = 'ListItem'
}

export interface EventJSONLD {
  '@context': string
  '@type': string
  sport: string
  homeTeam: EventJSONLDAwayTeam
  awayTeam: EventJSONLDAwayTeam
  name: string
  description: string
  startDate: Date
  endDate: Date
  eventStatus: string
  eventAttendanceMode: string
  location: Location
  image: string[]
  organizer: Organizer
  offers: Offers
  performer: Organizer[]
}

export interface EventJSONLDAwayTeam {
  '@context': string
  '@type': string
  name: NameElement
  sport: string
  logo: string
  url: string
  location: null
  memberOf: null
}

export interface Location {
  '@type': string
  name: string
  latitude: number
  longitude: number
  address: Address
}

export interface Address {
  '@type': string
  addressCountry: string
  addressLocality: string
}

export interface Offers {
  '@type': string
  url: string
  availability: string
  price: string
  priceCurrency: string
  validFrom: Date
}

export interface Organizer {
  '@type': string
  name: string
  url: string
  logo?: string
}

export interface FAQJSONLD {
  '@context': string
  '@type': string
  mainEntity: MainEntity[]
}

export interface MainEntity {
  '@type': string
  name: string
  acceptedAnswer: AcceptedAnswer
}

export interface AcceptedAnswer {
  '@type': string
  text: string
}
