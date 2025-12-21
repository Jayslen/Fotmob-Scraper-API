import DB from '../dbInstance.js'
import { dbTableInfo } from '../config.js'
import { handleInsertion } from '../Insertion/insertion.dispacher.js'
import { InsertionEntity } from '../types/core.js'

export async function InsertionDB(entities: InsertionEntity[]) {
  const db = await DB.getInstance()
  for (const entity of entities) {
    await handleInsertion({
      insertion: entity,
      ...dbTableInfo[entity]
    })
  }
  await db.end()
}
