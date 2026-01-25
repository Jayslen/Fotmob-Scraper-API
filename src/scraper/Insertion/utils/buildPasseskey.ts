import { normalizeDbColumnName } from './dbColumnKey.js'

export function buildPassesKey(name: string): string {
  const base = normalizeDbColumnName(name)

  if (['Own half', 'Opposition half'].includes(name)) {
    return `${base}_passes`
  }

  return `${base}_passes`
}
