# Describe your own data: the finished script for guide 09 (Describe Your Own Data).
# Run it from the top in a fresh R session. The last three blocks are the MC 501 diagnostics.
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
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
library(v2v)

options(scipen = 10)

episodes <- read_rds("data/episodes_analysis.RDS")

dir.create("figures", showWarnings = FALSE)

episodes %>%
  count(threat)

episodes %>%
  count(threat) %>%
  mutate(percent = round(100 * n / sum(n), 1))

episodes %>%
  count(focus) %>%
  mutate(percent = round(100 * n / sum(n), 1))

episodes %>%
  count(producer) %>%
  mutate(percent = round(100 * n / sum(n), 1))

episodes %>%
  summarize(
    n      = sum(!is.na(imdb_rating)),
    mean   = mean(imdb_rating, na.rm = TRUE),
    median = median(imdb_rating, na.rm = TRUE),
    sd     = sd(imdb_rating, na.rm = TRUE)
  )

episodes %>%
  group_by(threat) %>%
  summarize(
    n      = n(),
    mean   = mean(imdb_rating),
    median = median(imdb_rating),
    sd     = sd(imdb_rating)
  )

episodes %>%
  filter(!is.na(focus)) %>%
  group_by(focus) %>%
  summarize(
    n      = n(),
    mean   = mean(imdb_rating),
    median = median(imdb_rating),
    sd     = sd(imdb_rating)
  )

episodes %>%
  count(producer, threat) %>%
  pivot_wider(names_from = threat, values_from = n, values_fill = 0)

episodes %>%
  count(producer, threat) %>%
  group_by(producer) %>%
  mutate(share = round(n / sum(n), 3))

fig_threat_producer <- episodes %>%
  ggplot(aes(x = producer, fill = threat)) +
  geom_bar(position = "fill") +
  scale_y_continuous(labels = scales::percent_format()) +
  scale_fill_v2v() +
  labs(
    title = "The threat in each episode, by producer",
    x = "Producer of the season",
    y = "Share of coded episodes",
    fill = "Threat (hand-coded)",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "Filled bars by producer: Disney mostly villain, Saban Brands half no threat."
  ) +
  theme_v2v()

fig_threat_producer

ggsave("figures/threat-by-producer.png", fig_threat_producer,
       width = 7, height = 4.5, dpi = 300)

fig_rating_threat <- episodes %>%
  ggplot(aes(x = threat, y = imdb_rating)) +
  geom_boxplot(outlier.shape = NA) +
  geom_jitter(width = 0.15, alpha = 0.6) +
  labs(
    title = "IMDb rating by the threat in the episode",
    x = "Threat (hand-coded)",
    y = "IMDb rating (1 to 10)",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "Rating by threat: monster episodes lowest, villain and no threat near 7.8."
  ) +
  theme_v2v()

fig_rating_threat

ggsave("figures/rating-by-threat.png", fig_rating_threat,
       width = 6, height = 4.5, dpi = 300)

fig_rating_hist <- episodes %>%
  ggplot(aes(x = imdb_rating)) +
  geom_histogram(binwidth = 0.5, boundary = 0) +
  labs(
    title = "How the IMDb ratings spread out",
    x = "IMDb rating (1 to 10), in bins half a point wide",
    y = "Episodes",
    caption = "Source: 120 Power Rangers episodes, drawn at random and hand-coded.",
    alt = "Ratings run from 5.5 to 9.5, most between 6.5 and 8, peaking at 7 to 7.5."
  ) +
  theme_v2v()

fig_rating_hist

ggsave("figures/rating-histogram.png", fig_rating_hist,
       width = 7, height = 4.5, dpi = 300)

expected <- chisq.test(xtabs(~ producer + threat, data = episodes))$expected

round(expected, 1)

episodes %>%
  group_by(threat) %>%
  summarize(n = n(), sd = sd(imdb_rating), iqr = IQR(imdb_rating))

episodes %>%
  group_by(threat) %>%
  filter(imdb_rating > quantile(imdb_rating, 0.75) + 1.5 * IQR(imdb_rating)) %>%
  select(threat, imdb_rating, episode_title)

episodes %>%
  group_by(producer) %>%
  summarize(n      = n(),
            mean   = mean(imdb_rating),
            median = median(imdb_rating),
            sd     = sd(imdb_rating))
