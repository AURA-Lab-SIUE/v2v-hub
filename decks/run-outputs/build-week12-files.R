# Adds what the Week 12 slides (S23, S24, W12: finishing Data Wrangling and the stability check)
# need beside data/twitch_analysis.RDS. Run it after build-analysis.R, from the same workspace folder:
#   Rscript build-week12-files.R
# 1. The top-level names of a course workspace (v2v-workspace template) plus the Data Wrangling
#    worksheet, so list.files() prints what a student's Explorer shows.
# 2. data/coding-form.csv as a spreadsheet saves it: the class draw with the instructor's thirty codes.
# 3. ../wk12-fixtures/: the same sheet with a title line above the headers (what Numbers writes with
#    Include table names ticked), guide 07's example passes lined up as pilot-both-passes.csv, and
#    guide 16's episodes_analysis.RDS for the cross-tabulation slides.
suppressMessages({library(tidyverse); library(v2v)})
here <- dirname(normalizePath(sub("^--file=", "", grep("^--file=", commandArgs(FALSE), value = TRUE))))
examples <- file.path(here, "..", "..", "resources", "examples", "own-study-walkthrough")

for (d in c("00_Inbox", "01_Journal", "02_Literature", "03_Project", "04_Resources", "_templates", "data")) {
  dir.create(d, showWarnings = FALSE)
}
for (f in c("00-check-your-setup.qmd", "LICENSE", "README.md", "11-wrangling-data.qmd")) {
  if (!file.exists(f)) file.create(f)
}

set.seed(20261113)
coding_sample <- twitch_chat(channels = c("bobross", "giantwaffle")) %>%
  group_by(channel) %>%
  slice_sample(n = 15) %>%
  ungroup()
key <- c(`16240927`=0, `182383`=0, `19530370`=1, `12102429`=0, `7123505`=0, `21355154`=0,
         `1030895`=1, `4743764`=1, `20523233`=1, `16487046`=0, `1752901`=0, `17350257`=1,
         `16420513`=1, `20136170`=1, `12245366`=1, `18120069`=0, `20911955`=0, `12872810`=0,
         `871017`=1, `944535`=0, `16805041`=0, `4199373`=1, `10120228`=0, `4266571`=0,
         `16825295`=0, `16835563`=1, `21225316`=0, `5860816`=1, `10434489`=0, `5353742`=1)
form <- coding_sample %>%
  select(id, channel, message) %>%
  mutate(reaction_only = unname(key[as.character(id)]), coder_notes = "")
stopifnot(!anyNA(form$reaction_only))
write_csv(form, "data/coding-form.csv", na = "")

dir.create("../wk12-fixtures", showWarnings = FALSE)
write_lines(c("Table 1", read_lines("data/coding-form.csv")), "../wk12-fixtures/coding-form-title-row.csv")
pass <- function(f) {
  read_csv(file.path(examples, f), col_types = cols(.default = col_character())) %>%
    select(id, threat, focus)
}
both <- pass("pilot-pass-1.csv") %>%
  left_join(pass("pilot-pass-2.csv"), by = join_by(id), suffix = c("_p1", "_p2"))
write_csv(both, "../wk12-fixtures/pilot-both-passes.csv", na = "")
file.copy(file.path(examples, "episodes_analysis.RDS"), "../wk12-fixtures/episodes_analysis.RDS", overwrite = TRUE)
cat("coding-form rows:", nrow(form), " both-passes rows:", nrow(both), "\n")
