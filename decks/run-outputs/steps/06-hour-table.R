chat_by_hour <- analysis %>%
  mutate(hour = hour(ts)) %>%
  count(hour, name = "messages")
chat_by_hour
