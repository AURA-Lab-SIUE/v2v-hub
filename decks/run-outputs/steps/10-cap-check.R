msglen %>%
  summarize(
    longest = max(message_length, na.rm = TRUE),
    longest_shown = max(length_shown, na.rm = TRUE)
  )
