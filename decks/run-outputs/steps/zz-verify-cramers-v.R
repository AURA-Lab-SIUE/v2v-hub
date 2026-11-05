# Not on a slide: checks the W12 define-box example (Cramer's V of 0.15 for viewer band by channel type).
analysis %>%
  count(viewer_band, channel_type)
effectsize::cramers_v(table(analysis$viewer_band, analysis$channel_type))
