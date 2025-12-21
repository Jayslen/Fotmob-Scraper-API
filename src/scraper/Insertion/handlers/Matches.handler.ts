import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadMatchesData } from '../../parsers/parseScrapedData.js'
import { InsertionArgs, InsertionEntity } from '../../types/core.js'
import { newUUID, uuidToSQLBinary } from '../helpers/uuid.helper.js'
import { scapeQuote } from '../helpers/scapeSqlQuote.js'
import { dbTableInfo } from '../../config.js'
import { Preinsert } from '../helpers/preinsert.js'

export async function insertMatches(input: InsertionArgs) {
  const matchesData = await loadMatchesData()
  const { table, columns, dependenciesTables } = input

  await Preinsert.teams(matchesData)
  {
    const stadiumsDb = await PreloadDB.stadiums()
    const playersDb = await PreloadDB.players()
    const competitionsDb = await PreloadDB.competitions()

    const { Stadium, Players, Teams } = InsertionEntity

    const stadiumsToAdd = Array.from(
      new Map(
        matchesData.flatMap((matches) =>
          matches.matches.flatMap((mt) => {
            const stadium = mt.details.stadium

            if (stadiumsDb.has(stadium.name)) return []

            return [[stadium.name, { stadium }]]
          })
        )
      ).values()
    ).map((std) => std.stadium)
    const playersToAdd = matchesData
      .flatMap((matches) =>
        matches.matches.flatMap((mt) => {
          return mt.goals.flatMap((pl) => {
            return pl.flatMap((goal) => goal.name)
          })
        })
      )
      .concat(
        matchesData.flatMap((matches) =>
          matches.matches.map((mt) => {
            return mt.matchFacts.manOfTheMatch
          })
        )
      )
      .filter((player) => !playersDb.has(player))
    const competitionsToAdd = matchesData
      .map((mt) => mt.league)
      .filter((competition) => !competitionsDb.has(competition))

    if (stadiumsToAdd.length > 0) {
      const stadiumTable = dbTableInfo[Stadium]
      const values = stadiumsToAdd.map(({ name, capacity, surface }) => {
        return [
          newUUID(),
          scapeQuote(name),
          'NULL',
          capacity ?? 'NULL',
          'NULL',
          surface ?? 'NULL'
        ]
      })
      await insertValues(
        stadiumTable.table,
        stadiumTable.columns,
        values,
        'stadiums'
      )
    }
    if (playersToAdd.length > 0) {
      const playerTable = dbTableInfo[Players]
      const values = playersToAdd.map((player) => {
        return [
          newUUID(),
          scapeQuote(player),
          'NULL',
          'NULL',
          'NULL',
          'NULL',
          'NULL'
        ]
      })
      await insertValues(
        playerTable.table,
        playerTable.columns,
        values,
        'players'
      )
    }

    if (dependenciesTables) {
      const { table: refereeTable, columns: refereeColumns } =
        dependenciesTables.referee
      const refereesValues = matchesData
        .flatMap((matches) => matches.matches.map((mt) => mt.details.referee))
        .map((referee) => [newUUID(), scapeQuote(referee)])
      await insertValues(
        refereeTable,
        refereeColumns,
        refereesValues,
        'referees'
      )
      const seasons = [...new Set(matchesData.map((mt) => mt.season))]
      await insertValues(
        'seasons',
        ['season_id', 'season'],
        seasons.map((season) => [newUUID(), season]),
        'seasons'
      )

      if (competitionsToAdd.length > 0) {
        const { table: competitionTable, columns: competitionColumns } =
          dependenciesTables.competitions
        const competitionsValues = competitionsToAdd.map((c) => [
          newUUID(),
          scapeQuote(c)
        ])

        await insertValues(
          competitionTable,
          competitionColumns,
          competitionsValues,
          'competitions'
        )
      }
    }
  }

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
}
