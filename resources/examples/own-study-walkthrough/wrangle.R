# Wrangle your own data: the finished script for guide 08 (Wrangle Your Own Data).
# Data: episode-codes.csv and power_rangers_seasons.csv (both in this folder),
# both saved in your workspace's data folder. Run it from the top in a fresh R session.

library(tidyverse)
library(janitor)
library(v2v)

coded <- read_csv("data/episode-codes.csv")

glimpse(coded)

coded <- coded %>%
  clean_names()

names(coded)

coded %>%
  count(threat)

coded %>%
  count(focus)

coded <- coded %>%
  mutate(threat = str_to_lower(threat))

coded %>%
  count(threat)

seasons_raw <- read_csv("data/power_rangers_seasons.csv")

glimpse(seasons_raw)

seasons_raw %>%
  select(season_title, air_date_last_ep) %>%
  slice_tail(n = 3)

seasons <- seasons_raw %>%
  select(season_title, season_num, producer)

nrow(coded)

coded_seasons <- coded %>%
  left_join(seasons, by = join_by(season_title))

nrow(coded_seasons)

coded %>%
  anti_join(seasons, by = join_by(season_title)) %>%
  nrow()

coded_seasons <- coded_seasons %>%
  mutate(threat = factor(threat, levels = c("monster", "villain", "none"))) %>%
  mutate(focus = factor(focus, levels = c("team", "one_ranger", "other"))) %>%
  mutate(producer = factor(producer,
                           levels = c("Saban", "Saban/Disney", "Disney", "Saban Brands")))

coded_seasons %>%
  count(threat)

coded_seasons %>%
  count(focus)

coded_seasons %>%
  count(producer)

coded_seasons <- coded_seasons %>%
  mutate(desc_length = str_length(desc))

coded_seasons %>%
  select(episode_title, desc_length) %>%
  slice_head(n = 3)

coded_seasons %>%
  count(is.na(focus))

coded_seasons %>%
  count(is.na(imdb_rating))

write_rds(coded_seasons, "data/episodes_analysis.RDS")

read_rds("data/episodes_analysis.RDS") %>%
  nrow()

glimpse(coded_seasons)
