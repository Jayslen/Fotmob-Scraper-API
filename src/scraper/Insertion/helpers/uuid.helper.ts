import { randomUUID, UUID } from 'node:crypto'
import { sqlUUID } from '../../types/core.js'

export function newUUID(): sqlUUID {
  return `UUID_TO_BIN('${randomUUID()}', 1)`
}

export function uuidToSQLBinary(uuid: string | undefined) {
  return uuid ? `UUID_TO_BIN('${uuid}',1)` : 'NULL'
}
