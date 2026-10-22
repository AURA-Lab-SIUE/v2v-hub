# 02-pilot-stability.R
# Stability of my own coding: pass 1 against pass 2 on the pilot tweets.
# One coder, two passes at least 48 hours apart, pass 1 codes hidden during pass 2.

options(scipen = 999)
library(tidyverse)
library(v2v)

pilot <- read_csv(
  "MC501-pilot-codes.csv",
  col_types = cols(tweet_id = col_character())
)

# Percent agreement for each variable
pilot %>%
  summarize(
    items = n(),
    learning = mean(learning_p1 == learning_p2),
    tone = mean(tone_p1 == tone_p2),
    affordance = mean(affordance_p1 == affordance_p2),
    constraint = mean(constraint_p1 == constraint_p2)
  ) %>%
  print()

# Krippendorff's alpha for each variable (nominal; tone also ordinal below)
tibble(
  variable = c("learning", "tone", "affordance", "constraint"),
  alpha = c(
    reliability(pilot$learning_p1, pilot$learning_p2, method = "alpha")$statistic,
    reliability(pilot$tone_p1, pilot$tone_p2, method = "alpha")$statistic,
    reliability(pilot$affordance_p1, pilot$affordance_p2, method = "alpha")$statistic,
    reliability(pilot$constraint_p1, pilot$constraint_p2, method = "alpha")$statistic
  )
) %>%
  mutate(alpha = round(alpha, 3)) %>%
  print()

# Tone has an order, so check it with the ordinal metric too
irr::kripp.alpha(rbind(pilot$tone_p1, pilot$tone_p2), method = "ordinal")$value %>%
  round(3)

# The items the two passes disagree on
pilot %>%
  filter(
    learning_p1 != learning_p2 | tone_p1 != tone_p2 |
      affordance_p1 != affordance_p2 | constraint_p1 != constraint_p2
  ) %>%
  select(tweet_id, ends_with("_p1"), ends_with("_p2")) %>%
  print(width = Inf)

# Sensitivity: the smallest association 150 tweets can detect for H1
# (learning reference by tone, a 2 x 3 table, df = 2)
pwr::pwr.chisq.test(N = 150, df = 2, sig.level = 0.05, power = 0.80)

# RQ2 compares the benefit-obstacle balance (four groups) by learning reference,
# a 2 x 4 table, df = 3
pwr::pwr.chisq.test(N = 150, df = 3, sig.level = 0.05, power = 0.80)
