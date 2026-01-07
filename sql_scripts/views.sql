CREATE VIEW preload_countries_view AS
SELECT BIN_TO_UUID(country_id, 1) AS country_id, country
FROM countries;

CREATE VIEW preload_stadiums_view AS
SELECT BIN_TO_UUID(stadium_id, 1) AS stadium_id, stadium
FROM stadiums;

CREATE VIEW preload_teams_view AS
SELECT BIN_TO_UUID(team_id,1) AS team_id, name
FROM teams;

CREATE VIEW preload_positions_view AS
SELECT BIN_TO_UUID(position_id, 1) AS position_id, position
FROM positions;

CREATE VIEW preload_players_view AS
SELECT BIN_TO_UUID(player_id, 1) AS player_id, player_name
FROM players;

CREATE VIEW preload_referees_view AS
SELECT BIN_TO_UUID(referee_id, 1) AS referee_id, referee_name
FROM referee;


CREATE VIEW preload_competitions_view AS
SELECT BIN_TO_UUID(league_id, 1) AS league_id, league_name
FROM competitions;

CREATE VIEW preload_seasons_view AS
SELECT BIN_TO_UUID(season_id, 1) AS season_id, season
FROM seasons;

CREATE VIEW preload_matches_view AS
SELECT
  BIN_TO_UUID(m.match_id,1) AS match_id,
  ht.name AS home_team,
  vt.name AS visit_team,
  c.league_name AS competition,
  s.season AS season,
  m.match_week
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.team_id
LEFT JOIN teams vt ON m.visit_team_id = vt.team_id
LEFT JOIN competitions c ON m.competition = c.league_id
LEFT JOIN seasons s ON m.season = s.season_id;

CREATE VIEW preload_goals_view AS
SELECT BIN_TO_UUID(goal_id,1) AS goal_id,
        BIN_TO_UUID(match_id,1) AS match_id,
        BIN_TO_UUID(player_id,1) AS player_id,
        BIN_TO_UUID(scored_for,1) AS scored_for,
        main_minute
        FROM match_goals;
