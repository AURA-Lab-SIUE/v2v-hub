---
css: mc427-guides.css
---

# R Field Guide

## MC 427 Social Media Analytics

This guide has one section for each line of the **[R Quick Reference](r-quick-reference.md)**, with the same number. Each section says when you need the skill, shows it working on a course file with the exact result R prints, lists the messages it usually produces and how to fix them, and gives a question that works well in your AI tool.

**All 26 sections are here, C1 to C26.** Sections C16 to C26 belong to Modules 4 to 6; you are not expected to read them before the module that uses them.

**When you are stuck:** stop after 15 minutes on any one step. Copy the exact message and run **Explain an R error** from the AURA Lab R Companion first; if that does not settle it, paste the message into your AI tool and log what it said. The companion is not an AI tool, so an explanation from it alone needs no AI Use Log entry. If you are still stuck, email me with a screenshot or post on the Questions and Concerns board.

**Two ways to run a Companion command.** Every **AURA:** command on this page has a keyboard route and a click route. Keyboard: press **Ctrl+Shift+P** (**Command+Shift+P** on a Mac), type the command's name, and press **Enter**. Click: select the **AURA Lab R Companion** icon in the bar at the far left of VS Code; its panel lists the same commands under **My setup**, **Data**, **Describe**, **Test: a check on Copilot's code**, **Your steps**, and **Help**, and you select one to run it.

---

## C1. The R terminal and its `>` prompt (week 1)

**When you need it:** every time you run R. R lives in a panel at the bottom of VS Code.

**How:** press **Ctrl+Shift+P** (**Command+Shift+P** on a Mac), type `AURA: Open an R terminal`, and press **Enter**. R is ready for you when the last line is `>`. The R extension's own command, `R: Create R Terminal`, opens the same terminal.

If no `>` ever appears, run **AURA: Check my setup** from the Command Palette: it finds R on your computer and says what is missing.

**Messages you will meet:**

- **A `+` instead of `>`.** R is waiting for you to finish a line, usually a missing closing bracket or quotation mark. Press **Esc** to get the `>` back, then retype the line.
- **The panel's line starts with `PS` or ends in `$` instead of `>`.** That is the computer's own terminal, not R. Create an R terminal as above.

---

## C2. Installing the course packages (week 1)

**When you need it:** once, in setup. A package is a free add-on to R. This course uses two: `tidyverse`, the set of packages every script in this course starts with, and `effectsize`, for the effect sizes in Module 5.

**How:** run **AURA: Check my setup** from the Command Palette (**Ctrl+Shift+P**, or **Command+Shift+P** on a Mac). It checks both course packages; choose **Install what is missing** in its report to install any it flags, and it then confirms each one loads from your library.

The same install in R: in the R terminal, type

```
install.packages(c("tidyverse", "effectsize"), repos = "https://cloud.r-project.org")
```

If R asks to use or create a personal library, type `yes` each time. The tidyverse is a set of packages, so this takes a few minutes; you are done when the `>` comes back.

**Messages you will meet:**

- **A long numbered list of countries and cities.** R is asking which download site to use. Type the number next to **0-Cloud** and press **Enter**. Including `repos = ...` as above avoids the list.
- **`package 'tidyverse' is not available (for R version ...)`** or the same for `effectsize`. Your R is too old. Install the current R from your computer's setup guide.
- **`there is no package called 'tidyverse'`**, later, when a script runs `library(tidyverse)`. The install did not finish. Run the line above again and wait for the `>`.

You install a package once; you do not need to install it again each week.

---

## C3. The course folder (week 1)

**When you need it:** every time you use a course file. R finds a file by its name only if the file is in the folder VS Code has open.

**How:** keep one folder, `MC427` (in **Documents** on Windows or Mac). Put every course file in it. Open it in VS Code with **File**, then **Open Folder**. In a codespace, your course folder is the same `MC427`, already open, and you bring a file in by right-clicking the file list and selecting **Upload...**.

**Messages you will meet:** `cannot open file '...': No such file or directory` (from `source()`) or `'...' does not exist in current working directory` (from `read_csv()`) means the file is not in the open folder. See C14 to find out where R is looking.

---

## C4. Running a file by its name (week 1)

**When you need it:** the setup check in week 1, and any time you want to run a whole file of R lines.

**Example:** with `mc427-setup-check.R` in your course folder (a codespace has it already; on your own computer, Check Your Setup says where to get it),

```
> source("mc427-setup-check.R")
R version: 4.6.1
t-test p-value: 0.00137 
Cohen's d: -1.48 
Chi-square df: 2 
Regression R-squared: 0.75 
SETUP OK: R and the course packages are working.
```

Your R version may be newer; the four numbers are the same on every computer.

The AURA Lab R Companion's **Check my setup** runs the same kind of check from a menu and ends with the same `SETUP OK` line. Tools Stack Setup accepts a screenshot of that line from either route.

The script itself is on the course's GitHub page at <https://github.com/AURA-Lab-SIUE/mc427-codespace/blob/main/mc427-setup-check.R>; a codespace has it already, and Check Your Setup says how to save it into your folder on your own computer. You run it; you do not need to read it.

---

## C5. Reading an R message (week 1)

**When you need it:** every week. Reading the message is most of fixing the problem.

**Example:** a misspelled file name.

```
> source("mc427-setup-chek.R")
Error in file(filename, "r", encoding = encoding) : 
  cannot open the connection
In addition: Warning message:
In file(filename, "r", encoding = encoding) :
  cannot open file 'mc427-setup-chek.R': No such file or directory
```

**How to read it:** an **error** stops the work and says what failed (R could not open the file). A **warning** is a caution, and it often names the cause (there is no file by that name). Read both before you change anything.

**First, ask the companion.** Copy the message from the R terminal (drag across it to highlight it, then press **Ctrl+C**, or **Command+C** on a Mac) and run **Explain an R error** (AURA Lab R Companion) from the Command Palette; it shows the message you copied in a box at the top of the window, and you press **Enter**. It says in plain English what failed and what to check. The companion is not an AI tool, so this step needs no AI Use Log entry.

**What to do with it:** if the companion does not explain it, copy the whole message, paste it into your AI tool, and ask what it means. Then write one AI Use Log entry: what you pasted, what the tool said, and whether it was right.

**A question that works:** "I am new to R. I ran this line: [your line]. R printed this: [the message]. What does it mean, and what should I check first?"

---

## C6. Scripts, and running one line (week 2)

**When you need it:** from week 2 on, you keep your lines in a script so you can run them again.

**How:** every Data Task from Module 2 on hands you a **starter script**, a `.R` file with its lines already written and a comment above each one saying what the line does and what to expect. The starters are already in the `starters` folder of your `MC427` copy, on your own computer and in a codespace alike; select one in the file list to open it. If one is ever missing, each Data Task links the starter's page in the course's GitHub repository: open the page and select the download icon (**Download raw file**) at the top right of the file's contents. Your browser saves it in your **Downloads** folder without asking where; open File Explorer (Finder on a Mac), go to **Downloads**, and drag the file into that `starters` folder. Put your cursor on a line and press **Ctrl+Enter** (**Command+Return** on a Mac); R runs that line in the terminal. If no R terminal was open yet, the first **Ctrl+Enter** only opens one and moves your cursor down a line without running anything; put your cursor back on the line you meant and press **Ctrl+Enter** again. Lines that start with `#` are comments, which R skips.

The AURA Lab R Companion's **Write R code** command (Command Palette: Ctrl+Shift+P, or Command+Shift+P on a Mac) can also write lines for you: it adds a block to the script you have open, at your cursor, with a comment above each line saying what it does, then offers to run it in the R terminal. Read each line it adds the way you read a starter's. Open your own script (for example `week2.R`) before you use it, so the lines do not land inside a starter.

Select **Run it** first. After that, **Ctrl+Enter** (**Command+Return** on a Mac) runs the line your cursor is on in the same R terminal, **R (AURA)**, where your tables are loaded. If VS Code asks **Choose where to run the selected code**, press **Esc**: your R Companion is older than 0.6.0. Update it in the Extensions view (**Ctrl+Shift+X**, or **Command+Shift+X** on a Mac), and until then select **Run my steps from the top** in the AURA Lab R Companion panel.

Watch it step by step: [R Companion: set up for your course (video)](https://siue.yuja.com/V/Video?v=17489654&a=114591092); from Module 5, [R Companion: describe (video)](https://siue.yuja.com/V/Video?v=17490672&a=193714265) and [R Companion: tests (video)](https://siue.yuja.com/V/Video?v=17490908&a=168993969).

To start a script of your own: **File**, then **New File...**, named for example `week2.R`, saved in your course folder.

**Messages you will meet:** if **Ctrl+Enter** does nothing, the file is not saved as `.R`. Check the name, and check that the bottom-right corner of VS Code says **R**, not **Plain Text**.

---

## C7. Naming results with `<-` (week 2)

**When you need it:** whenever you want to use a result again.

**Example:** `players <- read_csv("nms-steam-monthly-players-2016-2026.csv")` stores the loaded file under the name `players`. A line that stores something prints no result; `read_csv()` prints only its short report on the file.

**Messages you will meet:**

```
> nrow(player)
Error: object 'player' not found
```

R knows only the names you have stored. Check the spelling against the line where you stored it, and check that you ran that line.

---

## C8. Loading the tidyverse, then a CSV by its name (week 2)

**When you need it:** every Data Task, and the graded work in Module 5.

**Example:** the first line of every script loads the tidyverse; the second loads the file.

```
> library(tidyverse)
── Attaching core tidyverse packages ──────────────────────── tidyverse 2.0.0 ──
✔ dplyr     1.2.1     ✔ readr     2.2.0
✔ forcats   1.0.1     ✔ stringr   1.6.0
✔ ggplot2   4.0.3     ✔ tibble    3.3.1
✔ lubridate 1.9.5     ✔ tidyr     1.3.2
✔ purrr     1.2.2     
── Conflicts ────────────────────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()
ℹ Use the conflicted package (<http://conflicted.r-lib.org/>) to force all conflicts to become errors
> players <- read_csv("nms-steam-monthly-players-2016-2026.csv")
Rows: 122 Columns: 5
── Column specification ────────────────────────────────────────────────────────
Delimiter: ","
chr (3): month, gain, pct_gain
dbl (2): avg_players, peak_players

ℹ Use `spec()` to retrieve the full column specification for this data.
ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.
```

The list with check marks is the tidyverse loading, and the two lines marked with a red symbol say that two of its functions replace older ones with the same name; all of that is normal. Your version numbers can be newer. The report after `read_csv()` says how many rows and columns the file has and the type of each column: `chr` is text, `dbl` is a number. Run `library(tidyverse)` once per R terminal, at the top of the script.

The Companion writes these same lines for you: run **AURA: Import a data file (CSV or Excel)** from the Command Palette, pick the file, and type the name you want for the table. It writes `library(tidyverse)` and a `read_csv()` line with your file's name, each with a comment above it, an `options(scipen = 10)` line so big numbers print in full, and a `glimpse()` line after them.

**Messages you will meet:**

- `there is no package called 'tidyverse'`: the tidyverse is not installed. See C2.
- `could not find function "read_csv"`: the `library(tidyverse)` line has not been run in this R terminal. Run it, then the line that failed.
- `'...' does not exist in current working directory: '...'`: the name is misspelled, or the file is not in your course folder (C3, C14). The message names the folder R looked in. Copy the file name from the file list rather than typing it.
- A `+` prompt after the line: a bracket or quotation mark is missing (C1).

---

## C9. Looking at a data file (week 2)

**When you need it:** right after loading any file, before you analyze it.

**Example:**

```
> nrow(players)
[1] 122
> glimpse(players)
Rows: 122
Columns: 5
$ month        <chr> "September 2026", "August 2026", "July 2026", "June 2026"…
$ avg_players  <dbl> 23597.63, 8244.41, 9225.14, 12899.04, 9621.67, 12320.58, …
$ gain         <chr> "15353.22", "-980.73", "-3673.90", "3277.38", "-2698.92",…
$ pct_gain     <chr> "+186.23%", "-10.63%", "-28.48%", "+34.06%", "-21.91%", "…
$ peak_players <dbl> 55623, 14011, 16244, 26344, 28162, 25650, 21398, 32169, 2…
> players %>% slice_head(n = 6)
# A tibble: 6 × 5
  month          avg_players gain     pct_gain peak_players
  <chr>                <dbl> <chr>    <chr>           <dbl>
1 September 2026      23598. 15353.22 +186.23%        55623
2 August 2026          8244. -980.73  -10.63%         14011
3 July 2026            9225. -3673.90 -28.48%         16244
4 June 2026           12899. 3277.38  +34.06%         26344
5 May 2026             9622. -2698.92 -21.91%         28162
6 April 2026          12321. 1969.20  +19.02%         25650
```

`nrow()` counts rows, `glimpse()` lists every column with its type and first values, and `slice_head(n = 6)` shows the first six rows as a **tibble**, the tidyverse's table of data. The `[1]` is R numbering its output, not part of the answer. A number ending in a dot, such as `23598.`, has been rounded to fit the table; the stored value is the full one `glimpse()` shows. Always report how many rows your analysis used: that number comes from `nrow()`.

The Companion's **AURA: Import a data file (CSV or Excel)** ends with this `glimpse()` line, and **Keep some columns (select)** writes a `select()` followed by `glimpse()`, so you see the columns you kept.

---

## C10. One column, and the pipe `%>%` (week 2)

**When you need it:** whenever you work with a single measure, and whenever you chain steps.

**Example:**

```
> players %>% slice_head(n = 3) %>% pull(peak_players)
[1] 55623 14011 16244
```

The `%>%` is the **pipe**. Read it as "then": take `players`, then keep the first three rows, then pull out the `peak_players` column as plain values. Every tidyverse line in this course is a chain like this, left to right. `pull()` gives you the values on their own, which is what you want for arithmetic (C13); `select()` in its place keeps them as a one-column table.

**Messages you will meet:**

```
> players %>% select(avg_player)
Error in `select()`:
! Can't select columns that don't exist.
✖ Column `avg_player` doesn't exist.
Run `rlang::last_trace()` to see where the error occurred.
```

A column name you only partly typed (`avg_player`, missing the final `s`) stops with an error that names it. Type the full name exactly as `glimpse()` prints it.

Every line the Companion's **Write R code** command writes has this shape: a table, then `%>%`, then one verb per line, so you can read it the same way.

---

## C11. Summaries: `summarize()` (week 3)

**When you need it:** to check a number before you rely on it.

**Example,** on the course's archived X data, loaded as `posts` with `read_csv("nms-x-monthly-2016-2021.csv")` (C8):

```
> posts %>% summarize(smallest = min(unique_authors), middle = median(unique_authors), average = mean(unique_authors), biggest = max(unique_authors))
# A tibble: 1 × 4
  smallest middle average biggest
     <dbl>  <dbl>   <dbl>   <dbl>
1      288    880   1723.   33404
> posts %>% summarize(refunds = sum(posts_mentioning_refund))
# A tibble: 1 × 1
  refunds
    <dbl>
1    1359
```

`summarize()` makes a new one-row table. Each summary is a name you choose, an equals sign, and what to compute from a column: `sum()`, `max()`, `min()`, `median()`, `mean()`. Inside `summarize()`, a column is written by its name alone.

A missing value, `NA`, makes `mean()` and `sum()` return `NA`. Count the missing values, and leave them out on purpose with `na.rm = TRUE`:

```
> tibble(x = c(3, 5, NA)) %>% summarize(average = mean(x))
# A tibble: 1 × 1
  average
    <dbl>
1      NA
> tibble(x = c(3, 5, NA)) %>% summarize(average = mean(x, na.rm = TRUE), missing = sum(is.na(x)))
# A tibble: 1 × 2
  average missing
    <dbl>   <int>
1       4       1
```

The Describe group of the AURA Lab R Companion's **Write R code** (**Summary by group**) writes a grouped `summarize()` like these for you, with n, mean, median, and sd for each group. It does not add `na.rm = TRUE`, so a missing value prints `NA`: count the missing values, add `na.rm = TRUE` yourself, and say so when you report the number.

**Messages you will meet:**

```
> players %>% summarize(average = mean(pct_gain))
# A tibble: 1 × 1
  average
    <dbl>
1      NA
Warning message:
There was 1 warning in `summarize()`.
ℹ In argument: `average = mean(pct_gain)`.
Caused by warning in `mean.default()`:
! argument is not numeric or logical: returning NA 
```

The column holds text (`+186.23%`), not numbers. Work from a number column instead, such as `avg_players`.

---

## C12. Picking rows: `filter()` (week 3)

**When you need it:** to pull one month, or one group, out of a file.

**Example:**

```
> players %>% filter(month == "July 2018")
# A tibble: 1 × 5
  month     avg_players gain     pct_gain  peak_players
  <chr>           <dbl> <chr>    <chr>            <dbl>
1 July 2018      14554. 13518.78 +1305.65%        96954
```

`filter()` keeps the rows where the test is true. The two equals signs ask "is this equal to?" The month is in quotation marks and spelled exactly as the file spells it.

**Messages you will meet:**

```
> players %>% filter(month = "July 2018")
Error in `filter()`:
! We detected a named input.
ℹ This usually means that you've used `=` instead of `==`.
ℹ Did you mean `month == "July 2018"`?
Run `rlang::last_trace()` to see where the error occurred.
```

One `=` sets a value; two `==` asks whether two things are equal. The message spells out the fix. A month spelled differently from the file (`"july 2018"`) stops nothing and matches no row: the result is a tibble with 0 rows, and anything you `pull()` from it is `numeric(0)`.

The Companion's **Keep some rows (filter)** writes a `filter()` line in this shape, with the text value in quotation marks, names the result, and counts the rows that are left with `nrow()`.

---

## C13. Arithmetic on results, and `round()` (week 3)

**When you need it:** to turn two numbers into a change or a rate.

**Example:** how July 2018 compared with June 2018, the month the NEXT update came out.

```
> jul <- players %>% filter(month == "July 2018") %>% pull(avg_players)
> jun <- players %>% filter(month == "June 2018") %>% pull(avg_players)
> round(jul / jun, 2)
[1] 14.06
> round(100 * (jul / jun - 1))
[1] 1306
```

Each `filter()` keeps one row, and `pull()` takes the one number out of it, so `jul` and `jun` are plain numbers you can divide. July averaged 14.06 times June's players, a rise of 1306%. The file's own `pct_gain` for July 2018 says `+1305.65%`, so the arithmetic checks out. Checking your result against a number you already have is the habit this course grades in Module 5.

---

## C14. Where R is looking: `getwd()`, `list.files()` (week 3)

**When you need it:** whenever R says it cannot find a file.

**Example:**

```
> getwd()
[1] "C:/Users/yourname/Documents/MC427"
> list.files()
[1] "mc427-setup-check.R"
[2] "nms-steam-monthly-players-2016-2026.csv"
[3] "nms-x-monthly-2016-2021.csv"
```

Your folder path will differ; it should end in `MC427`, on your own computer and in a codespace alike. If the file you want is not in the `list.files()` list, R cannot load it by name: move it into the folder, or open the right folder with **File**, then **Open Folder**, and start a new R terminal.

---

## C15. Copilot Chat (week 3)

**When you need it:** from week 3 on, to explain a line you do not understand and to write lines you then check.

**How:** press **Ctrl+Shift+P** (**Command+Shift+P** on a Mac), type `Chat: Open Chat`, and press **Enter**; the Copilot Chat panel opens beside your script. To ask about a line, select it in your script first, then type your question. When Copilot writes code, select the copy icon at the top of its code block (the block is often clipped in the narrow Chat pane, so the icon is the reliable way to get all of it), paste it into your script, and run it yourself.

Your `MC427` folder holds a file, `.github/copilot-instructions.md`, that Copilot reads on its own. It asks Copilot for tidyverse code with `%>%` and reminds you to log the exchange in your AI Use Log. Leave it in place. If your folder does not have it, open the Command Palette (Ctrl+Shift+P, or Command+Shift+P on a Mac) and run **AURA: Add the course's Copilot instructions to this folder**; or download the file from <https://github.com/AURA-Lab-SIUE/mc427-codespace/blob/main/.github/copilot-instructions.md> and save it as `.github/copilot-instructions.md` inside your `MC427` folder.

Copilot Chat may open in Agent mode, which can run code and change your files by itself. In this course, do not let it. Ask for code only, end your request with "do not run anything; reply with only the code block," and then paste the code into your script and run it yourself. Your Verification Log and your AI Use Log record what you ran and what you checked, and that record only means something if you were the one running the code. A line the AURA Lab R Companion writes and runs counts as a line you ran: you chose the menu, so record it in your Verification Log as yours and check its result the same way (C20). The Companion's Copilot Chat tools are switched off in MC 427.

**Two rules that keep it honest:**

1. Never paste a result into your work that you did not run.
2. When Copilot's line answers something you already know (a row count, a figure in the Client Scenario), run it and compare. If it does not match, the line is wrong, however confident Copilot sounds.

**A question that works:** "Explain this R line one piece at a time for a beginner: `players %>% filter(month == "July 2018")`." Asking for tidyverse code by name helps too: "Write it with the tidyverse."

---

## C16. Counting pairs: `count()` (week 4)

**When you need it:** to see how often two codes, or two categories, go together.

**Example,** on the Module 4 coding sheet loaded as `codes` (the codes here were drawn at random for the example):

```
> codes %>% count(sentiment, ai_sentiment)
# A tibble: 7 × 3
  sentiment ai_sentiment     n
  <chr>     <chr>        <int>
1 S-1       S-1             14
2 S-1       S-3              1
3 S-2       S-2              7
4 S-3       S-1              1
5 S-3       S-3             18
6 S-4       S-3              1
7 S-4       S-4              8
```

One row per combination that occurs, and `n` is how many rows had it. The `n` column always adds up to the number of rows in the file, which is your check. `count()` with one column name counts each value of that column.

**Messages you will meet:**

```
> codes %>% count(sentiment, ai_sentment)
Error in `count()`:
! Must group by variables found in `.data`.
✖ Column `ai_sentment` is not found.
Run `rlang::last_trace()` to see where the error occurred.
```

The line marked with the red symbol names the column R could not find. Check it against `glimpse()`.

The Companion's **Count rows per group (count)** writes a `count()` line in this shape, with `sort = TRUE` so the largest group comes first.

---

## C17. Comparing two columns: `==` and the share that match (week 4)

**When you need it:** to turn "did these two agree?" into one number.

**Example:**

```
> codes %>% summarize(share_agree = mean(sentiment == ai_sentiment))
# A tibble: 1 × 1
  share_agree
        <dbl>
1        0.94
```

`sentiment == ai_sentiment` is TRUE or FALSE for every row. R counts TRUE as 1 and FALSE as 0, so the mean of those answers is the share of rows where the two columns match. `!=` means "is not equal to", so `filter(sentiment != ai_sentiment)` keeps only the rows that disagree.

**A trap that prints no error:** a blank cell is a missing value, and one missing value makes the share `NA`. Run `count()` (C16) and look for a row with `NA`.

---

## C18. Column types: `glimpse()` (week 4)

**When you need it:** before you compare or count, to know whether a column is text or a number.

**Example:**

```
> glimpse(codes)
Rows: 50
Columns: 8
$ review_id    <chr> "R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "…
$ phase        <chr> "before", "before", "before", "before", "before", "before…
$ review       <chr> "Boring and too much grinding and repetition, tired alrea…
$ focus        <chr> "F-2", "F-5", "F-3", "F-5", "F-1", "F-3", "F-1", "F-4", "…
$ sentiment    <chr> "S-4", "S-2", "S-3", "S-1", "S-3", "S-1", "S-1", "S-3", "…
$ ai_focus     <chr> "F-3", "F-5", "F-4", "F-5", "F-3", "F-3", "F-1", "F-4", "…
$ ai_sentiment <chr> "S-4", "S-2", "S-3", "S-1", "S-3", "S-1", "S-1", "S-3", "…
$ notes        <lgl> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, N…
```

`chr` is text, `dbl` is a number, `lgl` is TRUE or FALSE, `dttm` is a date and time. A code column should say `chr`. A column that says `lgl` with every value `NA` is empty: R read a column with nothing in it as missing values.

---

## C19. Text flags take quotation marks (week 4)

**When you need it:** whenever a column holds a yes or no answer as text.

**Example,** on the Module 4 review file loaded as `reviews`:

```
> reviews %>% summarize(share_edited = mean(edited == "yes"))
# A tibble: 1 × 1
  share_edited
         <dbl>
1         0.22
```

`edited` holds the text `yes` or `no`, so you compare it with `"yes"` in quotation marks.

**Messages you will meet:**

```
> reviews %>% summarize(share_edited = mean(edited == yes))
Error in `summarize()`:
ℹ In argument: `share_edited = mean(edited == yes)`.
Caused by error:
! object 'yes' not found
Run `rlang::last_trace()` to see where the error occurred.
```

Without quotation marks, R looks for something named `yes`. And `edited == TRUE` prints 0 with no error at all, because the text `yes` is never equal to TRUE.

---

## C20. Checking Copilot's code, or the Companion's, against a result you already know (week 4)

**When you need it:** every time Copilot writes a line for you. The same check applies to every line the AURA Lab R Companion writes: run it on something whose answer you already have before you trust it.

**How:** before you trust a line, run it on something whose answer you already have: a row count, a figure in the Client Scenario, the sentiment version of a check you have already run. If the number matches, the line is right. If it does not, the line is wrong, however confident Copilot sounds; tell Copilot what you expected and ask it to fix the line. A line that runs without an error is not a line that is right.

**A question that works:** "This line printed 0.76, but I expected the `n` column to add up to 50. What is wrong with it?"

---

## C21. The t-test, tidied: `t.test() %>% broom::tidy()` (week 5)

**When you need it:** to compare the average of one measure between two groups.

**Example,** on the Module 5 practice tweets loaded as `df`: do posts shared from a console's share button get more likes than the others?

```
> df %>% count(share_button)
# A tibble: 2 × 2
  share_button     n
  <chr>        <int>
1 no             577
2 yes            173
> t.test(like_count ~ share_button, data = df) %>% broom::tidy()
# A tibble: 1 × 10
  estimate estimate1 estimate2 statistic p.value parameter conf.low conf.high
     <dbl>     <dbl>     <dbl>     <dbl>   <dbl>     <dbl>    <dbl>     <dbl>
1     2.26      7.81      5.55      1.56   0.118      530.   -0.578      5.09
# ℹ 2 more variables: method <chr>, alternative <chr>
```

`like_count ~ share_button` reads "likes, split by share button". `broom::tidy()` turns the test's result into a one-row table: `estimate1` and `estimate2` are the two group means (`no`, then `yes`), `estimate` is their difference, `statistic` is the t value, `p.value` is the p value, and `parameter` is the degrees of freedom. The df has decimals because R runs Welch's version of the test, which does not assume the two groups spread out equally. The sign of `estimate` shows the direction. R does not print the group sizes: `count()` gives them, as in the first line.

**Messages you will meet:** `could not find function "tidy"` means you wrote `tidy()` without `broom::` in front and did not load broom. `broom::tidy()` works without any `library()` line, because broom comes with the tidyverse.

The Test group of the AURA Lab R Companion's **Write R code** writes this test and its effect size with the same functions as this section. In Module 5, Copilot writes your analysis code and the Test group is a check on it: run both and compare (C20).

---

## C22. Chi-square and its expected counts (week 5)

**When you need it:** to ask whether two categories are related, such as which update a post was about and where it was posted from.

**Example:**

```
> xtabs(~ update + posted_from, data = df)
           posted_from
update      other apps PlayStation share button Xbox share button
  Beyond           187                       53                10
  Frontiers        209                       36                 5
  NEXT             181                       59                10
> xtabs(~ update + posted_from, data = df) %>% chisq.test()

	Pearson's Chi-squared test

data:  .
X-squared = 10.03, df = 4, p-value = 0.03992

> xtabs(~ update + posted_from, data = df) %>% chisq.test() %>% pluck("expected") %>% round(2)
           posted_from
update      other apps PlayStation share button Xbox share button
  Beyond        192.33                    49.33              8.33
  Frontiers     192.33                    49.33              8.33
  NEXT          192.33                    49.33              8.33
```

`xtabs(~ a + b, data = df)` builds the grid of counts the test needs; `chisq.test()` runs the test on it; `pluck("expected")` takes out the counts the test expected if the two categories were unrelated. Compare the expected grid with the real one: the cells that differ most are where the relationship is. An expected count below 5 (the Xbox column here has none, but check every time) makes the test unreliable, and R then adds a warning that the approximation may be incorrect.

The Describe group of **Write R code** (**Crosstab with proportions**) writes this count for any two columns you pick, adds `prop`, the share of each pair within its row, and then spreads the counts into the same grid with `pivot_wider()`.

The Test group of the AURA Lab R Companion's **Write R code** writes this test and its effect size with the same functions as this section. In Module 5, Copilot writes your analysis code and the Test group is a check on it: run both and compare (C20).

---

## C23. Regression, tidied: `lm() %>% broom::tidy()` and `broom::glance()` (week 5)

**When you need it:** to ask whether one number predicts another.

**Example:** do likes fall off as the days since the update pass?

```
> lm(log1p(like_count) ~ day_offset, data = df) %>% broom::tidy(conf.int = TRUE)
# A tibble: 2 × 7
  term        estimate std.error statistic   p.value conf.low conf.high
  <chr>          <dbl>     <dbl>     <dbl>     <dbl>    <dbl>     <dbl>
1 (Intercept)   1.19      0.0452     26.4  2.84e-109   1.11      1.28  
2 day_offset   -0.0528    0.0112     -4.74 2.61e-  6  -0.0747   -0.0309
> lm(log1p(like_count) ~ day_offset, data = df) %>% broom::glance()
# A tibble: 1 × 12
  r.squared adj.r.squared sigma statistic    p.value    df logLik   AIC   BIC
      <dbl>         <dbl> <dbl>     <dbl>      <dbl> <dbl>  <dbl> <dbl> <dbl>
1    0.0291        0.0278  1.16      22.4 0.00000261     1 -1178. 2361. 2375.
# ℹ 3 more variables: deviance <dbl>, df.residual <int>, nobs <int>
```

`lm(y ~ x, data = df)` fits the line. `broom::tidy(conf.int = TRUE)` gives one row per term: the row for your predictor carries the slope (`estimate`), its p value and its interval. `broom::glance()` gives the whole model's numbers in one row, including `r.squared`, the share of the variation the line explains, and `nobs`, the number of rows used, which you report. `2.61e-  6` is R's way of writing 0.00000261.

The Test group of the AURA Lab R Companion's **Write R code** writes this test and its effect size with the same functions as this section. In Module 5, Copilot writes your analysis code and the Test group is a check on it: run both and compare (C20).

---

## C24. Effect sizes from the effectsize package (week 5)

**When you need it:** a p value says whether a difference is likely real; an effect size says how big it is. Every Module 5 test reports both.

**Example:**

```
> effectsize::cohens_d(like_count ~ share_button, data = df)
Cohen's d |        95% CI
-------------------------
0.10      | [-0.07, 0.27]

- Estimated using pooled SD.
```

```
> effectsize::cramers_v(xtabs(~ update + posted_from, data = df))
Cramer's V (adj.) |       95% CI
--------------------------------
0.06              | [0.00, 1.00]

- One-sided CIs: upper bound fixed at [1.00].
```

`effectsize::cohens_d()` takes the same `y ~ group, data = df` as the t-test; `effectsize::cramers_v()` takes the same `xtabs()` grid as the chi-square. The `::` means "the function from this package", so no `library()` line is needed. Both printouts here are small effects.

**Messages you will meet:** `could not find function "cohens_d"` means the `effectsize::` is missing from the front. `there is no package called 'effectsize'` means the package was not installed in setup (C2).

The Test group of the AURA Lab R Companion's **Write R code** writes each test's effect size with these functions, after the test. In Module 5, Copilot writes your analysis code and the Test group is a check on it: run both and compare (C20).

---

## C25. Skewed counts with zeros: `log1p()`, never `log()` (week 5)

**When you need it:** likes, shares and votes pile up near zero with a few huge values. A log scale tames that, but the log of zero is minus infinity.

**Example:**

```
> df %>% summarize(smallest = min(like_count), middle = median(like_count), average = mean(like_count), biggest = max(like_count), zeros = sum(like_count == 0))
# A tibble: 1 × 5
  smallest middle average biggest zeros
     <dbl>  <dbl>   <dbl>   <dbl> <int>
1        0      1    7.29     330   258
> df %>% summarize(mean_log = mean(log(like_count)), mean_log1p = mean(log1p(like_count)))
# A tibble: 1 × 2
  mean_log mean_log1p
     <dbl>      <dbl>
1     -Inf       1.12
> df %>% mutate(log_likes = log1p(like_count)) %>% select(like_count, log_likes) %>% slice_head(n = 3)
# A tibble: 3 × 2
  like_count log_likes
       <dbl>     <dbl>
1         13      2.64
2          0      0   
3          0      0   
```

The middle post has 1 like and 258 of 750 have none, so the average of 7.29 is pulled up by a few viral posts. `log()` of a zero is `-Inf`, and one `-Inf` ruins every mean and test that touches it. `log1p()` adds 1 before taking the log, so a zero stays a zero. `mutate()` adds the transformed column to the data, and you test on that column. Report which scale you tested on.

**Messages you will meet:** a result of `NaN` or `-Inf`, or `NA/NaN/Inf in 'y'`, means a log hit zero. Replace `log()` with `log1p()`.

---

## C26. Drawing a chart and saving it: `ggplot()` and `ggsave()` (week 6)

**When you need it:** to put a result in front of the client as a picture.

**Example,** on the Steam player counts loaded as `players`: the three months around the Frontiers update.

```
players %>% filter(month %in% c("August 2021", "September 2021", "October 2021")) %>% mutate(month = factor(month, levels = c("August 2021", "September 2021", "October 2021"))) %>% ggplot(aes(x = month, y = avg_players)) + geom_col()
ggsave("chart.png")
```

The first line keeps three rows, puts them in time order, and draws them. Without the `mutate(month = factor(...))` step, R sorts month names alphabetically, so October would come before September. `aes()` says which column goes on each axis, and `geom_col()` draws one bar per row. The chart opens in a panel of VS Code. Inside `ggplot()` the pieces are joined with `+`, not the pipe. `ggsave()` saves the most recent chart to a picture file with that name in your course folder, and prints:

```
Saving 7 x 7 in image
```

That line is not an error. Look in your `MC427` folder (or the codespace file list) for `chart.png`.

**Messages you will meet:** no picture file appears means `ggsave()` ran before any chart was drawn in this R session. Run the `ggplot(...)` line first, then `ggsave(...)`, then `list.files()`.

The Describe group of **Write R code** writes bar, histogram, and boxplot code for you, with `labs()` for the title and the axes and an `alt =` line marked YOUR TURN: one sentence saying what the chart shows, for a reader who cannot see it. Keep that sentence with the chart when it goes in your deck. `ggsave()` still saves it, and after **Run it** the saved picture opens in an editor tab.
