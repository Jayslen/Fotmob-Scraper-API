import DB from '../dbInstance.js'
import { handleInsertion } from '../Insertion/insertion.dispacher.js'
import { Entities } from '../types/core.js'

export async function InsertionDB(entities: Entities[]) {
  const db = await DB.getInstance()
  for (const entity of entities) {
    await handleInsertion(entity)
  }
  await db.end()
}
