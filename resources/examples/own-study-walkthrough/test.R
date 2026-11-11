# Test your own hypotheses: the finished script for guide 10 (Test Your Own Hypotheses).
# Run it from the top in a fresh R session. MC 501 adds the expected counts, residuals, power,
# Welch's ANOVA, omega squared, Tukey, the standardized slope, and the two residual plots.
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
