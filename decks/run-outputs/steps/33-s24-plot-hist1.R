ggplot(analysis, aes(x = message_length)) +
  geom_histogram(binwidth = 5) +
  labs(x = "Message length (characters)",
       y = "Messages") +
  v2v::theme_v2v()
