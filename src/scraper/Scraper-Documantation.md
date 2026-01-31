# Football Results Scraper

The scraper module is the one which is encharge to scrape the teams and matches results from the top 5 European League, including inserting the data scrape into a database that any of you can use for your own purposes.

The data are being scrape from [Fotmob](https://www.fotmob.com/) which is a website that holds live scores, fixtures, tables, match stats, and personalised news from over 500 football leagues around the world.

Before start to explain how the module works, it is important to mention something important:

> [!IMPORTANT]
> The data scrape from [Fotmob](https://www.fotmob.com/) is not intended to use it for any commercial purpose. The main and only purpose is to provide an open-source project for educational purposes.

## What it does?

Well as mentioned before, this module handle all the scraping process and insert the data into a database.

The scaping is being done by Playwright. Basically, what we are doing with playwright is navigating into each team or match section and with the built-in `page.waitForResponse` (which is a function that as is names said allow us to wait to a response from the server) we intercept the call the page does to an api endpoint, get the response which contains the data we are looking for and scrape it and store it into a JSON file.

Then with the insertion method is simple. We have a config files that holds all the database tables (_dbEntities.ts_) with its columns and its each dependencies tables that needs to be updated. With that info there are methods dedicated to each entity(table) that handle the insertion process.

> [!NOTE]
> In the file structure section you can observe where all this methods are being placed.

## File structure

In this module i tried to follow a clean structure where the files are organized by their functionality. The main files are:

- `main.ts`: Entry Point of the module that holds the CLI options.
- `controller/scraper.ts`: This file contains the main logic of the scraper. It handles the navigation and data extraction from Fotmob website.
- `controller/dbEntities.ts`: This file contains the configuration for the database entities. It defines the structure of each table and its dependencies.
- `controller/insertion.ts`: This file contains the methods responsible for inserting data into the database. It uses the configuration from `dbEntities.ts` to determine the insertion process.

> [!NOTE]
> Each of the controller files has a specific responsibility and each one of them call different helpers/utils functions to handle the.

### Structure

```text
.
├── commands
│   └── Commander.ts - Entry Point of the module that holds the CLI options.
│
├── Controller - Functions to handle the data extraction and insertion process.
│   ├── Insertion.ts
│   ├── ScrapeMatches.ts
│   └── ScrapeTeams.ts
│
├── Insertion - Holds functions/helpers/utils related to the insertion process.
│   ├── handlers - Methods to handle the insertion process of each entity.
│   │   ├── Country.handler.ts
│   │   ├── Matches.handler.ts
│   │   ├── MatchLineups.handler.ts
│   │   ├── MatchTeamStats.handler.ts
│   │   ├── PlayerMatchStats.handler.ts
│   │   ├── Players.handler.ts
│   │   ├── Stadiums.handler.ts
│   │   └── Teams.handler.ts
│   │
│   ├── helpers - Helpers only related to insertion process.
│   │   ├── buildPlayerMatchstatKey.ts - Helper that build statsKey related to entity player match stats.
│   │   ├── buildStatsByPeriod.ts - Helper that build stats by period related to entity match stats.
│   │   ├── dbQuery.ts - Functions to parse and build the values to insert into a column
│   │   ├── getMatchstatsValues.ts - Helper to parse/get values from team match stats.
│   │   ├── missingPlayerStats.ts - Find the missing key/value stats for player match stats.
│   │   ├── postinsert.updates.ts - Class that holds methods to insert values need it after a main insertion
│   │   ├── preinsert.ts - Class that holds methods to insert values need it before a main insertion
│   │   └── preload.ts - Class that holds methods to get database values needed for insertion
│   │
│   ├── utils - Utils only related to insertion process
│   │   ├── buildPasseskey.ts
│   │   ├── dbColumnKey.ts
│   │   ├── generateViewQuery.ts
│   │   ├── scapeSqlQuote.ts
│   │   └── uuid.helper.ts
│   │
│   └── insertion.dispatcher.ts - Function that receives a entity and call the right insertion method
│
├── parsers - Methods used for parse different data sources
│   ├── footmob.parseMatch.ts
│   ├── fotmob.parseMatch.helpers.ts
│   ├── fotmob.parseTeam.ts
│   ├── matchDataParser.ts
│   ├── parseAnswers.ts
│   └── parseScrapedData.ts
│
├── types
│   ├── core.ts
│   ├── match.Fotmob.ts
│   ├── Match.ts
│   ├── scraper.ts
│   ├── teams.Fotmob.ts
│   └── Teams.ts
│
├── utils - General utils
│   ├── createNewPage.ts
│   ├── getGoalKey.ts
│   ├── getMatchKey.ts
│   ├── scrapeMatch.ts
│   └── writeFiles.ts
│
├── bun.lock
├── config.ts - Main config files
├── dbEntities.ts - Database entities information
├── dbInstance.ts - Create connection to the database
├── main.ts - Entry point of the application
├── package.json
└── Scraper-Documentation.md
```

## Tecnologies used.

This module as main technology used _BunJS_ because of its speed, performance and the built-in features that comes with it. Also the next mentioned technologies are used:

- CommanderJS: Used to create a CLI interface for the module.
- InquirerJS: Used to create interactive command line for the CLI interface.
- Playwright: Used to scrape data from Fotmob website.

> [!NOTE]
> All the database insertions all being handle by BunJS.

## Notes

I know that the some part of the moudule are not perfect, that there are things that can be done better, but this is a proof of concept and a learning experience. Also i will refactor and fix some errors and implement new features once the project is full completed (at least the all the modules are working).
