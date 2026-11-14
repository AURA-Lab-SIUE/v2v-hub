---
css: mc427-guides.css
---

# R Quick Reference

## MC 427 Social Media Analytics

Every R skill this course asks of you, in the order you meet it. Each line says what it does, what to type, and the week it is taught. You never need more than this list. **Stuck? Go to the [R Field Guide](r-field-guide.md) section with the same number.** Rows C16 to C26 are for Modules 4 to 6. You are not expected to understand them yet; each has its own Field Guide section for when you get there.

| # | What it does | What to type | Week |
|---|---|---|---|
| C1 | The R terminal: R is ready when it shows `>` | **AURA: Open an R terminal** (Ctrl+Shift+P), or `R: Create R Terminal` | 1 |
| C2 | Install the two course packages, once | **AURA: Check my setup**, then **Install what is missing**; or `install.packages(c("tidyverse", "effectsize"))` | 1 |
| C3 | Your course folder: every file you use goes in `MC427`, opened with File > Open Folder (codespace: Upload...) | File > Open Folder | 1 |
| C4 | Run a file by its name | `source("mc427-setup-check.R")`, or **Check my setup** (AURA Lab R Companion) | 1 |
| C5 | Read an R message: an error stops, a warning cautions, and the warning often names the cause | **AURA: Explain an R error**, then your AI tool; log per the AI Use Log rules | 1 |
| C6 | Keep your lines in a script (a `.R` file) and run one line; every Data Task hands you a starter script | Ctrl+Enter (Command+Return on a Mac) | 2 |
| C7 | Name a result | `players <- read_csv("file.csv")` | 2 |
| C8 | Load the tidyverse, then a data file by its name | `library(tidyverse)`, then `read_csv("nms-steam-monthly-players-2016-2026.csv")` | 2 |
| C9 | Look at a data file | `nrow(players)`, `glimpse(players)`, `players %>% slice_head(n = 6)` | 2 |
| C10 | One column, with the pipe `%>%`, which reads as "then" | `players %>% pull(avg_players)` | 2 |
| C11 | Summaries, named, in one row; count missing values with `sum(is.na(x))` | `posts %>% summarize(total = sum(posts), biggest = max(posts))` | 3 |
| C12 | Pick rows | `players %>% filter(month == "July 2018")` | 3 |
| C13 | Arithmetic on results, and rounding | `round(jul / jun, 2)` | 3 |
| C14 | Where R is looking, and what is there | `getwd()`, `list.files()` | 3 |
| C15 | Copilot Chat: ask it to explain a line, put its code in your script, run it; the Companion's Copilot tools stay off in this course | Copilot Chat panel | 3 |
| C16 | Count every pair of codes | `codes %>% count(sentiment, ai_sentiment)` | 4 |
| C17 | Compare two columns: `==` gives TRUE or FALSE, and the mean of that is the share that match | `codes %>% summarize(share = mean(a == b))` | 4 |
| C18 | Column types: numbers versus text | `glimpse(df)` | 4 |
| C19 | Text flags compare with quotes | `edited == "yes"` | 4 |
| C20 | Check Copilot's code, or the Companion's, against a result you already know | run both; compare | 4 |
| C21 | t-test: Welch's decimal df (the `parameter` column); the sign shows direction; R does not print n, `count()` does | `t.test(y ~ group, data = df) %>% broom::tidy()` | 5 |
| C22 | Chi-square and its expected counts | `chisq.test(xtabs(~ a + b, data = df))`, `xtabs(~ a + b, data = df) %>% chisq.test() %>% pluck("expected")` | 5 |
| C23 | Regression: slope, interval and p in one table; R squared in another | `lm(y ~ x, data = df) %>% broom::tidy(conf.int = TRUE)`, `lm(y ~ x, data = df) %>% broom::glance()` | 5 |
| C24 | Effect sizes from a package; `::` means "from this package" | `effectsize::cohens_d(y ~ group, data = df)`, `effectsize::cramers_v(xtabs(~ a + b, data = df))` | 5 |
| C25 | Skewed counts with zeros: add a `log1p()` column, never `log()`; NaN or -Inf means a log hit zero | `mutate(log_y = log1p(y))` | 5 |
| C26 | Draw a chart and save it to a file | `ggplot(df, aes(x = a, y = b)) + geom_col()`, `ggsave("chart.png")` | 6 |

The AURA Lab R Companion's **Write R code** command writes the C8, C9, C12, and C16 lines for you, a `mutate()` line for a new column, the C26 chart lines (Describe group, each with an alt-text line marked YOUR TURN for you to write), and the C21 to C24 test lines (Test group, from Module 5, for checking Copilot's code, C20), each with a comment above it. This table stays the reference for what each line does.

**Three habits that prevent most problems:** keep every course file in `MC427`; type column names exactly as `glimpse()` prints them; and when R prints a message, read all of it before you change anything.
