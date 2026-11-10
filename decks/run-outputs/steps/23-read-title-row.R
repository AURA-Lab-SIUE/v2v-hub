invisible(file.copy("data/coding-form.csv", "../wk12-fixtures/coding-form-good.csv", overwrite = TRUE))  #@@hide
invisible(file.copy("../wk12-fixtures/coding-form-title-row.csv", "data/coding-form.csv", overwrite = TRUE))  #@@hide
read_csv("data/coding-form.csv") %>%
  glimpse()
invisible(file.copy("../wk12-fixtures/coding-form-good.csv", "data/coding-form.csv", overwrite = TRUE))  #@@hide
