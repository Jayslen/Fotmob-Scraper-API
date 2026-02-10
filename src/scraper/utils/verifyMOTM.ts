import type { PlayerOfTheMatch } from '../types/match.Fotmob'

export function isPlayerOfTheMatch(value: unknown): value is PlayerOfTheMatch {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
