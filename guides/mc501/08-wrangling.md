# Wrangle Your Own Data: From Your Coding Sheet to Your Analysis File

Take the coding sheet you filled in by hand, load it under a name you choose, join it to a second table about your sources, fix what is wrong with it, and save the one file every later step reads. You type every line of R yourself and see what each one prints.

Prefer to watch first? The walkthrough video [Wrangle Your Own Data](https://siue.yuja.com/V/Video?v=17679761&a=78020491) shows these steps.

**How this guide and the Data Wrangling worksheet fit together.** The graded worksheet (`11-wrangling-data.qmd`) does this job on the course's Twitch data. Your White Paper does it again on your own data. This guide walks your own-data version, one step at a time, and after each step a box names the worksheet task that does the same thing on Twitch, the R Companion menu for it, and what the worksheet says you should see. Use the guide beside the worksheet, or come back to it when you start on your own study.

## The example data, and why it looks like yours

The example is a study like the one you set up in the [Sampling Plan and Pilot](../../mc501-assignments.html#sampling-plan-and-pilot-20-to-30-items): two real tables about a television show, from the R community's weekly public-data project TidyTuesday (2024-08-27, Power Rangers).

- [episode-codes.csv](../../resources/examples/own-study-walkthrough/episode-codes.csv): the **coding sheet**. 120 episodes drawn at random from the 921, one row each, with two columns coded by hand from each episode's synopsis: `threat` (`monster`, `villain`, or `none`) and `focus` (`team`, `one_ranger`, or `other`), plus a `coder_notes` column. Your coding sheet is the same shape: one row per item you coded, one column per variable in your codebook.
- [power_rangers_seasons.csv](../../resources/examples/own-study-walkthrough/power_rangers_seasons.csv): the **table about the sources**. 28 seasons, one row each, with the season number and the producer. Yours describes your accounts, outlets, or channels.

The coding sheet was drawn from the episodes table alone, so the coder never saw which company produced each episode while coding it. That is a good habit: keep anything that could sway your codes out of the coding sheet, and join it on afterward. That join is Step 6.

**Which of your files is which.** Your coding sheet is the file with the columns you coded by hand, one row for each item you coded. Steps 2 to 5 use your coding sheet. Every other table in your study is a second table, even one you typed yourself, and even one about something other than your sources, such as the songs, products, or hashtags that appear in your items. Step 6 loads a second table and joins it to your coding sheet. For the join, your coding sheet needs one column that names the matching row of the second table, such as a song title, typed exactly as it appears in the second table. Each item gets one match in that column, its main match. Write the rule for picking the main match in your codebook, such as "the song that plays longest in the video", and fill in the column while you code. A video that uses three songs gets one song title: the one your rule picks. Then each item stays one row, and Step 6's row check works as shown. A study with more than one second table does Step 6 once for each one.

Two things in the example sheet are wrong on purpose, because real coding sheets have them: one code was typed with a capital letter, and one cell was left blank. Steps 4, 5, and 9 find and handle both.

The finished script is here, so you can compare yours with it at any step: [wrangle.R](../../resources/examples/own-study-walkthrough/wrangle.R).

## Words used here

- **Coding sheet:** the table of your hand-coded items, saved as a CSV. Each row is one item; each code column is one variable from your codebook.
- **Key:** the one column two tables share, used to match their rows.
- **Join:** adding the columns of one table onto another by matching the key.
- **Factor:** R's way of storing a category (`monster`, `villain`, `none`) with its values in an order you choose. Every table, chart, and test uses that order.
- **Missing value (`NA`):** a cell with nothing in it. R prints `NA`, short for "not available."
- **RDS file:** R's own file format. It saves a table exactly as you built it, factors included. A CSV does not.

## Before you start: put both files in your data folder

The steps below use two example files, so that what you see on your screen matches what the guide shows. Your own coding sheet and your own table about your sources go in the folder these steps make, the same way, when you are ready to use them.

Get the two example files now. Click each of these links once: [episode-codes.csv](../../resources/examples/own-study-walkthrough/episode-codes.csv) and [power_rangers_seasons.csv](../../resources/examples/own-study-walkthrough/power_rangers_seasons.csv). Your browser saves each file in your Downloads folder, and most browsers show the file's name for a moment near the top right corner of the browser window. You will see both names again at step 7 below.

Both files go in a folder named `data` in your course workspace, the folder you have open in VS Code. These steps make the folder and put the files in it.

1. Look at the Explorer, the list of files and folders on the left side of VS Code. (If you do not see the word **EXPLORER** at the top of it, select **View** in the menu bar, then **Explorer**. The menu bar is at the top of the VS Code window on Windows, and at the top of the screen on a Mac.) Under the word **EXPLORER** at the top of this list, a line in capital letters shows the name of your course workspace. Do not click that line. Below it, each folder has a small arrow in front of its name. The arrow points right, like `>`, when the folder is closed, and points down, like `v`, when it is open. Click the name of every folder whose arrow points down, so that every arrow points right. Every folder is now closed, and the list is short.
2. Read down the short list. If one line reads `data`, you have the folder: skip to step 5 below.
3. Right-click the empty space below the last line of the list. (On a Mac, hold the **Control** key and click. On a Windows laptop touchpad, tap with two fingers.) A small menu opens. Select **New Folder...**. An empty box opens in the list. (The bars named **OUTLINE** and **TIMELINE** at the bottom of the left side are not part of the list. The empty space is above them.)
4. Type `data` and press **Enter** (**Return** on a Mac). You should see a new line reading `data` in the list, with a small arrow in front of it.
5. Open your Downloads folder. On Windows, click the yellow folder icon on the taskbar, the row of icons along the bottom of the screen, then select **Downloads** on the left of the window that opens. On a Mac, click the smiling-face icon in the Dock, the row of icons along the bottom or the side of the screen, then select **Downloads** on the left of the window that opens. You should see a window that lists the files you have downloaded.
6. Put the Downloads window on top of VS Code. First make the Downloads window small: drag one of its corners toward its middle. (On Windows, if the window fills the whole screen, double-click its top edge first. The window gets smaller.) Next click the blue VS Code icon on the taskbar or the Dock, so that VS Code shows. Then click the icon from step 5 again, the yellow folder or the smiling face. You should see the small Downloads window on top of VS Code. Drag the Downloads window by its top edge until the word `data` in VS Code shows beside it.
7. In the Downloads window, find `episode-codes.csv`. (The name may show as `episode-codes`, without `.csv` on the end. That is the same file. If you see a second one with a number, such as `episode-codes (1)`, use the one without the number.) Drag it onto the word `data` in VS Code and let go. Do the same with `power_rangers_seasons.csv`. Nothing may seem to change yet: step 8 shows you both files. If you do not see the two names in the Downloads window, click the two links at the top of this section again.
8. Look at the arrow in front of `data`. If it points right, click the word `data` once, so that it points down. You should see both file names right below `data`. Click `data` again and both names disappear, which is how you can tell a file is inside `data`. Click it once more so the names show again.

**It worked if** both file names show right below `data` while its arrow points down. If they do not, email your instructor a picture of the whole VS Code window, with the list on the left showing.

**Why the folder is named `data`.** Later steps in this guide give you lines to type, and each line that opens a file names it like this: `"data/episode-codes.csv"`. R reads that as directions. R begins in your course workspace, the folder you have open in VS Code. `data/` sends R into the folder named `data`. `episode-codes.csv` is the file R opens there. R begins in your course workspace at every step of this guide.

## Step 1: Open a script and load the packages

1. In the Explorer, right-click (on a Mac, Control-click or click with two fingers) the empty space below the file list and select **New File...**. Type `wrangle.R` and press **Enter**.
2. Open an R terminal: **View**, then **Command Palette...** (or **Ctrl+Shift+P**; **Cmd+Shift+P** on a Mac), type `AURA: Open an R terminal`, and press **Enter**. Wait for the `>` prompt.
Type these three lines into `wrangle.R`, select them, then right-click them (on a Mac, Control-click or click with two fingers) and select **Run the selected lines in R** (keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac):

```r
library(tidyverse)
library(janitor)
library(v2v)
```

```
> library(tidyverse)
── Attaching core tidyverse packages ────────────────────────────────── tidyverse 2.0.0 ──
✔ dplyr     1.1.4     ✔ readr     2.1.6
✔ forcats   1.0.1     ✔ stringr   1.6.0
✔ ggplot2   4.0.1     ✔ tibble    3.3.0
✔ lubridate 1.9.4     ✔ tidyr     1.3.1
✔ purrr     1.2.0     
── Conflicts ──────────────────────────────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()
ℹ Use the conflicted package (<http://conflicted.r-lib.org/>) to force all conflicts to become errors

> library(janitor)

Attaching package: ‘janitor’

The following objects are masked from ‘package:stats’:

    chisq.test, fisher.test

> library(v2v)
v2v 0.3.9 loaded.
  setup()  checks that R, Quarto and Git are ready
  ?v2v     lists what this package gives you

Attaching package: ‘v2v’

The following object is masked from ‘package:janitor’:

    crosstab
```

**Check:** the `v2v` line says `0.3.9` or newer. The `Conflicts` and `masked` lines are normal: they say one package's function replaces another's with the same name. If you see `there is no package called 'janitor'`, run **AURA: Check my setup**, then **Install what is missing**, and run the lines again.

**In the worksheet (Twitch):** the Setup chunk loads the same three packages. **What you should see** there is the same list.

## Step 2: Load your coding sheet under a name you choose

The name on the **left** of `<-` is yours to pick: it is what you call this table in every later line. The example calls its coding sheet `coded`. The file name inside the quotes is **your** file's name, exactly as the Explorer shows it under `data`, with `data/` in front. See [read_csv() on the readr cheat sheet](../../resources/cheat-sheets/readr.html#read_csv-read-a-.csv-into-a-table).

```r
coded <- read_csv("data/episode-codes.csv")
```

```
> coded <- read_csv("data/episode-codes.csv")
Rows: 120 Columns: 10
── Column specification ──────────────────────────────────────────────────────────────────
Delimiter: ","
chr  (6): season_title, episode_title, desc, threat, focus, coder_notes
dbl  (3): episode_num, IMDB_rating, total_votes
date (1): air_date

ℹ Use `spec()` to retrieve the full column specification for this data.
ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.
```

**Check:** the row count is the number of items you coded (120 here). If it reports `Columns: 1` instead, see **Everything lands in one column** under If it does not work. The `chr`, `dbl`, and `date` lines say what kind each column is: `chr` is text, `dbl` is a number, `date` is a date. Your code columns should be `chr` if you typed words, or `dbl` if you typed numbers.

Now look at every column with its first values ([glimpse() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#glimpse-see-every-column-at-once)):

```r
glimpse(coded)
```

```
> glimpse(coded)
Rows: 120
Columns: 10
$ season_title  <chr> "Operation Overdrive", "Time Force", "Jungle Fury", "Time Force", …
$ episode_num   <dbl> 24, 38, 20, 30, 28, 7, 3, 24, 39, 40, 9, 11, 17, 15, 5, 44, 2, 30,…
$ episode_title <chr> "Ronny on Empty: Part 2", "The End of Time: Part 1", "Dash for the…
$ air_date      <date> 2007-08-27, 2001-11-03, 2008-07-14, 2001-09-08, 2002-09-14, 2008-…
$ IMDB_rating   <dbl> 7.8, 8.6, 7.2, 8.5, 6.7, 7.0, 7.8, 6.2, 8.9, 8.8, 7.1, 7.2, 8.6, 6…
$ total_votes   <dbl> 26, 55, 35, 54, 40, 34, 210, 38, 59, 64, 35, 289, 29, 282, 99, 435…
$ desc          <chr> "With Ronny's life force fading, quickly, Will gets some \"unexpec…
$ threat        <chr> "villain", "villain", "villain", "villain", "villain", "villain", …
$ focus         <chr> "team", "team", "one_ranger", "team", "one_ranger", "one_ranger", …
$ coder_notes   <chr> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA…
```

**Check:** every column you expect is there, and the values look like what you typed. `NA` in `coder_notes` is fine: most rows have no note.

**The R Companion shortcut, once you have typed it yourself:** **AURA: Import a data file (CSV or Excel)** from the Command Palette asks for the file and the name, then writes the same `read_csv()` and `glimpse()` lines into your script, with the `library()` lines and an `options()` line above them.

**In the worksheet (Twitch):** Task 1.1 loads the Twitch tables from the course package instead of a file (R Companion: **R2 Data**, then **Load the course Twitch corpus**), and Task 1.2 runs `glimpse()`: `Rows: 35,267` for `chat`. Task 5.1 reads your coding sheet with this same `read_csv()` line: `Rows: 30`.

## Step 3: Clean the column names

A spreadsheet lets you name a column `IMDB_rating` or `Reaction Only`. R would make you type those exactly, capitals and spaces included. `clean_names()` makes every name lowercase with underscores ([clean_names() on the readr cheat sheet](../../resources/cheat-sheets/readr.html#clean_names-make-column-names-safe-to-type)).

```r
coded <- coded %>%
  clean_names()
```

```r
names(coded)
```

```
> coded <- coded %>%
+   clean_names()

> names(coded)
 [1] "season_title"  "episode_num"   "episode_title" "air_date"      "imdb_rating"  
 [6] "total_votes"   "desc"          "threat"        "focus"         "coder_notes"  
```

**Check:** `IMDB_rating` is now `imdb_rating`. Every later line uses the new names.

**In the worksheet (Twitch):** Task 5.1 adds the same `clean_names()` line under its `read_csv()`.

## Step 4: Check every code column

Before you trust a code column, count its values. `count()` lists each value once with how many rows have it ([count() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#count-how-many-rows-in-each-group)). Do this for every column you coded.

```r
coded %>%
  count(threat)
```

```
> coded %>%
+   count(threat)
# A tibble: 4 × 2
  threat      n
  <chr>   <int>
1 Monster     1
2 monster    36
3 none       27
4 villain    56
```

```r
coded %>%
  count(focus)
```

```
> coded %>%
+   count(focus)
# A tibble: 4 × 2
  focus          n
  <chr>      <int>
1 one_ranger    52
2 other         13
3 team          54
4 <NA>           1
```

**Check:** each code column should list only the values your codebook allows. Here two things are wrong:

- `threat` has `Monster` (1 row) and `monster` (36 rows). To R those are different values, because R treats capital and lowercase letters as different. It is one typing slip.
- `focus` has an `NA` row: one cell was left blank. The `coder_notes` column says why ("synopsis says nothing about the story"). Step 9 decides what to do with it.

**The R Companion shortcut, once you have typed it yourself:** **AURA: Write R code**, then under **R2 Data**, **Count rows per group (count)**. In the **Which table?** list pick `coded`, then select **Choose the column from coded** and pick the code column.

**In the worksheet (Twitch):** Task 2.1 counts the missing values (`TRUE` with `4` for `chat`, `96` for `streams`), and Task 2.3 counts the categories (a table that starts `Art`, `Fortnite`, `Just Chatting`, then `[1] 50` channels).

## Step 5: Fix what the check found

Fix a typing slip in R, not by hand in the spreadsheet, so the fix is written down and runs again every time. `str_to_lower()` makes text lowercase ([str_to_lower() on the stringr cheat sheet](../../resources/cheat-sheets/stringr.html#str_to_lower-make-text-lowercase)), and `mutate()` replaces the column with the fixed version ([mutate() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#mutate-add-or-change-a-column)).

```r
coded <- coded %>%
  mutate(threat = str_to_lower(threat))
```

Then count again, to see the fix worked:

```r
coded %>%
  count(threat)
```

```
> coded <- coded %>%
+   mutate(threat = str_to_lower(threat))

> coded %>%
+   count(threat)
# A tibble: 3 × 2
  threat      n
  <chr>   <int>
1 monster    37
2 none       27
3 villain    56
```

**Check:** three values, `37` monsters now (36 plus the one that was `Monster`), and nothing else.

Your own check may find a different problem, such as a space after a code or a code that is not in your codebook. Fix each one in its own line, then count again. If you are not sure how, run **AURA: Explain an R error** or email me the output of your `count()`.

**In the worksheet (Twitch):** Part 3 is the worksheet's fix step. Task 3.1 turns the timestamps into readable times (R Companion: **R2 Data**, then **Turn the date column into a time (as_datetime)**): `first` is `2018-11-18 21:55:27`.

## Step 6: Load the second table and join it to your coding sheet

### 6a. Load it and look at it

Load your sources table the same way, under a second name you choose. The example calls the raw file `seasons_raw`.

```r
seasons_raw <- read_csv("data/power_rangers_seasons.csv")
```

```r
glimpse(seasons_raw)
```

```
> seasons_raw <- read_csv("data/power_rangers_seasons.csv")
Rows: 28 Columns: 7
── Column specification ──────────────────────────────────────────────────────────────────
Delimiter: ","
chr  (3): season_title, air_date_last_ep, producer
dbl  (3): season_num, number_of_episodes, IMDB_rating
date (1): air_date_first_ep

ℹ Use `spec()` to retrieve the full column specification for this data.
ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.

> glimpse(seasons_raw)
Rows: 28
Columns: 7
$ season_title       <chr> "Mighty Morphin (Season 1)", "Mighty Morphin (Season 2)", "Mi…
$ season_num         <dbl> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18…
$ number_of_episodes <dbl> 60, 52, 33, 50, 45, 43, 45, 40, 40, 40, 38, 38, 38, 32, 32, 3…
$ air_date_first_ep  <date> 1993-08-28, 1994-07-21, 1995-09-02, 1996-04-20, 1997-04-19, …
$ air_date_last_ep   <chr> "1994-05-23", "1995-05-20", "1995-11-27", "1996-11-27", "1997…
$ producer           <chr> "Saban", "Saban", "Saban", "Saban", "Saban", "Saban", "Saban"…
$ IMDB_rating        <dbl> 6.5, 6.5, 6.5, 6.6, 5.7, 7.3, 6.9, 6.5, 7.1, 6.3, 6.4, 6.8, 6…
```

**Check the column types.** `air_date_first_ep` is a `date`, but `air_date_last_ep` is `chr`, text. When `read_csv()` finds even one cell in a column that is not a full date, it reads the whole column as text. The last three rows show which cell:

```r
seasons_raw %>%
  select(season_title, air_date_last_ep) %>%
  slice_tail(n = 3)
```

```
> seasons_raw %>%
+   select(season_title, air_date_last_ep) %>%
+   slice_tail(n = 3)
# A tibble: 3 × 2
  season_title              air_date_last_ep
  <chr>                     <chr>           
1 Beast Morphers (Season 1) 2019-12-14      
2 Beast Morphers (Season 2) 2020-12-12      
3 Dino Fury                 2022            
```

`2022` is a year, not a date. This study does not need that column, so the next step leaves it out. If a date column you **do** need reads as `chr`, the fix is in **If it does not work** at the end of this guide.

### 6b. Keep only the columns you need, and the key

Find the key: the one column name that appears in both `glimpse()` printouts and means the same thing in both. Here it is `season_title`. In your data, it might be `channel`, `username`, `account`, or `outlet`, spelled exactly the same in both files.

Then keep the key plus the columns you want to add. Both tables have a rating column, and joining without this step would give you two of them. `select()` keeps the columns you name ([select() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#select-keep-the-columns-you-name)):

```r
seasons <- seasons_raw %>%
  select(season_title, season_num, producer)
```

This prints nothing. A line that makes a table with `<-` is silent; the table is there, and the R Companion's **Workspace** panel lists it.

### 6c. Join, then check the join two ways

Count your rows before the join, so you can compare after it:

```r
nrow(coded)
```

```
> nrow(coded)
[1] 120
```

`left_join()` keeps every row of the first table (your coding sheet) and adds the matching columns from the second. `join_by()` names the key ([left_join() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#left_join-add-another-tables-columns-by-a-shared-key)). You may also see the key written `by = "season_title"`; `by = join_by(season_title)` means the same thing.

```r
coded_seasons <- coded %>%
  left_join(seasons, by = join_by(season_title))
```

```r
nrow(coded_seasons)
```

```
> coded_seasons <- coded %>%
+   left_join(seasons, by = join_by(season_title))

> nrow(coded_seasons)
[1] 120
```

**Check 1:** the row count is the same as before the join. If it grew, the key appears more than once in your second table (two rows for the same account), and some items were matched twice.

**Check 2:** count the items whose key found no match in the second table. `anti_join()` keeps exactly those rows ([anti_join() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#anti_join-find-the-rows-that-did-not-match)):

```r
coded %>%
  anti_join(seasons, by = join_by(season_title)) %>%
  nrow()
```

```
> coded %>%
+   anti_join(seasons, by = join_by(season_title)) %>%
+   nrow()
[1] 0
```

Zero is what you want. A number above zero means some keys in your coding sheet are spelled differently in your second table: usually capitals, a space, or a typo. Drop the `nrow()` line to see which rows they are.

**The R Companion shortcut, once you have typed it yourself:** **AURA: Write R code**, then under **R2 Data**, **Join two tables by a shared column**. Answer its three questions (the table you keep every row of: `coded`; the table you take columns from: `seasons`; the shared column: type `season_title`), then select **Keep every row of coded**. It writes this same `left_join()` with both checks, and names the result `coded_seasons`.

**In the worksheet (Twitch):** Part 4 has two joins. Task 4.1 matches each message to its stream by channel and nearest earlier time (R Companion: **Join two tables by a key and nearest earlier time (left_join)**): `[1] 35267`, then `FALSE` `35256` and `TRUE` `11`. Task 4.2 joins the channel labels by `channel` (R Companion: **Label each channel by its top category**, then **Join the channel labels onto the messages**). Task 5.3 joins your codes by `id`: `[1] 35267`, your coded rows adding to `30`, and `NA` with `35237`.

## Step 7: Make every code column a factor

A code column holds categories, and a factor stores a category with its values in the order you choose ([factor() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#factor-store-a-category-in-the-order-you-choose)). `levels` lists every allowed value in that order. Give the order your codebook uses. Do it for every code column, and for any category column from the second table you will compare groups on. One `mutate()` line per column, so each one is easy to read and fix:

```r
coded_seasons <- coded_seasons %>%
  mutate(threat = factor(threat, levels = c("monster", "villain", "none"))) %>%
  mutate(focus = factor(focus, levels = c("team", "one_ranger", "other"))) %>%
  mutate(producer = factor(producer,
                           levels = c("Saban", "Saban/Disney", "Disney", "Saban Brands")))
```

Count each one again:

```r
coded_seasons %>%
  count(threat)
```

```r
coded_seasons %>%
  count(focus)
```

```r
coded_seasons %>%
  count(producer)
```

```
> coded_seasons <- coded_seasons %>%
+   mutate(threat = factor(threat, levels = c("monster", "villain", "none"))) %>%
+   mutate(focus = factor(focus, levels = c("team", "one_ranger", "other"))) %>%
+   mutate(producer = factor(producer,
+                            levels = c("Saban", "Saban/Disney", "Disney", "Saban Brands")))

> coded_seasons %>%
+   count(threat)
# A tibble: 3 × 2
  threat      n
  <fct>   <int>
1 monster    37
2 villain    56
3 none       27

> coded_seasons %>%
+   count(focus)
# A tibble: 4 × 2
  focus          n
  <fct>      <int>
1 team          54
2 one_ranger    52
3 other         13
4 <NA>           1

> coded_seasons %>%
+   count(producer)
# A tibble: 4 × 2
  producer         n
  <fct>        <int>
1 Saban           54
2 Saban/Disney     5
3 Disney          31
4 Saban Brands    30
```

**Check:** the type line now says `<fct>`, and the rows come in your order, not alphabetical (`monster`, `villain`, `none`). If a value is missing from `levels`, its rows turn into `NA`. So if a new `NA` row appears that was not there in Step 4, a value is misspelled in `levels` or in the data.

If your codes are numbers, such as `0` and `1`, add `labels` so the tables say what the numbers mean: `factor(reaction_only, levels = c(0, 1), labels = c("commentary", "reaction"))`.

**In the worksheet (Twitch):** Task 5.2 makes your `0` and `1` codes a factor with `labels = c("commentary", "reaction")`: two rows adding to `30`, no `NA`. Task 4.3 shows that `viewer_band` arrives as a factor: `small`, `medium`, `large`, in that order.

## Step 8: Add a column you need

If your study needs a number your data does not have, make it with `mutate()`. The example counts the characters in each synopsis with `str_length()` ([str_length() on the stringr cheat sheet](../../resources/cheat-sheets/stringr.html#str_length-count-the-characters)), the same way the worksheet counts the characters in each message.

```r
coded_seasons <- coded_seasons %>%
  mutate(desc_length = str_length(desc))
```

```r
coded_seasons %>%
  select(episode_title, desc_length) %>%
  slice_head(n = 3)
```

```
> coded_seasons <- coded_seasons %>%
+   mutate(desc_length = str_length(desc))

> coded_seasons %>%
+   select(episode_title, desc_length) %>%
+   slice_head(n = 3)
# A tibble: 3 × 2
  episode_title           desc_length
  <chr>                         <int>
1 Ronny on Empty: Part 2          225
2 The End of Time: Part 1         396
3 Dash for the Dagger             369
```

**Check:** the new column is there, and the first few numbers look possible for what it measures.

**In the worksheet (Twitch):** Task 3.2 adds `message_length` (R Companion: **R2 Data**, then **Add a column (mutate)**, which writes the Twitch column only): lengths `23`, `441`, and `8`.

## Step 9: Count the missing values and decide

Count the blanks in every column your analysis will use ([the same count() entry](../../resources/cheat-sheets/dplyr.html#count-how-many-rows-in-each-group)). `is.na()` is `TRUE` where a cell is empty:

```r
coded_seasons %>%
  count(is.na(focus))
```

```r
coded_seasons %>%
  count(is.na(imdb_rating))
```

```
> coded_seasons %>%
+   count(is.na(focus))
# A tibble: 2 × 2
  `is.na(focus)`     n
  <lgl>          <int>
1 FALSE            119
2 TRUE               1

> coded_seasons %>%
+   count(is.na(imdb_rating))
# A tibble: 1 × 2
  `is.na(imdb_rating)`     n
  <lgl>                <int>
1 FALSE                  120
```

**Check and decide:** one episode has no `focus`, and every episode has a rating. The example keeps that row, because its `threat` code and rating are still good: the `NA` only leaves it out of anything that uses `focus`. Write your decision down in plain words for your Methods section, such as: "One of 120 episodes was not coded for focus because its synopsis described no story; it is kept in every analysis that does not use focus."

**In the worksheet (Twitch):** Part 6 counts three kinds of missing values: `TRUE` with `4`, then `11`, then `501`, and asks you to write the same kind of decision.

## Step 10: Save your analysis file

Save the finished table as an RDS file, under a name you choose, in `data`. Your describing and testing code will read this file. RDS keeps the factors and their order; a CSV would lose them ([write_rds() on the readr cheat sheet](../../resources/cheat-sheets/readr.html#write_rds-save-a-table-in-rs-own-format)).

```r
write_rds(coded_seasons, "data/episodes_analysis.RDS")
```

Then read it back and count its rows, to be sure the save worked:

```r
read_rds("data/episodes_analysis.RDS") %>%
  nrow()
```

```
> write_rds(coded_seasons, "data/episodes_analysis.RDS")

> read_rds("data/episodes_analysis.RDS") %>%
+   nrow()
[1] 120
```

**Check:** the count matches your table, and `episodes_analysis.RDS` (or your file's name) appears under `data` in the Explorer. One last look at the whole table:

```r
glimpse(coded_seasons)
```

```
> glimpse(coded_seasons)
Rows: 120
Columns: 13
$ season_title  <chr> "Operation Overdrive", "Time Force", "Jungle Fury", "Time Force", …
$ episode_num   <dbl> 24, 38, 20, 30, 28, 7, 3, 24, 39, 40, 9, 11, 17, 15, 5, 44, 2, 30,…
$ episode_title <chr> "Ronny on Empty: Part 2", "The End of Time: Part 1", "Dash for the…
$ air_date      <date> 2007-08-27, 2001-11-03, 2008-07-14, 2001-09-08, 2002-09-14, 2008-…
$ imdb_rating   <dbl> 7.8, 8.6, 7.2, 8.5, 6.7, 7.0, 7.8, 6.2, 8.9, 8.8, 7.1, 7.2, 8.6, 6…
$ total_votes   <dbl> 26, 55, 35, 54, 40, 34, 210, 38, 59, 64, 35, 289, 29, 282, 99, 435…
$ desc          <chr> "With Ronny's life force fading, quickly, Will gets some \"unexpec…
$ threat        <fct> villain, villain, villain, villain, villain, villain, villain, non…
$ focus         <fct> team, team, one_ranger, team, one_ranger, one_ranger, team, team, …
$ coder_notes   <chr> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA…
$ season_num    <dbl> 15, 9, 16, 9, 10, 16, 7, 18, 9, 8, 16, 4, 26, 4, 8, 2, 24, 16, 11,…
$ producer      <fct> Disney, Saban, Disney, Saban, Saban/Disney, Disney, Saban, Saban B…
$ desc_length   <int> 225, 396, 369, 574, 125, 482, 136, 177, 416, 91, 427, 288, 92, 181…
```

**The R Companion shortcut, once you have typed it yourself:** **AURA: Write R code**, then under **R2 Data**, **Save a table as an RDS file**. Type your file name in the box (it starts as `data/twitch_analysis.RDS`, so change it) and press **Enter**. It writes these same two blocks for a table named `analysis`, so change `analysis` in its first line to your table's name (`coded_seasons` here) before you run it.

**In the worksheet (Twitch):** Part 7 saves `analysis` as `data/twitch_analysis.RDS`, the exact name the next two worksheets read: `[1] 35267`.

## MC 501: reviewer-facing comments

The worksheet's Part 8 asks for three comments in the code, each 40 to 100 words, at the places where you made a decision a reviewer could challenge. Do the same in your own wrangling script. A reviewer-facing comment names the decision, the rule you applied, and why you chose it over the alternative. A comment that only says what the code does ("make producer a factor") is not one of them.

The example has one such decision: what to do with the season made during the handover between Saban and Disney. Its comment sits on the line above the `factor()` step, and starts each line with `#`, so R skips it:

```
# Reviewer note: producer keeps Saban/Disney as its own level, in broadcast order,
# instead of folding its 5 episodes into Saban or Disney. The season was made during
# the handover between the two companies, so assigning it to either one would be a
# guess. The cost is a group too small to test on its own: the tests leave it out,
# and the paper says so.
```

That is 65 words. Your other two are likely to be your missing-values decision (Step 9) and anything you fixed in Step 5.

**In the worksheet (Twitch):** the three places are marked *MC 501 only* in Task 4.2 (the non-gaming list), Task 4.3 (the viewer-band cutoffs), and Part 7 (the export).

## If it does not work

**`'data/episode-codes.csv' does not exist in current working directory`.** R did not find your file. Your red message has your own file's name where this one has `episode-codes.csv`. The example below typed the name wrong, `episode-code` for `episode-codes`:

```
> library(readr)

> coded <- read_csv("data/episode-code.csv")
Error: 'data/episode-code.csv' does not exist in current working directory ('C:/Users/alexl/MC451-workspace').
Execution halted
```

The line you ran tells R to open a file inside the folder named `data` in your course workspace, the folder you have open in VS Code. Go through these checks in order, in the Explorer, the list of files and folders on the left side of VS Code. After each fix, run the same line again, the way Step 1 showed, and look at the bottom of the Terminal panel, the panel along the bottom of VS Code where the red message printed. **It worked if** the newest lines there show `Rows:` and `Columns:`, and nothing red comes after them. If the same red message prints, go on to the next check. If a different red message prints, find its first words among the bold headings in this section.

1. **Close every folder in the Explorer.** Under the word **EXPLORER** at the top of this list, a line in capital letters shows the name of your course workspace. Do not click that line. Below it, each folder has a small arrow in front of its name. The arrow points right, like `>`, when the folder is closed, and points down, like `v`, when it is open. Click the name of every folder whose arrow points down, so that every arrow points right. Every folder is now closed, and the list is short. You should see `03_Project`, `04_Resources`, and `README.md` in it. If those three are not in the short list, VS Code has a different folder open: open your course workspace with [guide 02](02-open-your-course-workspace.md), then start this check again.
2. **Look for `data` in the short list.** If no line reads `data`, make the folder with steps 3 and 4 of [Before you start](#before-you-start-put-both-files-in-your-data-folder), then come back to check 3.
3. **Find out whether your file is inside `data`.** Your file's name is the same as, or close to, the name after `data/` in your red message. Read the short list, with `data` still closed. If your file's name is in it, the file is outside `data`: drag its name onto the word `data` and let go, and if a box asks whether to move it, select **Move**. Then click the word `data` once, so that its arrow points down. The names that appear right below `data` when you click are the files inside it. You should see your file's name among them. If it is not there, bring it in from Downloads with steps 5 to 8 of [Before you start](#before-you-start-put-both-files-in-your-data-folder), using your file where those steps name the example files, then come back here and run your line again.
4. **Compare the two names, letter by letter.** One is your file's name below `data` in the Explorer. The other is in `wrangle.R`, the file you type your lines into: in the line you ran, it is the part between `data/` and the next quote mark. Every letter, every `-` and `_`, every capital letter, and the ending `.csv` must be the same in both. If they differ, retype that part of your line to match the Explorer, and leave `"data/` in front of it as it is.

**The same red message after all four checks?** Then email your instructor a picture of the whole VS Code window, with the list on the left and the red message at the bottom both showing (a photo taken with your phone is fine).

**Every column ends up in one.** If `read_csv()` reports `Columns: 1` and one long column name full of `;`, the file was saved with semicolons between the values instead of commas, as some versions of Excel do:

```
> library(readr)

> coded <- read_csv("data/episode-codes-semicolon.csv")
Warning: One or more parsing issues, call `problems()` on your data frame for details, e.g.:
  dat <- vroom(...)
  problems(dat)
Rows: 5 Columns: 1
── Column specification ──────────────────────────────────────────────────────────────────
Delimiter: ","
chr (1): season_title;episode_num;episode_title;air_date;IMDB_rating;total_votes;desc;...

ℹ Use `spec()` to retrieve the full column specification for this data.
ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.
```

Save it again from Excel with **File**, then **Save As**, and choose **CSV UTF-8 (Comma delimited)**, or read it with `read_csv2()`, which expects semicolons.

**Everything lands in one column named `Table 1`.** If `read_csv()` reports `Columns: 1` and `names()` shows one name that is none of your column names, such as `Table 1` or a sheet title, the file has a title row above the real column names. Numbers on a Mac writes one when **Include table names** is ticked as it exports; a title typed in the first row of a spreadsheet does the same:

```
> coded <- read_csv("data/episode-codes-title.csv")
Rows: 121 Columns: 1
── Column specification ────────────────────────────────────────────────────────
Delimiter: ","
chr (1): Table 1

ℹ Use `spec()` to retrieve the full column specification for this data.
ℹ Specify the column types or set `show_col_types = FALSE` to quiet this message.
Warning message:
One or more parsing issues, call `problems()` on your data frame for details,
e.g.:
  dat <- vroom(...)
  problems(dat)
> names(coded)
[1] "Table 1"
```

Export the file again without the title (in Numbers: **File**, then **Export To**, then **CSV...**, untick **Include table names**, and save over the old file), or tell `read_csv()` to skip the first line:

```r
coded <- read_csv("data/episode-codes.csv", skip = 1)
```

`Rows:` then counts your items again (120 here), and `names(coded)` lists your column names.

**Letters with accents turn into `�`.** If `café` reads as `caf�`, the file was saved in an older Mac text format, not UTF-8. Save it again as UTF-8: in Excel, **File**, then **Save As**, and choose **CSV UTF-8 (Comma delimited)**; in Numbers, **File**, then **Export To**, then **CSV...**, open **Advanced Options**, and set **Text Encoding** to **Unicode (UTF-8)**. Or read the file as it is:

```r
coded <- read_csv("data/episode-codes.csv", locale = locale(encoding = "macintosh"))
```

**A date column reads as `chr`.** One or more cells are not a full date (Step 6a). `ymd()` turns text written year-month-day into a date ([ymd() on the lubridate cheat sheet](../../resources/cheat-sheets/lubridate.html#ymd-read-a-date-with-no-time); use `mdy()` for month-day-year, such as `11/05/2026`). A cell it cannot read becomes `NA`, and R warns you how many:

```
> seasons_raw %>%
+   mutate(air_date_last_ep = ymd(air_date_last_ep)) %>%
+   select(season_title, air_date_last_ep) %>%
+   slice_tail(n = 2)
Warning: There was 1 warning in `mutate()`.
ℹ In argument: `air_date_last_ep = ymd(air_date_last_ep)`.
Caused by warning:
!  1 failed to parse.
# A tibble: 2 × 2
  season_title              air_date_last_ep
  <chr>                     <date>          
1 Beast Morphers (Season 2) 2020-12-12      
2 Dino Fury                 NA              
```

`1 failed to parse` is the `2022`. Count and decide on those `NA` rows as in Step 9.

**Running a line opens a box titled Choose where to run the selected code.** Press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Click the **AURA Lab R Companion** icon on VS Code's left edge and select **Run my steps from the top**. It runs your file from the first line, in the same R as **Run it**.

**`could not find function "read_csv"`** (or `glimpse`, `pull`, `%>%`, or any other function). R prints:

```
Error in read_csv("data/episode-codes.csv") : 
  could not find function "read_csv"
```

R does not know that function yet, because the `library()` lines at the top of your file have not run in this R session. That happens after R restarts, or when you run a line from the middle of your file first. Select the `library()` lines, right-click them (on a Mac, Control-click or click with two fingers), select **Run the selected lines in R**, and run your line again the same way. `read_csv()`, `read_rds()`, `glimpse()`, `pull()`, and `%>%` come from `library(tidyverse)`; `theme_v2v()` and `scale_fill_v2v()` come from `library(v2v)`. If the `library()` lines have run, check the spelling: R reads `Read_csv` and `read_csv` as two different names.

**`object 'coded' not found`.** A line above this one has not been run in this R session. Run your file from the top (the step above), then this line again.
