# Test your own hypotheses: the finished script for guide 10 (Test Your Own Hypotheses).
# Data: episodes_analysis.RDS (this folder), the file guide 08 saves, in your workspace's data folder.
# Run it from the top in a fresh R session. MC 501 adds the expected counts, residuals, power,
# Welch's ANOVA, omega squared, Tukey, the standardized slope, and the two residual plots.

library(tidyverse)
library(v2v)
library(effectsize)
options(scipen = 10)

analysis <- read_rds("data/episodes_analysis.RDS") %>%
  transmute(
    outcome   = imdb_rating,
    group2    = factor(focus, levels = c("team", "one_ranger")),
    group3    = threat,
    predictor = season_num,
    cat_a     = threat,
    cat_b     = factor(producer, levels = c("Saban", "Disney", "Saban Brands"))
  )

glimpse(analysis)

counts <- xtabs(~ cat_a + cat_b, data = analysis)

counts

sum(counts)

chi <- chisq.test(counts)

chi

cramers_v(counts, adjust = FALSE)

round(chi$expected, 1)

round(chi$stdres, 2)

analysis %>%
  filter(!is.na(group2)) %>%
  count(group2)

analysis %>%
  filter(!is.na(outcome), !is.na(group2)) %>%
  group_by(group2) %>%
  summarize(n = n(), mean = mean(outcome), sd = sd(outcome))

t.test(outcome ~ group2, data = analysis)

cohens_d(outcome ~ group2, data = analysis)

pwr::pwr.t2n.test(n1 = 54, n2 = 52,
                  sig.level = .05,
                  power = .80)

pwr::pwr.t.test(d = 0.04,
                sig.level = .05,
                power = .80)

analysis %>%
  filter(!is.na(outcome), !is.na(group3)) %>%
  group_by(group3) %>%
  summarize(n = n(), mean = mean(outcome), sd = sd(outcome))

fit_anova <- aov(outcome ~ group3, data = analysis)

summary(fit_anova)

eta_squared(fit_anova)

oneway.test(outcome ~ group3, data = analysis)

omega_squared(fit_anova)

TukeyHSD(fit_anova)

fit_lm <- lm(outcome ~ predictor, data = analysis)

summary(fit_lm)

standardize_parameters(fit_lm)

plot(fit_lm, which = 1)

plot(fit_lm, which = 2)
