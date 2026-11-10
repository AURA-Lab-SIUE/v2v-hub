episodes %>%
  filter(!is.na(focus)) %>%
  count(threat, focus) %>%
  group_by(threat) %>%
  mutate(share = round(n / sum(n), 3))
invisible(file.remove("data/episodes_analysis.RDS"))  #@@hide
