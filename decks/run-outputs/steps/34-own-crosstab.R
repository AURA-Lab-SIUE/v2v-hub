invisible(file.copy("../wk12-fixtures/episodes_analysis.RDS", "data/episodes_analysis.RDS", overwrite = TRUE))  #@@hide
episodes <- read_rds("data/episodes_analysis.RDS")

episodes %>%
  filter(!is.na(focus)) %>%
  count(threat, focus) %>%
  pivot_wider(names_from = focus,
              values_from = n,
              values_fill = 0)
