export type TeamMatchStatEntry = {
  name: string
  value: (number | string | null)[]
}

export type StatsByPeriod = Record<string, TeamMatchStatEntry[]>
