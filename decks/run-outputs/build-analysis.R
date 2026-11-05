# Rebuilds data/twitch_analysis.RDS exactly as the Data Wrangling worksheet (starters/11) does,
# with the instructor's thirty codes from examples/r-worksheets-2026-10/keydata/make-key-form.R.
# Run from an empty workspace folder: Rscript build-analysis.R
suppressMessages({library(tidyverse); library(janitor); library(v2v)})
options(scipen = 10)

set.seed(20261113)                                   # starter 11, Task 0.1
coding_sample <- twitch_chat(channels = c("bobross", "giantwaffle")) %>%
  group_by(channel) %>%
  slice_sample(n = 15) %>%
  ungroup()

chat <- twitch_chat()                                # Parts 1 to 3
streams <- twitch_streams()
chat <- chat %>%
  mutate(ts = as_datetime(date / 1000))
streams <- streams %>%
  mutate(ts = as_datetime(date / 1000))
chat <- chat %>%
  mutate(message_length = str_length(message))
snapshots <- streams %>%
  select(channel, snapshot_ts = ts, game, viewers)
chat_streams <- chat %>%
  left_join(snapshots, by = join_by(channel, closest(ts >= snapshot_ts)))
channels <- twitch_channels()                        # Part 4
analysis <- chat_streams %>%
  left_join(channels, by = "channel")

key <- c(`16240927`=0, `182383`=0, `19530370`=1, `12102429`=0, `7123505`=0, `21355154`=0,
         `1030895`=1, `4743764`=1, `20523233`=1, `16487046`=0, `1752901`=0, `17350257`=1,
         `16420513`=1, `20136170`=1, `12245366`=1, `18120069`=0, `20911955`=0, `12872810`=0,
         `871017`=1, `944535`=0, `16805041`=0, `4199373`=1, `10120228`=0, `4266571`=0,
         `16825295`=0, `16835563`=1, `21225316`=0, `5860816`=1, `10434489`=0, `5353742`=1)
codes <- tibble(id = as.numeric(names(key)), reaction_only = unname(key))
matched <- sum(codes$id %in% coding_sample$id)
cat("key ids matching the seeded draw:", matched, "of 30\n")
if (matched < 30) {                                   # the draw changed: code the new thirty
  stop("the key no longer matches the class draw; update the key before using this build")
}
codes <- codes %>%                                   # Part 5
  mutate(reaction_only = factor(reaction_only, levels = c(0, 1),
                                labels = c("commentary", "reaction")))
analysis <- analysis %>%
  left_join(codes, by = "id")
dir.create("data", showWarnings = FALSE)
write_rds(analysis, "data/twitch_analysis.RDS")      # Part 7
cat("rows:", nrow(analysis), " cols:", ncol(analysis), "\n")
print(count(analysis, reaction_only))
