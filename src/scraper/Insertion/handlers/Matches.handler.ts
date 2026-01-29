import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadMatchesData } from '../../parsers/parseScrapedData.js'
import { Entities } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { Preinsert } from '../helpers/preinsert.js'
import { dbTableInfo } from '../../dbEntities.js'
import { PostInsertUpdates } from '../helpers/postinsert.updates.js'
import type { InsertionArgs } from '../../types/core.js'

export async function insertMatches(entity: InsertionArgs<Entities.Matches>) {
  const matchesData = await loadMatchesData()
  const { table, columns, dependenciesTables } = dbTableInfo[entity]
  await Preinsert.teams(matchesData)
  await Preinsert.stadiums(matchesData)
  await Preinsert.players(matchesData)
  await Preinsert.competitions(matchesData)
  await Preinsert.referees(matchesData)
  await Preinsert.seasons(matchesData)

  const teamsDb = await PreloadDB.teams(true)
  const stadiumsDb = await PreloadDB.stadiums(true)
  const playersDb = await PreloadDB.players(true)
  const refereesDb = await PreloadDB.referees(true)
  const competitionsDb = await PreloadDB.competitions(true)
  const seasonsDb = await PreloadDB.seasons(true)

  const matchesValues = matchesData.flatMap((round) =>
    round.matches.map((match) => {
      return [
        newUUID(),
        uuidToSQLBinary(teamsDb.get(match.teams[0] ?? '')),
        uuidToSQLBinary(teamsDb.get(match.teams[1] ?? '')),
        match.details.attendance ?? 'NULL',
        uuidToSQLBinary(seasonsDb.get(round.season)),
        uuidToSQLBinary(competitionsDb.get(round.league)),
        round.round,
        `STR_TO_DATE('${match.details.fullDate}', '%Y-%m-%dT%H:%i:%s.000Z')`,
        uuidToSQLBinary(stadiumsDb.get(match.details.stadium.name)),
        false,
        match.details.wasGameFinished,
        match.details.wasGameCancelled,
        `STR_TO_DATE('${match.details.firstHalfStarted}', '%d.%m.%Y %H:%i:%s')`,
        `STR_TO_DATE('${match.details.secondHalfStarted}', '%d.%m.%Y %H:%i:%s')`,
        `STR_TO_DATE('${match.details.firstHalfEnded}', '%d.%m.%Y %H:%i:%s')`,
        `STR_TO_DATE('${match.details.secondHalfEnded}', '%d.%m.%Y %H:%i:%s')`,
        match.details.highlights,
        match.details.referee
          ? uuidToSQLBinary(refereesDb.get(match.details.referee))
          : 'NULL',
        match.matchFacts.manOfTheMatch
          ? uuidToSQLBinary(playersDb.get(match.matchFacts.manOfTheMatch))
          : 'NULL'
      ]
    })
  )
  await insertValues(table, columns, matchesValues, 'matches')

  // dependencies entities
  if (dependenciesTables) {
    const [goalsKey, assistsKey, cardsKey] = dependenciesTables

    await PostInsertUpdates.matchesGoals({
      matchesData,
      ...dbTableInfo[goalsKey]
    })
    await PostInsertUpdates.matchesAssists({
      matchesData,
      ...dbTableInfo[assistsKey]
    })
    await PostInsertUpdates.matchCards({
      matchesData,
      ...dbTableInfo[cardsKey]
    })
  }
}
