import path from 'node:path'
import fs from 'node:fs/promises'
import db from '../../dbInstance.js'

export async function insertValues(
  table: string,
  columns: string[],
  values: (string | number | boolean)[][],
  entity: string,
  msg?: string
) {
  const query = generateQuery(table, columns, values)
  try {
    const results = await db.unsafe(query)
    if (results.affectedRows > 0) {
      console.log(msg ?? `Inserted ${results.affectedRows} rows into ${entity}`)
    } else {
      console.log(`No rows inserted into ${entity}`)
    }
  } catch (error: any) {
    const errorMsg = `Error inserting ${entity}: ${error.message}`
    const errorsPath = path.join(process.cwd(), '/debug/logs-errors')
    await fs.mkdir(errorsPath, { recursive: true })
    console.error(errorMsg)
    await Bun.write(
      path.join(errorsPath, `error-${entity}.txt`),
      `${errorMsg}\n${query}`
    )
  }
}

function generateQuery(
  table: string,
  columns: string[],
  values: (string | number | boolean)[][]
) {
  return `
              INSERT IGNORE INTO ${table} (${columns.join(', ')}) VALUES
              ${values
                .map(
                  (valueSet) =>
                    `(${valueSet
                      .map((value) =>
                        typeof value === 'number' ||
                        typeof value === 'boolean' ||
                        value.startsWith('UUID_TO_BIN(') ||
                        value.startsWith('(SELECT') ||
                        value.startsWith('STR_TO_DATE(') ||
                        value === 'NULL'
                          ? value
                          : `'${value}'`
                      )
                      .join(', ')})`
                )
                .join(',\n')}
          `
}
