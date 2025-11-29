export function generateQuery(
  table: string,
  columns: string[],
  values: (string | number)[][]
) {
  return `
              INSERT IGNORE INTO ${table} (${columns.join(', ')}) VALUES \n
              ${values
                .map(
                  (valueSet) =>
                    `(${valueSet
                      .map((value) =>
                        typeof value === 'number' ||
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
