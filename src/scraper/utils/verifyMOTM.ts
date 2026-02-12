import type { PlayerOfTheMatch } from '../types/fotmob/match.Fotmob'

export function isPlayerOfTheMatch(value: unknown): value is PlayerOfTheMatch {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
