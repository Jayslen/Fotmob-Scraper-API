import { randomUUID } from 'node:crypto'
import { insertValues } from './dbQuery.js'
import { PreloadDB } from './preload.js'
import { scapeQuote } from '../../utils/scapeSqlQuote.js'
import { InsertionEntity } from '../../types/core.js'
import { loadMatchesData, loadTeamsData } from '../parse/parseScrapedData.js'
import { dbTableInfo, LEAGUES_AVAILABLE } from 'src/scraper/config.js'

const { Country, Stadium, Teams, Players, Matches } = InsertionEntity

export async function handleInsertion(
  insertion: InsertionEntity,
  table: string,
  columns: string[],
  dependenciesTables?: Record<string, { table: string; columns: string[] }>
) {
  const teamsData = await loadTeamsData()
  const matchesData = await loadMatchesData()
  switch (insertion) {
    case Country:
      const values = [
        ...new Set(
          teamsData.flatMap((team) =>
            team.players.map((player) => player.country)
          )
        )
      ].map((country) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(country)
      ])
      return await insertValues(table, columns, values, insertion)
    case Stadium:
      const stadiums = teamsData
        .map((team) => team.stadium)
        .map((stadium) => [
          `UUID_TO_BIN('${randomUUID()}',1)`,
          scapeQuote(stadium.name),
          scapeQuote(stadium.city),
          stadium.capacity ?? 0,
          stadium.opened || 'NULL',
          stadium.surface ? scapeQuote(stadium.surface) : 'NULL'
        ])
      return await insertValues(table, columns, stadiums, insertion)
    case Teams: {
      const teamsDB = await PreloadDB.countries()
      const stadiumDB = await PreloadDB.stadiums()
      const teams = teamsData.map((team) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(team.name),
        `UUID_TO_BIN('${teamsDB.get(team.country)}',1)`,
        `UUID_TO_BIN('${stadiumDB.get(team.stadium.name)}',1)`
      ])
      return await insertValues(table, columns, teams, insertion)
    }
    case Players: {
      const teamsDB = await PreloadDB.teams()
      const countriesDb = await PreloadDB.countries()
      const players = teamsData.flatMap((team) =>
        team.players.map((pl) => ({ ...pl, team: team.name }))
      )
      const playersValues = players.map((pl) => [
        `UUID_TO_BIN('${randomUUID()}',1)`,
        scapeQuote(pl.name),
        pl.shirtNumber ?? 'NULL',
        pl.height ?? 'NULL',
        pl.transferValue ?? 'NULL',
        `UUID_TO_BIN('${teamsDB.get(pl.team)}',1)`,
        `UUID_TO_BIN('${countriesDb.get(pl.country)}',1)`
      ])
      await insertValues(table, columns, playersValues, insertion)
      if (dependenciesTables) {
        const { positions, playerPositions } = dependenciesTables
        const positionsValues = [
          ...new Set(players.flatMap((pl) => pl.positions))
        ]
          .filter((pos) => pos !== undefined)
          .map((pos) => [`UUID_TO_BIN('${randomUUID()}',1)`, pos])

        await insertValues(
          positions.table,
          positions.columns,
          positionsValues,
          'positions'
        )
        const positionsDB = await PreloadDB.positions()
        const playersDB = await PreloadDB.players()

        const playerPositionsValues = players.flatMap((pl) => {
          return (
            pl.positions?.map((pos) => [
              `UUID_TO_BIN('${playersDB.get(pl.name)}',1)`,
              `UUID_TO_BIN('${positionsDB.get(pos)}',1)`
            ]) ?? []
          )
        })

        await insertValues(
          playerPositions.table,
          playerPositions.columns,
          playerPositionsValues,
          'playerPositions'
        )
      }
    }
    case Matches: {
      {
        const teamsDb = await PreloadDB.teams()
        const stadiumsDb = await PreloadDB.stadiums()
        const countriesDb = await PreloadDB.countries()
        const playersDb = await PreloadDB.players()
        const competitionsDb = await PreloadDB.competitions()

        const teamsToAdd = Array.from(
          new Map(
            matchesData
              .flatMap((matches) =>
                matches.matches.flatMap((mt) =>
                  mt.teams.map((team) => ({
                    team,
                    competition: matches.league
                  }))
                )
              )
              .filter(({ team }) => !teamsDb.has(team))
              .map((item) => [item.team, item]) // key = team name
          ).values()
        )
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

        if (teamsToAdd.length > 0) {
          const teamsTable = dbTableInfo[Teams]
          const teamsValues = teamsToAdd.map(({ team, competition }) => {
            const teamCountry = LEAGUES_AVAILABLE.find(
              (lg) => lg.name.toLowerCase() === competition.toLowerCase()
            )
            const countryId = countriesDb.get(teamCountry?.country ?? '')
            return [
              `UUID_TO_BIN('${randomUUID()}', 1)`,
              scapeQuote(team),
              countryId ? `UUID_TO_BIN('${countryId}',1)` : 'NULL',
              'NULL'
            ]
          })
          await insertValues(
            teamsTable.table,
            teamsTable.columns,
            teamsValues,
            'teams'
          )
        }
        if (stadiumsToAdd.length > 0) {
          const stadiumTable = dbTableInfo[Stadium]
          const values = stadiumsToAdd.map(({ name, capacity, surface }) => {
            return [
              `UUID_TO_BIN('${randomUUID()}',1)`,
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
              `UUID_TO_BIN('${randomUUID()}', 1)`,
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
            .flatMap((matches) =>
              matches.matches.map((mt) => mt.details.referee)
            )
            .map((referee) => [
              `UUID_TO_BIN('${randomUUID()}', 1)`,
              scapeQuote(referee)
            ])
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
            seasons.map((season) => [
              `UUID_TO_BIN('${randomUUID()}', 1)`,
              season
            ]),
            'seasons'
          )

          if (competitionsToAdd.length > 0) {
            const { table: competitionTable, columns: competitionColumns } =
              dependenciesTables.competitions
            const competitionsValues = competitionsToAdd.map((c) => [
              `UUID_TO_BIN('${randomUUID()}',1)`,
              scapeQuote(c)
            ])
            console.log(competitionsValues)

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
            `UUID_TO_BIN('${randomUUID()}',1)`,
            `UUID_TO_BIN('${teamsDb.get(match.teams[0])}', 1)`,
            `UUID_TO_BIN('${teamsDb.get(match.teams[1])}', 1)`,
            match.details.attendance ?? 'NULL',
            `UUID_TO_BIN('${seasonsDb.get(round.season)}', 1)`,
            `UUID_TO_BIN('${competitionsDb.get(round.league)}', 1)`,
            round.round,
            `STR_TO_DATE('${match.details.fullDate}', '%Y-%m-%dT%H:%i:%s.000Z')`,
            `UUID_TO_BIN('${stadiumsDb.get(match.details.stadium.name)}', 1)`,
            false,
            match.details.wasGameFinished,
            match.details.wasGameCancelled,
            `STR_TO_DATE('${match.details.firstHalfStarted}', '%d.%m.%Y %H:%i:%s')`,
            `STR_TO_DATE('${match.details.secondHalfStarted}', '%d.%m.%Y %H:%i:%s')`,
            `STR_TO_DATE('${match.details.firstHalfEnded}', '%d.%m.%Y %H:%i:%s')`,
            `STR_TO_DATE('${match.details.secondHalfEnded}', '%d.%m.%Y %H:%i:%s')`,
            match.details.highlights,
            match.details.referee
              ? `UUID_TO_BIN('${refereesDb.get(match.details.referee)}', 1)`
              : 'NULL',
            match.matchFacts.manOfTheMatch
              ? `UUID_TO_BIN('${playersDb.get(match.matchFacts.manOfTheMatch)}', 1)`
              : 'NULL'
          ]
        })
      )
      await insertValues(table, columns, matchesValues, 'matches')
    }
  }
}
