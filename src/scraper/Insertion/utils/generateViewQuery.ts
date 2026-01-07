import { ENTITIES_VIEWS } from '../../types/core.js'

export function getViewQuery(table: ENTITIES_VIEWS) {
  return `SELECT * FROM preload_${table}_view`
}
