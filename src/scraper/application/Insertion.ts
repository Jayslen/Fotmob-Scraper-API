import db from '../dbInstance.js'
import { handleInsertion } from '../Insertion/insertion.dispacher.js'
import { Entities } from '../types/database/entities.js'

export async function InsertionDB(entities: Entities[]) {
  for (const entity of entities) {
    await handleInsertion(entity)
  }
  await db.close()
}
