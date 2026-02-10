import { z } from 'zod'

export function preprocessRoundString(val: string) {
  if (!val) return undefined
  const number = parseInt(val)
  if (isNaN(number)) return z.undefined
  return number
}
