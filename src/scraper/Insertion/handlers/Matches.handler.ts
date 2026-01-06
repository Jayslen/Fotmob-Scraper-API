import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadMatchesData } from '../../parsers/parseScrapedData.js'
import { Entities, InsertionArgs } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../utils/uuid.helper.js'
import { Preinsert } from '../helpers/preinsert.js'
import { getMatchKey } from '../utils/getMatchKey.js'
import { dbTableInfo } from 'src/scraper/dbEntities.js'
import { getGoalKey } from '../utils/getGoalKey.js'

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
        uuidToSQLBinary(teamsDb.get(match.teams[0])),
        uuidToSQLBinary(teamsDb.get(match.teams[1])),
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

  const matchesDb = await PreloadDB.matches(true)

  if (dependenciesTables) {
    const [goalsKey, assistsKey] = dependenciesTables
    const { table: goalsTable, columns: goalsColumns } = dbTableInfo[goalsKey]
    const { table: assistsTable, columns: assistsColumns } =
      dbTableInfo[assistsKey]

    const mathesGoals = matchesData.flatMap((matches) =>
      matches.matches.flatMap((mt) =>
        mt.goals.flatMap((g) =>
          g.map((goal) => {
            const teamScoredAgainst =
              goal.scoredFor === 0 ? mt.teams[1] : mt.teams[0]
            return [
              newUUID(),
              uuidToSQLBinary(
                matchesDb.get(
                  getMatchKey(
                    mt.teams[0],
                    mt.teams[1],
                    matches.league,
                    matches.season,
                    matches.round
                  )
                )
              ),
              uuidToSQLBinary(playersDb.get(goal.name)),
              uuidToSQLBinary(teamsDb.get(mt.teams[goal.scoredFor])),
              uuidToSQLBinary(teamsDb.get(teamScoredAgainst)),
              goal.minute,
              goal.addedTime ?? 'NULL',
              goal.ownGoal ?? 'NULL',
              goal.penalty ?? 'NULL'
            ]
          })
        )
      )
    )
    await insertValues(goalsTable, goalsColumns, mathesGoals, 'matchGoals')

    const goalsDB = await PreloadDB.goals()
    const assist = matchesData
      .flatMap((matches) =>
        matches.matches.flatMap((mt) =>
          mt.goals.flatMap((g) =>
            g.map((goal) => {
              if (!goal.assistBy) return undefined
              const matchKey = getMatchKey(
                mt.teams[0],
                mt.teams[1],
                matches.league,
                matches.season,
                matches.round
              )
              const matchUUID = matchesDb.get(matchKey)
              const teamScoreForUUID = teamsDb.get(mt.teams[goal.scoredFor])
              const assisterUUID = playersDb.get(goal.assistBy)
              const goalScorerUUID = playersDb.get(goal.name)

              const goalKey = getGoalKey({
                match_id: matchUUID as string,
                player_id: goalScorerUUID as string,
                scored_for: teamScoreForUUID as string,
                main_minute: goal.minute
              })
              const goalUUID = goalsDB.get(goalKey)
              return [
                newUUID(),
                uuidToSQLBinary(assisterUUID),
                uuidToSQLBinary(goalUUID),
                uuidToSQLBinary(matchUUID)
              ]
            })
          )
        )
      )
      .filter((assist) => assist !== undefined)

    await insertValues(assistsTable, assistsColumns, assist, 'matchAssists')
  }
}
