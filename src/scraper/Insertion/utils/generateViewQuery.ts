import { ENTITIES_VIEWS } from '../../types/database/entities'

export function getViewQuery(table: ENTITIES_VIEWS) {
  return `SELECT * FROM preload_${table}_view`
}
