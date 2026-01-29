import { insertValues } from '../helpers/dbQuery.js'
import { PreloadDB } from '../helpers/preload.js'
import { loadMatchesData } from '../../parsers/parseScrapedData.js'
import { Entities } from '../../types/core.js'
import { dbTableInfo } from '../../dbEntities.js'
import { getMatchKey } from '../../utils/getMatchKey.js'
import { buildStatsByPeriod } from '../helpers/buildStatsByPeriod.js'
import { getMatchStatsValues } from '../helpers/getMatchstatsValues.js'
import type { InsertionArgs } from '../../types/core.js'

export async function insertMatchStats(
  entity: InsertionArgs<Entities.FullMatchTeamsMatchStats>
) {
  const { table, columns, dependenciesTables } = dbTableInfo[entity]
  const matchesData = await loadMatchesData()
  const matchesDB = await PreloadDB.matches()
  const teamsDB = await PreloadDB.teams()

  const data = matchesData.flatMap((matches) =>
    matches.matches.map((mt) => {
      const matchKey = getMatchKey(
        mt.teams[0] ?? '',
        mt.teams[1] ?? '',
        matches.league,
        matches.season,
        matches.round
      )
      const matchUUID = matchesDB.get(matchKey)
      const statsByPeriod = buildStatsByPeriod(mt.teamsMatchStats)

      const {
        All: allStats,
        FirstHalf: firstHalfStats,
        SecondHalf: secondHalfStats
      } = statsByPeriod

      return {
        teams: mt.teams,
        matchUUID,
        allStats,
        firstHalfStats,
        secondHalfStats
      }
    })
  )

  const fullMatchStats = data.map((match) => {
    const { teams, matchUUID, allStats } = match
    return { teams, matchUUID, stats: allStats }
  })
  const firstHalfStats = data.map((match) => {
    const { teams, matchUUID, firstHalfStats } = match
    return { teams, matchUUID, stats: firstHalfStats }
  })
  const secondHalfStats = data.map((match) => {
    const { teams, matchUUID, secondHalfStats } = match
    return { teams, matchUUID, stats: secondHalfStats }
  })

  // console.log(firstHalfStats)
  const fullMatchValues = getMatchStatsValues(columns, fullMatchStats, teamsDB)
  const firstHalfValues = getMatchStatsValues(columns, firstHalfStats, teamsDB)
  const secondHalfValues = getMatchStatsValues(
    columns,
    secondHalfStats,
    teamsDB
  )

  await insertValues(table, columns, fullMatchValues, entity)

  if (dependenciesTables) {
    const [firstHalfKey, secondHalfKey] = dependenciesTables

    const { columns: firstHalfColumns, table: firstHalfEntity } =
      dbTableInfo[firstHalfKey]
    const { columns: secondHalfColumns, table: secondHalfEntity } =
      dbTableInfo[secondHalfKey]

    await insertValues(
      firstHalfEntity,
      firstHalfColumns,
      firstHalfValues,
      'firstHalfTeamStats'
    )
    await insertValues(
      secondHalfEntity,
      secondHalfColumns,
      secondHalfValues,
      'secondHalfTeamStats'
    )
  }
}
