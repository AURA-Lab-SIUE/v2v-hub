# Wrangle your own data: the finished script for guide 08 (Wrangle Your Own Data).
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/episode-codes.csv
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/power_rangers_seasons.csv
# 2. Put each file in the folder named data, in the list of files on the left
#    side of VS Code. This part of guide 08 shows each click, including how to
#    make the data folder:
#      https://aura-lab.siue.edu/v2v-hub/guides/mc451/08-wrangling.html#before-you-start-put-both-files-in-your-data-folder
# 3. Click the word data in that list. You should see each file's name right
#    below it.
# Run it from the top in a fresh R session.

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
