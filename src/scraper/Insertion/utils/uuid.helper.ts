export function newUUID() {
  return `UUID_TO_BIN('${Bun.randomUUIDv7()}', 1)`
}

export function uuidToSQLBinary(uuid: string | undefined) {
  return uuid ? `UUID_TO_BIN('${uuid}',1)` : 'NULL'
}
