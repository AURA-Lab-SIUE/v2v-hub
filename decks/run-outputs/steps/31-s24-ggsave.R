dir.create("figures", showWarnings = FALSE)
ggsave(
  "figures/fig-top-categories.png",
  width = 7, height = 4.5, dpi = 300
)
list.files("figures")
