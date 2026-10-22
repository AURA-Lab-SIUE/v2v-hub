# 02-pilot-stability.R
# Stability of my own coding: pass 1 against pass 2 on the 20 pilot tweets.
# One coder, two passes 72 hours apart, pass 1 codes hidden during pass 2.

options(scipen = 999)
library(tidyverse)
library(v2v)

pilot <- read_csv(
  "MC451-pilot-codes.csv",
  col_types = cols(tweet_id = col_character())
)

pilot %>%
  summarize(
    items = n(),
    learning = mean(learning_p1 == learning_p2),
    tone = mean(tone_p1 == tone_p2),
    affordance = mean(affordance_p1 == affordance_p2),
    constraint = mean(constraint_p1 == constraint_p2)
  )

reliability(pilot$tone_p1, pilot$tone_p2, method = "alpha")$statistic
reliability(pilot$affordance_p1, pilot$affordance_p2, method = "alpha")$statistic
reliability(pilot$constraint_p1, pilot$constraint_p2, method = "alpha")$statistic
