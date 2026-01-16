DROP DATABASE IF EXISTS football_results;
CREATE DATABASE football_results;
USE football_results;

CREATE TABLE IF NOT EXISTS `seasons` (
    `season_id` BINARY(16) NOT NULL UNIQUE,
    `season` VARCHAR(9) NOT NULL,
    `date_start` DATE,
    `date_end` DATE,
    PRIMARY KEY (`season_id`),
    UNIQUE (`season`)
);

INSERT INTO seasons (season_id, season)
VALUES (UUID_TO_BIN(UUID()), '2024-2025'), (UUID_TO_BIN(UUID()), '2023-2024');

CREATE TABLE IF NOT EXISTS `countries` (
	`country_id` BINARY(16) NOT NULL UNIQUE,
	`country` VARCHAR(80) NOT NULL,
	PRIMARY KEY(`country_id`),
	UNIQUE(`country`)
);

CREATE TABLE IF NOT EXISTS `positions` (
	`position_id` BINARY(16) NOT NULL UNIQUE,
	`position` VARCHAR(25) NOT NULL,
	PRIMARY KEY(`position_id`),
	UNIQUE(`position`)
);

CREATE TABLE IF NOT EXISTS `stadiums` (
	`stadium_id` BINARY(16) NOT NULL UNIQUE,
	`stadium` VARCHAR(50) NOT NULL,
	`city` VARCHAR(50),
	`capacity` INTEGER,
	`inaguration` INTEGER,
	`surface` VARCHAR(15),
	PRIMARY KEY(`stadium_id`),
	UNIQUE(`stadium`)
);

CREATE TABLE IF NOT EXISTS `competitions` (
	`league_id` BINARY(16) NOT NULL UNIQUE,
	`league_name` VARCHAR(30) NOT NULL,
	`country_id` BINARY(16),
	PRIMARY KEY(`league_id`),
	UNIQUE(`league_name`)
);

CREATE TABLE IF NOT EXISTS `teams` (
	`team_id` BINARY(16) NOT NULL UNIQUE,
	`name` VARCHAR(50) NOT NULL,
	`country_id` BINARY(16),
	`stadium_id` BINARY(16),
	PRIMARY KEY(`team_id`),
	UNIQUE(`name`, `country_id`)
);

CREATE TABLE IF NOT EXISTS `players` (
	`player_id` BINARY(16) NOT NULL UNIQUE,
	`player_name` VARCHAR(80) NOT NULL,
    `shirt_number` INTEGER,
	`height` INTEGER,
	`market_value` INTEGER,
	`team_id` BINARY(16),
	`country_id` BINARY(16),
	PRIMARY KEY(`player_id`),
	UNIQUE(`player_name`, `team_id`, `country_id`)
);

CREATE TABLE IF NOT EXISTS `player_positions` (
	`player_id` BINARY(16) NOT NULL,
	`position_id` BINARY(16) NOT NULL,
	PRIMARY KEY(`player_id`, `position_id`),
	UNIQUE(`player_id`, `position_id`)
);

CREATE TABLE IF NOT EXISTS `referee` (
	`referee_id` BINARY(16) NOT NULL UNIQUE,
	`referee_name` VARCHAR(65),
    UNIQUE(referee_name),
	PRIMARY KEY(`referee_id`)
);

CREATE TABLE IF NOT EXISTS `match_lineups` (
	`lineup_id` BINARY(16) NOT NULL UNIQUE,
	`match_id` BINARY(16) NOT NULL,
	`team_id` BINARY(16) NOT NULL,
	`lineup` VARCHAR(255),
    UNIQUE(team_id, match_id),
	PRIMARY KEY(`lineup_id`)
);

CREATE TABLE IF NOT EXISTS `match_lineup_players` (
	`ln_player_id` BINARY(16) NOT NULL UNIQUE,
	`player_id` BINARY(16) NOT NULL,
	`lineup_id` BINARY(16) NOT NULL,
	`status` ENUM('starter', 'bench', 'unavailable') NOT NULL,
    UNIQUE(player_id, lineup_id),
	PRIMARY KEY(`ln_player_id`)
);

CREATE TABLE IF NOT EXISTS `match_cards` (
	`mc_id` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
	`player_id` BINARY(16) NOT NULL,
	`card` ENUM('Red', 'Yellow', 'YellowRed') NOT NULL,
	`main_minute` INTEGER NOT NULL,
	`added_minute` INTEGER,
    UNIQUE(match_id, player_id,card, main_minute),
	PRIMARY KEY(`mc_id`)
);

CREATE TABLE IF NOT EXISTS `matches` (
	`match_id` BINARY(16) NOT NULL UNIQUE,
	`home_team_id` BINARY(16) NOT NULL,
	`visit_team_id` BINARY(16) NOT NULL,
	`attendance` INTEGER,
	`season` BINARY(16),
	`competition` BINARY(16) COMMENT 'Si es null es un amistoso',
	`match_week` INTEGER,
	`match_date` DATE,
	`stadium_id` BINARY(16),
	`is_neutral` BOOLEAN DEFAULT false,
	`was_game_finished` BOOLEAN NOT NULL DEFAULT true,
	`was_game_cancelled` BOOLEAN NOT NULL DEFAULT false,
	`first_half_started` DATETIME,
	`second_half_started` DATETIME,
	`first_half_ended` DATETIME,
	`second_half_ended` DATETIME,
	`highlights` VARCHAR(255),
	`referee_id` BINARY(16),
	`man_of_the_match` BINARY(16),
	PRIMARY KEY(`match_id`),
	UNIQUE(`home_team_id`, `visit_team_id`, `competition`, `match_week`, `season`)
);

CREATE TABLE IF NOT EXISTS `match_goals` (
	`goal_id` BINARY(16),
	`match_id` BINARY(16) NOT NULL,
	`player_id` BINARY(16) NOT NULL,
	`scored_for` BINARY(16) NOT NULL,
    `scored_to` BINARY(16) NOT NULL,
	`main_minute` INTEGER,
	`added_minute` INTEGER DEFAULT NULL,
	`is_own_goal` BOOLEAN DEFAULT NULL,
    `is_penalty` BOOLEAN DEFAULT NULL,
	PRIMARY KEY(`goal_id`),
    FOREIGN KEY(scored_to) REFERENCES teams(team_id),
	UNIQUE(`match_id`, `player_id`, `scored_for`, `main_minute`)
);

CREATE TABLE IF NOT EXISTS `match_assists` (
	`assists_id` BINARY(16),
	`player_id` BINARY(16) NOT NULL,
	`goal_assisted` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
    UNIQUE(player_id, goal_assisted),
	PRIMARY KEY(`assists_id`)
);

ALTER TABLE match_assists
ADD UNIQUE(player_id, goal_assisted);

CREATE TABLE IF NOT EXISTS `player_matches_stats` (
	`id` BINARY(16) NOT NULL UNIQUE,
	`player_id` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
	`accurate_crosses` INTEGER,
	`accurate_long_balls` INTEGER,
	`accurate_passes` INTEGER,
	`acted_as_sweeper` INTEGER,
	`aerial_duels_lost` INTEGER,
	`aerial_duels_won` INTEGER,
	`assists` INTEGER,
	`big_chances_missed` INTEGER,
	`blocked_shots` INTEGER,
	`blocks` INTEGER,
	`chances_created` INTEGER,
	`clearances` INTEGER,
	`clearance_off_the_line` INTEGER,
	`conceded_penalty` INTEGER,
	`corners` INTEGER,
	`crosses` INTEGER,
	`defensive_actions` INTEGER,
	`dispossessed` INTEGER,
	`diving_save` INTEGER,
	`dribbled_past` INTEGER,
	`duels_lost` INTEGER,
	`duels_won` INTEGER,
	`error_led_to_goal` INTEGER,
	`expected_assists_xa` INTEGER,
	`expected_goals_xg` INTEGER,
	`expected_goals_on_target_xgot` INTEGER,
    `fantasy_points` INTEGER,
	`fotmob_rating` DECIMAL(3,2),
	`fouls_committed` INTEGER,
	`goals` INTEGER,
	`goals_conceded` INTEGER,
	`goals_prevented` INTEGER,
	`ground_duels_lost` INTEGER,
	`ground_duels_won` INTEGER,
	`headed_clearance` INTEGER,
	`high_claim` INTEGER,
	`hit_woodwork` INTEGER,
	`inaccurate_crosses` INTEGER,
	`inaccurate_long_balls` INTEGER,
	`inaccurate_passes` INTEGER,
	`interceptions` INTEGER,
	`last_man_tackle` INTEGER,
	`minutes_played` INTEGER,
	`missed_penalty` INTEGER,
	`offsides` INTEGER,
	`own_goal` INTEGER,
	`passes_into_final_third` INTEGER,
	`penalties_won` INTEGER,
	`punches` INTEGER,
	`recoveries` INTEGER,
	`saved_penalties` INTEGER,
	`saves` INTEGER,
	`saves_inside_box` INTEGER,
	`shotmap` INTEGER,
	`shots_off_target` INTEGER,
	`shots_on_target` INTEGER,
	`successful_dribbles` INTEGER,
	`tackles` INTEGER,
	`throws` INTEGER,
	`total_aerial_duels` INTEGER,
	`total_crosses` INTEGER,
	`total_dribbles` INTEGER,
	`total_ground_duels` INTEGER,
	`total_long_balls` INTEGER,
	`total_passes` INTEGER,
	`touches` INTEGER,
	`total_shots` INTEGER,
	`total_shots_on_target` INTEGER,
	`touches_in_opposition_box` INTEGER,
	`unsuccessful_dribbles` INTEGER,
	`was_fouled` INTEGER,
	`xg_plus_xa` INTEGER,
	`xg_non_penalty` INTEGER,
	`xgot_faced` INTEGER,
	PRIMARY KEY(`id`),
	UNIQUE(`player_id`, `match_id`)
);

CREATE TABLE IF NOT EXISTS `full_match_team_stats` (
	`id` BINARY(16) NOT NULL UNIQUE,
	`team_id` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
	`ball_possession` INTEGER,
	`expected_goals_(xg)` DECIMAL(4,3),
	`total_shots` INTEGER,
	`shots_on_target` INTEGER,
	`big_chances` INTEGER,
	`big_chances_missed` INTEGER,
	`accurate_passes` INTEGER,
	`fouls_committed` INTEGER,
	`corners` INTEGER,
	`shots_off_target` INTEGER,
	`blocked_shots` INTEGER,
	`hit_woodwork` INTEGER,
	`shots_inside_box` INTEGER,
	`shots_outside_box` INTEGER,
	`xg_open_play` DECIMAL(4,3),
	`xg_set_play` DECIMAL(4,3),
	`xg_non-penalty` DECIMAL(4,3),
	`xg_on_target_(xgot)` DECIMAL(4,3),
	`passes` INTEGER,
	`own_half_passes` INTEGER,
	`opposition_half_passes` INTEGER,
	`accurate_long_balls` INTEGER,
	`accurate_crosses` INTEGER,
	`throws` INTEGER,
	`offsides` INTEGER,
	`tackles` INTEGER,
	`interceptions` INTEGER,
	`blocks` INTEGER,
	`clearances` INTEGER,
	`keeper_saves` INTEGER,
	`duels_won` INTEGER,
	`ground_duels_won` INTEGER,
	`aerial_duels_won` INTEGER,
	`successful_dribbles` INTEGER,
	`yellow_cards` INTEGER,
	`red_cards` INTEGER,
	`touches_in_opposition_box` INTEGER,
    UNIQUE(team_id, match_id),
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `first_half_match_team_stats` (
	`id` BINARY(16) NOT NULL UNIQUE,
	`team_id` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
	`ball_possession` INTEGER,
	`expected_goals_(xg)` DECIMAL(4,3),
	`total_shots` INTEGER,
	`shots_on_target` INTEGER,
	`big_chances` INTEGER,
	`big_chances_missed` INTEGER,
	`accurate_passes` INTEGER,
	`fouls_committed` INTEGER,
	`corners` INTEGER,
	`shots_off_target` INTEGER,
	`blocked_shots` INTEGER,
	`hit_woodwork` INTEGER,
	`shots_inside_box` INTEGER,
	`shots_outside_box` INTEGER,
	`xg_open_play` DECIMAL(4,3),
	`xg_set_play` DECIMAL(4,3),
	`xg_non-penalty` DECIMAL(4,3),
	`xg_on_target_(xgot)` DECIMAL(4,3),
	`passes` INTEGER,
	`own_half_passes` INTEGER,
	`opposition_half_passes` INTEGER,
	`accurate_long_balls` INTEGER,
	`accurate_crosses` INTEGER,
	`throws` INTEGER,
	`offsides` INTEGER,
	`tackles` INTEGER,
	`interceptions` INTEGER,
	`blocks` INTEGER,
	`clearances` INTEGER,
	`keeper_saves` INTEGER,
	`duels_won` INTEGER,
	`ground_duels_won` INTEGER,
	`aerial_duels_won` INTEGER,
	`successful_dribbles` INTEGER,
	`yellow_cards` INTEGER,
	`red_cards` INTEGER,
	`touches_in_opposition_box` INTEGER,
    UNIQUE(team_id, match_id),
	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `second_half_match_team_stats` (
	`id` BINARY(16) NOT NULL UNIQUE,
	`team_id` BINARY(16) NOT NULL,
	`match_id` BINARY(16) NOT NULL,
	`ball_possession` INTEGER,
	`expected_goals_(xg)` DECIMAL(4,3),
	`total_shots` INTEGER,
	`shots_on_target` INTEGER,
	`big_chances` INTEGER,
	`big_chances_missed` INTEGER,
	`accurate_passes` INTEGER,
	`fouls_committed` INTEGER,
	`corners` INTEGER,
	`shots_off_target` INTEGER,
	`blocked_shots` INTEGER,
	`hit_woodwork` INTEGER,
	`shots_inside_box` INTEGER,
	`shots_outside_box` INTEGER,
	`xg_open_play` DECIMAL(4,3),
	`xg_set_play` DECIMAL(4,3),
	`xg_non-penalty` DECIMAL(4,3),
	`xg_on_target_(xgot)` DECIMAL(4,3),
	`passes` INTEGER,
	`own_half_passes` INTEGER,
	`opposition_half_passes` INTEGER,
	`accurate_long_balls` INTEGER,
	`accurate_crosses` INTEGER,
	`throws` INTEGER,
	`offsides` INTEGER,
	`tackles` INTEGER,
	`interceptions` INTEGER,
	`blocks` INTEGER,
	`clearances` INTEGER,
	`keeper_saves` INTEGER,
	`duels_won` INTEGER,
	`ground_duels_won` INTEGER,
	`aerial_duels_won` INTEGER,
	`successful_dribbles` INTEGER,
	`yellow_cards` INTEGER,
	`red_cards` INTEGER,
	`touches_in_opposition_box` INTEGER,
    UNIQUE(team_id, match_id),
	PRIMARY KEY(`id`)
);


/* competitions.country_id -> countries */
ALTER TABLE `competitions`
  ADD CONSTRAINT fk_competitions_country
  FOREIGN KEY(`country_id`) REFERENCES `countries`(`country_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* teams.country_id -> countries */
ALTER TABLE `teams`
  ADD CONSTRAINT fk_teams_country
  FOREIGN KEY(`country_id`) REFERENCES `countries`(`country_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* teams.stadium_id -> stadiums */
ALTER TABLE `teams`
  ADD CONSTRAINT fk_teams_stadium
  FOREIGN KEY(`stadium_id`) REFERENCES `stadiums`(`stadium_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* players.team_id -> teams */
ALTER TABLE `players`
  ADD CONSTRAINT fk_players_team
  FOREIGN KEY(`team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* players.country_id -> countries */
ALTER TABLE `players`
  ADD CONSTRAINT fk_players_country
  FOREIGN KEY(`country_id`) REFERENCES `countries`(`country_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* player_positions -> players, positions */
ALTER TABLE `player_positions`
  ADD CONSTRAINT fk_player_positions_player
  FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `player_positions`
  ADD CONSTRAINT fk_player_positions_position
  FOREIGN KEY(`position_id`) REFERENCES `positions`(`position_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

/* matches.home_team_id and visit_team_id -> teams */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_home_team
  FOREIGN KEY(`home_team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_visit_team
  FOREIGN KEY(`visit_team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

/* matches.stadium_id -> stadiums */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_stadium
  FOREIGN KEY(`stadium_id`) REFERENCES `stadiums`(`stadium_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* matches.competition -> competitions(league_id) */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_competition
  FOREIGN KEY(`competition`) REFERENCES `competitions`(`league_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* matches.season -> seasons */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_season
  FOREIGN KEY(`season`) REFERENCES `seasons`(`season_id`)
  ON UPDATE CASCADE ON DELETE SET NULL;

/* match_goals -> matches, players, teams */
ALTER TABLE `match_goals`
  ADD CONSTRAINT fk_match_goals_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `match_goals`
  ADD CONSTRAINT fk_match_goals_player
  FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `match_goals`
  ADD CONSTRAINT fk_match_goals_team
  FOREIGN KEY(`scored_for`) REFERENCES `teams`(`team_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

/* player_matches_stats -> players, matches */
ALTER TABLE `player_matches_stats`
  ADD CONSTRAINT fk_pms_player
  FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `player_matches_stats`
  ADD CONSTRAINT fk_pms_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE CASCADE ON DELETE CASCADE;

/* matches.referee_id -> referee */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_referee
  FOREIGN KEY(`referee_id`) REFERENCES `referee`(`referee_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

/* matches.man_of_the_match -> players */
ALTER TABLE `matches`
  ADD CONSTRAINT fk_matches_man_of_match
  FOREIGN KEY(`man_of_the_match`) REFERENCES `players`(`player_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

/* match_lineups.match_id -> matches and team -> teams */
ALTER TABLE `match_lineups`
  ADD CONSTRAINT fk_lineups_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `match_lineups`
  ADD CONSTRAINT fk_lineups_team
  FOREIGN KEY(`team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

/* match_lineup_players -> players, match_lineups */
ALTER TABLE `match_lineup_players`
  ADD CONSTRAINT fk_ln_players_player
  FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `match_lineup_players`
  ADD CONSTRAINT fk_ln_players_lineup
  FOREIGN KEY(`lineup_id`) REFERENCES `match_lineups`(`lineup_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

/* match_cards -> matches, players */
ALTER TABLE `match_cards`
  ADD CONSTRAINT fk_match_cards_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `match_cards`
  ADD CONSTRAINT fk_match_cards_player
  FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

/* stats tables: full_match_team_stats, first_half and second_half -> teams, matches */
ALTER TABLE `full_match_team_stats`
  ADD CONSTRAINT fk_fullmts_team
  FOREIGN KEY(`team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `full_match_team_stats`
  ADD CONSTRAINT fk_fullmts_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `first_half_match_team_stats`
  ADD CONSTRAINT fk_first_team
  FOREIGN KEY(`team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `first_half_match_team_stats`
  ADD CONSTRAINT fk_first_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `second_half_match_team_stats`
  ADD CONSTRAINT fk_second_team
  FOREIGN KEY(`team_id`) REFERENCES `teams`(`team_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `second_half_match_team_stats`
  ADD CONSTRAINT fk_second_match
  FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`)
  ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE `match_assists`
ADD CONSTRAINT fk_goal_assisted
FOREIGN KEY(`goal_assisted`) REFERENCES `match_goals`(`goal_id`);

ALTER TABLE `match_assists`
ADD CONSTRAINT fk_assist_match
FOREIGN KEY(`match_id`) REFERENCES `matches`(`match_id`);

ALTER TABLE `match_assists`
ADD CONSTRAINT fk_assist_player
FOREIGN KEY(`player_id`) REFERENCES `players`(`player_id`);


-- ALTER TABLE `matches`
-- ADD FOREIGN KEY(`match_id`) REFERENCES `match_assists`(`match_id`)
-- ON UPDATE NO ACTION ON DELETE NO ACTION;

SELECT * FROM players;
SELECT BIN_TO_UUID(goal_id,1) AS goal_id,
		BIN_TO_UUID(match_id,1) AS match_id,
        BIN_TO_UUID(player_id,1) AS player_id,
        BIN_TO_UUID(scored_for,1) AS team_id,
        main_minute,
        added_minute,
        is_own_goal,
        is_penalty
FROM match_goals;
