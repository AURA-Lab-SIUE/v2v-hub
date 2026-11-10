analysis %>%
  count(main_game, sort = TRUE) %>%
  head(8) %>%
  ggplot(aes(x = fct_reorder(main_game, n), y = n)) +
  geom_col(fill = "#2f7d8a") +
  coord_flip() +
  labs(x = NULL, y = "Messages") +
  v2v::theme_v2v()
