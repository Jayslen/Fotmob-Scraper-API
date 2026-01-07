import { SQL } from 'bun'
import { databaseConfig } from './config.js'
const { user, password, host, port, database } = databaseConfig

const DB = new SQL(`mysql://${user}:${password}@${host}:${port}/${database}`)

export default DB
