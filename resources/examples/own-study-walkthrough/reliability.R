# reliability.R
# Guide 07: check your reliability in R, pass 1 against pass 2.
# Example: 20 Power Rangers pilot episodes, coded twice for threat and focus.
# data/pilot-pass-2.csv is a PRACTICE second pass made up for the guide.
# Lines marked CHANGE are the ones you edit for your own study.
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/pilot-pass-1.csv
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/pilot-pass-2.csv
# 2. Put each file in the folder named data, in the list of files on the left
#    side of VS Code. This part of guide 08 shows each click, including how to
#    make the data folder:
#      https://aura-lab.siue.edu/v2v-hub/guides/mc451/08-wrangling.html#before-you-start-put-both-files-in-your-data-folder
# 3. Click the word data in that list. You should see each file's name right
#    below it.

library(tidyverse)

# Part 1: prepare your code sheet --------------------------------------

# Read each pass as text, so long ids keep every digit.
# Keep the id and your code columns. CHANGE: file names and column names.
pass_1 <- read_csv(
  "data/pilot-pass-1.csv",
  col_types = cols(.default = col_character())
) %>%
  select(id, threat, focus)

pass_2 <- read_csv(
  "data/pilot-pass-2.csv",
  col_types = cols(.default = col_character())
) %>%
  select(id, threat, focus)

# Line the passes up by id. Columns become threat_p1, threat_p2, and so on.
both_passes <- pass_1 %>%
  left_join(pass_2, by = join_by(id), suffix = c("_p1", "_p2"))

# Any item missing a code in either pass? This should print 0 rows.
# CHANGE: one is.na() pair per variable.
both_passes %>%
  filter(is.na(threat_p1) | is.na(threat_p2) | is.na(focus_p1) | is.na(focus_p2))

# Save the side-by-side sheet. Guide 15 makes this same file.
write_csv(both_passes, "data/pilot-both-passes.csv", na = "")

# Part 2: run the check -------------------------------------------------

# Read the side-by-side sheet back, as text.
both_passes <- read_csv(
  "data/pilot-both-passes.csv",
  col_types = cols(.default = col_character())
)

glimpse(both_passes)

# Every pair of codes, for one variable. A typo shows up as its own row.
both_passes %>%
  count(threat_p1, threat_p2)

# Percent agreement: the share of items where the two passes match.
# CHANGE: one line per variable.
both_passes %>%
  summarize(
    items = n(),
    threat = mean(threat_p1 == threat_p2),
    focus = mean(focus_p1 == focus_p2)
  )

# The items you coded differently. Reread these against your codebook.
both_passes %>%
  filter(threat_p1 != threat_p2) %>%
  select(id, threat_p1, threat_p2)

both_passes %>%
  filter(focus_p1 != focus_p2) %>%
  select(id, focus_p1, focus_p2)

# Cohen's kappa, one variable at a time.
both_passes %>%
  select(threat_p1, threat_p2) %>%
  irr::kappa2()

both_passes %>%
  select(focus_p1, focus_p2) %>%
  irr::kappa2()

# Krippendorff's alpha wants numbers, so list your codes once.
# match() turns each code into its place in the list. CHANGE: your codes.
threat_codes <- c("monster", "villain", "none")

both_passes %>%
  select(threat_p1, threat_p2) %>%
  mutate(threat_p1 = match(threat_p1, threat_codes)) %>%
  mutate(threat_p2 = match(threat_p2, threat_codes)) %>%
  t() %>%
  irr::kripp.alpha(method = "nominal")

focus_codes <- c("team", "one_ranger", "other")

both_passes %>%
  select(focus_p1, focus_p2) %>%
  mutate(focus_p1 = match(focus_p1, focus_codes)) %>%
  mutate(focus_p2 = match(focus_p2, focus_codes)) %>%
  t() %>%
  irr::kripp.alpha(method = "nominal")
