import { SQL } from 'bun'

const { STRING_DB_CONNECTION } = process.env

const DB = new SQL(STRING_DB_CONNECTION ?? '')

export default DB
