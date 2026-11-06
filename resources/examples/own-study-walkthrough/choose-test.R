# choose-test.R
# Guide 17: choose the test, adjust for counts and sources, check expected counts.

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
