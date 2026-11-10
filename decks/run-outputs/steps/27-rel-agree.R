both_passes %>%
  summarize(
    items = n(),
    threat = mean(threat_p1 == threat_p2),
    focus = mean(focus_p1 == focus_p2)
  )
