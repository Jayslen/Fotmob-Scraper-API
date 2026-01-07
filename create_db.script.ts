import { SQL } from 'bun'

const { STRING_DB_CONNECTION } = process.env

const db = new SQL(STRING_DB_CONNECTION ?? '')

try {
  await db.file('./sql_scripts/football_database.sql')
  await db.file('./sql_scripts/views.sql')
  console.log('Database created successfully')
} catch (error) {
  console.error('Error creating database:', error)
}
