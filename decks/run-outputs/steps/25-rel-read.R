invisible(file.copy("../wk12-fixtures/pilot-both-passes.csv", "data/pilot-both-passes.csv", overwrite = TRUE))  #@@hide
both_passes <- read_csv(
  "data/pilot-both-passes.csv",
  col_types = cols(.default = col_character())
)

glimpse(both_passes)
