export interface Teams {
  country: string
  teams: Team[]
}

export interface Team {
  name: string
  players: Player[]
  trophies: Trophy[]
  stadium: Stadium
}
export interface Player {
  name: string
  birthDate: Date
  country: string
  height: number | null
  role: Role
  shirtNumber?: number
  transferValue?: number | null
  positions?: Position[]
}

export enum Position {
  CM = 'CM',
  Cam = 'CAM',
  Cb = 'CB',
  Cdm = 'CDM',
  Gk = 'GK',
  LB = 'LB',
  LM = 'LM',
  Lw = 'LW',
  Lwb = 'LWB',
  Rb = 'RB',
  Rm = 'RM',
  Rw = 'RW',
  Rwb = 'RWB',
  St = 'ST'
}

export enum Role {
  Attacker = 'Attacker',
  Coach = 'Coach',
  Defender = 'Defender',
  Keeper = 'Keeper',
  Midfielder = 'Midfielder'
}

export interface Stadium {
  name: string
  city: string
  capacity?: number
  opened?: number
  surface?: Surface
}

export enum Surface {
  Grass = 'Grass'
}

export interface Trophy {
  name: string[]
  area: any[]
  won: string[]
  runnerup: string[]
  season_won: string[]
  season_runnerup: string[]
}
