# choose-test.R
# Guide 17: choose the test, adjust for counts and sources, check expected counts.
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/power_rangers_seasons.csv
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/episodes_analysis.RDS
# 2. Put each file in the folder named data, in the list of files on the left
#    side of VS Code. This part of guide 08 shows each click, including how to
#    make the data folder:
#      https://aura-lab.siue.edu/v2v-hub/guides/mc451/08-wrangling.html#before-you-start-put-both-files-in-your-data-folder
# 3. Click the word data in that list. You should see each file's name right
#    below it.
# episodes_analysis.RDS is the file guide 08 saves at its last step. If you did not make it there,
# download it from the link above.

library(tidyverse)
library(janitor)
library(v2v)
library(effectsize)
options(scipen = 10)

seasons <- read_csv("data/power_rangers_seasons.csv", show_col_types = FALSE) %>%
  clean_names() %>%
  select(season_title, season_rating = imdb_rating)

analysis <- read_rds("data/episodes_analysis.RDS") %>%
  left_join(seasons, by = join_by(season_title)) %>%
  transmute(
    threat,
    producer,
    season_title,
    season_num,
    season_rating,
    votes = total_votes,
    votes_log = log10(total_votes + 1)
  )

glimpse(analysis)

analysis %>%
  group_by(threat) %>%
  summarize(
    n = n(),
    mean = mean(votes_log),
    sd = sd(votes_log)
  )

fit_items <- aov(votes_log ~ threat, data = analysis)
summary(fit_items)
eta_squared(fit_items)

early <- analysis %>%
  filter(season_num <= 7)

later <- analysis %>%
  filter(season_num >= 8)

summary(aov(votes_log ~ threat, data = early))
summary(aov(votes_log ~ threat, data = later))

by_season <- analysis %>%
  count(season_title, threat) %>%
  group_by(season_title) %>%
  slice_max(n, n = 1, with_ties = FALSE) %>%
  ungroup() %>%
  left_join(seasons, by = join_by(season_title))

by_season %>%
  count(threat)

fit_seasons <- aov(season_rating ~ threat, data = by_season)
summary(fit_seasons)
eta_squared(fit_seasons)

counts <- xtabs(~ threat + producer, data = analysis)
counts

chi <- chisq.test(counts)
chi$expected
