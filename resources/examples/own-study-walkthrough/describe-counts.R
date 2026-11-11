# describe-counts.R
# Guide 16: describe a coded category against a skewed count and a source measure.
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/episodes_analysis.RDS
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/power_rangers_seasons.csv
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
options(scipen = 10)

episodes <- read_rds("data/episodes_analysis.RDS")
dir.create("figures", showWarnings = FALSE)

episodes %>%
  count(threat) %>%
  mutate(percent = round(100 * n / sum(n), 1))

episodes %>%
  summarize(
    n = n(),
    mean = mean(total_votes),
    median = median(total_votes),
    sd = sd(total_votes),
    max = max(total_votes)
  )

episodes %>%
  group_by(threat) %>%
  summarize(
    n = n(),
    mean = mean(total_votes),
    median = median(total_votes),
    sd = sd(total_votes)
  )

fig_votes_hist <- episodes %>%
  ggplot(aes(x = total_votes)) +
  geom_histogram(binwidth = 25, boundary = 0) +
  labs(
    title = "How many IMDb votes each episode has",
    x = "IMDb votes, in bins 25 votes wide",
    y = "Episodes",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "Most episodes have under 75 votes; a second group sits near 250 to 300, and a few pass 500."
  ) +
  theme_v2v()

fig_votes_hist
ggsave("figures/votes-histogram.png", fig_votes_hist,
       width = 7, height = 4.5, dpi = 300)

fig_votes_log <- episodes %>%
  ggplot(aes(x = total_votes)) +
  geom_histogram(bins = 20) +
  scale_x_log10() +
  labs(
    title = "IMDb votes on a log scale",
    x = "IMDb votes (log scale)",
    y = "Episodes",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "On a log scale the votes split into two groups: 78 episodes with 21 to 126 votes, 42 with 192 to 564."
  ) +
  theme_v2v()

fig_votes_log
ggsave("figures/votes-log-histogram.png", fig_votes_log,
       width = 7, height = 4.5, dpi = 300)

fig_votes_threat <- episodes %>%
  ggplot(aes(x = threat, y = total_votes)) +
  geom_boxplot(outlier.shape = NA) +
  geom_jitter(width = 0.15, alpha = 0.6) +
  scale_y_log10() +
  labs(
    title = "IMDb votes by the threat in the episode",
    x = "Threat (hand-coded)",
    y = "IMDb votes (log scale)",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "Votes by threat: monster has the highest median, near 190; every group has dots in both vote groups."
  ) +
  theme_v2v()

fig_votes_threat
ggsave("figures/votes-by-threat.png", fig_votes_threat,
       width = 7, height = 4.5, dpi = 300)

episodes %>%
  group_by(season_num) %>%
  summarize(
    episodes = n(),
    median_votes = median(total_votes)
  ) %>%
  print(n = 25)

seasons <- read_csv("data/power_rangers_seasons.csv") %>%
  clean_names() %>%
  select(season_title, season_rating = imdb_rating)

episodes <- episodes %>%
  left_join(seasons, by = join_by(season_title))

episodes %>%
  summarize(
    episodes = n(),
    seasons = n_distinct(season_title),
    season_ratings = n_distinct(season_rating)
  )

episodes %>%
  count(season_title, season_rating, sort = TRUE)

episodes %>%
  distinct(season_title, season_rating) %>%
  summarize(
    seasons = n(),
    mean = mean(season_rating),
    median = median(season_rating)
  )
