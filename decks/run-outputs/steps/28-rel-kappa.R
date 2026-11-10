both_passes %>%
  select(threat_p1, threat_p2) %>%
  irr::kappa2()
