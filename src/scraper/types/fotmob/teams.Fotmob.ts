export interface FotmobTeamData {
  squad: Squad
  history: {
    trophyList: TrophyList[]
  }
  overview: {
    venue: Venue
  }
}

export interface Squad {
  squad: SquadObject[]
  isNationalTeam: boolean
}

export interface SquadObject {
  title: string
  members: Member[]
}

export interface Member {
  id: number
  height: number | null
  age: number
  dateOfBirth: Date
  name: string
  ccode: string
  cname: string
  role: Role
  excludeFromRanking: boolean
  shirtNumber?: number
  positionId?: number
  injured?: boolean
  injury?: Injury | null
  rating?: number | null
  goals?: number
  penalties?: number
  assists?: number
  rcards?: number
  ycards?: number
  positionIds?: null | string
  positionIdsDesc?: null | string
  transferValue?: number
}

export interface Injury {
  id: string
  expectedReturn: string
}

export interface Role {
  key: Key
  fallback: Roles
}

export enum Roles {
  Attacker = 'Attacker',
  Coach = 'Coach',
  Defender = 'Defender',
  Keeper = 'Keeper',
  Midfielder = 'Midfielder'
}

export enum Key {
  AttackerLong = 'attacker_long',
  Coach = 'coach',
  DefenderLong = 'defender_long',
  KeeperLong = 'keeper_long',
  MidfielderLong = 'midfielder_long'
}

export interface TrophyList {
  name: string[]
  tournamentTemplateId: string[]
  area: Area[]
  ccode: Ccode[]
  won: string[]
  runnerup: string[]
  season_won: string[]
  season_runnerup: string[]
}

export enum Area {
  Europe = 'Europe',
  Spain = 'Spain',
  World = 'World'
}

export enum Ccode {
  Esp = 'ESP',
  Int = 'INT'
}

export interface Venue {
  widget: Widget
  statPairs: Array<Array<number | string>>
}

export interface Widget {
  name: string
  location: string[]
  city: string
}
