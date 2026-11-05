ggplot(chat_by_hour, aes(x = hour, y = messages)) +
  geom_col(fill = "#2f7d8a") +
  labs(title = "Chat volume by hour of day",
       x = "Hour of day (UTC)",
       y = "Messages in sample") +
  v2v::theme_v2v()
