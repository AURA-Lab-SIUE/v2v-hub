# pilot-recode.R
# Guide 15: draw a pilot, make a blind re-code sheet, and line up the two passes.
# Example: the Power Rangers episode codes. data/pilot-recode-done.csv is a PRACTICE second
# pass made up for the guide, not real coding.
#
# Get the data first, in three steps.
# 1. Hold Ctrl (Cmd on a Mac) and click each link below. When VS Code asks
#    whether to open the website, click Open. Your browser saves the file in
#    your Downloads folder and shows its name for a moment near the top right
#    corner of the browser window.
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/episode-codes.csv
#      https://aura-lab.siue.edu/v2v-hub/resources/examples/own-study-walkthrough/pilot-recode-done.csv
# 2. Put each file in the folder named data, in the list of files on the left
#    side of VS Code. This part of guide 08 shows each click, including how to
#    make the data folder:
#      https://aura-lab.siue.edu/v2v-hub/guides/mc451/08-wrangling.html#before-you-start-put-both-files-in-your-data-folder
# 3. Click the word data in that list. You should see each file's name right
#    below it.

library(tidyverse)
library(janitor)

coded <- read_csv(
  "data/episode-codes.csv",
  col_types = cols(.default = col_character())
) %>%
  clean_names()

glimpse(coded)

coded <- coded %>%
  mutate(id = paste(season_title, episode_num))

coded %>%
  count(id) %>%
  filter(n > 1)

set.seed(2026)

pilot <- coded %>%
  slice_sample(n = 20)

pilot %>%
  count(threat)

first_codes <- pilot %>%
  select(id, threat_p1 = threat)

write_csv(first_codes, "data/pilot-first-codes.csv")

recode_sheet <- pilot %>%
  select(id, episode_title, desc) %>%
  mutate(threat_p2 = NA)

write_csv(recode_sheet, "data/pilot-recode.csv", na = "")

glimpse(recode_sheet)

second_codes <- read_csv(
  "data/pilot-recode-done.csv",
  col_types = cols(.default = col_character())
) %>%
  clean_names() %>%
  select(id, threat_p2) %>%
  mutate(threat_p2 = str_to_lower(threat_p2)) %>%
  mutate(threat_p2 = str_squish(threat_p2))

both_passes <- first_codes %>%
  mutate(threat_p1 = str_to_lower(threat_p1)) %>%
  mutate(threat_p1 = str_squish(threat_p1)) %>%
  left_join(second_codes, by = join_by(id))

both_passes %>%
  filter(is.na(threat_p1) | is.na(threat_p2))

write_csv(both_passes, "data/pilot-both-passes.csv", na = "")

set.seed(1204)

recode_all <- coded %>%
  slice_sample(n = 50)

nrow(recode_all)

set.seed(1204)

recode_no_pilot <- coded %>%
  anti_join(pilot, by = join_by(id)) %>%
  slice_sample(n = 50)

nrow(recode_no_pilot)
