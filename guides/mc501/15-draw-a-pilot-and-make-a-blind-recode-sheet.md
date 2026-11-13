# Draw a Pilot Sample and Make a Blind Re-code Sheet

Draw your pilot items so anyone can draw them again, read long ids without losing digits, make a re-code sheet that hides your first codes, and line the two passes up for a reliability check. You type every line of R yourself and see what each one prints.

This guide is for the [Sampling Plan and Pilot](../../mc501-assignments.html#sampling-plan-and-pilot-20-to-30-items) (20 to 30 items). [Guide 06](06-draw-your-coding-sample.md), *Draw Your Coding Sample*, draws a sample from the course chat data; this guide draws from **your own** coding sheet. [Guide 07](07-reliability-grid.md) compares the two passes once you have them.

## The example data

- [episode-codes.csv](../../resources/examples/own-study-walkthrough/episode-codes.csv): 120 Power Rangers episodes, each with a hand-coded `threat` (`monster`, `villain`, or `none`). This is pass 1.
- [MC501-pilot-codes.csv](../../resources/examples/MC501-sampling-pilot/MC501-pilot-codes.csv): the course's worked-example pilot, 20 tweets with 19-digit ids, used in Step 2 only.
- [pilot-recode-done.csv](../../resources/examples/own-study-walkthrough/pilot-recode-done.csv): a **practice** second pass on the example's 20 pilot episodes, made up for this guide so Step 7 has something to find (three codes changed, one typed with a capital and a space, one left blank). Your own second pass is real coding.
- [pilot-recode.R](../../resources/examples/own-study-walkthrough/pilot-recode.R): the finished script, to compare with yours at any step.

Put the three CSV files in the folder named `data` in your course workspace, the folder you have open in VS Code. [Guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder) has the steps.

**No folder named `data`?** Look at the Explorer, the list of files and folders on the left side of VS Code. If no line in that list reads `data`, make the folder before you go on: [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder) has the steps.

## Words used here

- **Pilot:** a small first set of items you code to test your codebook before you code everything.
- **Pass 1, pass 2:** your first coding of an item, and your second coding of the same item at least 48 hours later. The columns are named for the variable and the pass: `threat_p1`, `threat_p2`.
- **Blind:** while you code pass 2, your pass 1 codes are out of sight.
- **Seed:** a number that makes a random draw come out the same every time it runs.
- **Id:** a column that names each item once and only once, so two tables can be lined up row by row.

### How to run lines in this guide

Type the lines into your script exactly as shown. Select them: click just before the first letter of the first line, hold the mouse button (or press on the trackpad), and drag to the end of the last line. Then right-click the highlighted lines (on a Mac, Control-click or click with two fingers) and select **Run the selected lines in R**. (Keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac.) What R prints appears in the **Terminal** panel along the bottom of VS Code.

## Step 1: Open a script and load the packages

1. In the Explorer, right-click (on a Mac, Control-click or click with two fingers) the empty space below the file list and select **New File...**. Type `pilot-recode.R` and press **Enter**.
2. Open an R terminal if one is not open: **View**, then **Command Palette...**, type `AURA: Open an R terminal`, and click it in the list.

```r
library(tidyverse)
library(janitor)
```

```
> library(tidyverse)
── Attaching core tidyverse packages ──────────────────────── tidyverse 2.0.0 ──
✔ dplyr     1.1.4     ✔ readr     2.1.6
✔ forcats   1.0.1     ✔ stringr   1.6.0
✔ ggplot2   4.0.1     ✔ tibble    3.3.0
✔ lubridate 1.9.4     ✔ tidyr     1.3.1
✔ purrr     1.2.0     
── Conflicts ────────────────────────────────────────── tidyverse_conflicts() ──
✖ dplyr::filter() masks stats::filter()
✖ dplyr::lag()    masks stats::lag()
ℹ Use the conflicted package (<http://conflicted.r-lib.org/>) to force all conflicts to become errors

> library(janitor)

Attaching package: 'janitor'

The following objects are masked from 'package:stats':

    chisq.test, fisher.test
```

**Check:** the `masked` lines are notes, not errors.

## Step 2: Read your sheet with every column as text

When `read_csv()` sees a column of digits, it stores it as a number. A number in R holds about 15 digits exactly, so a longer id, such as a tweet, post, or video id of 19 digits, comes back with its last digits changed. Two different items can then end up with the same id. Read the course's pilot example both ways and compare the first ids:

```r
as_numbers <- read_csv("data/MC501-pilot-codes.csv", show_col_types = FALSE)

as_numbers %>%
  select(tweet_id) %>%
  head(3)
```

```
> as_numbers <- read_csv("data/MC501-pilot-codes.csv", show_col_types = FALSE)

> as_numbers %>%
+   select(tweet_id) %>%
+   head(3)
# A tibble: 3 × 1
  tweet_id
     <dbl>
1  1.35e18
2  1.41e18
3  1.38e18
```

```r
as_text <- read_csv(
  "data/MC501-pilot-codes.csv",
  col_types = cols(.default = col_character())
)

as_text %>%
  select(tweet_id) %>%
  head(3)
```

```
> as_text <- read_csv(
+   "data/MC501-pilot-codes.csv",
+   col_types = cols(.default = col_character())
+ )

> as_text %>%
+   select(tweet_id) %>%
+   head(3)
# A tibble: 3 × 1
  tweet_id           
  <chr>              
1 1353446720806543360
2 1406146930506440706
3 1379524087568031748
```

**Check:** read as numbers, the ids print as `1.35e18` and similar: the last digits are gone. Read as text, they keep all 19 digits, such as `1406146930506440706`. Read as numbers, that id becomes `1406146930506440704`; 18 of this file's 20 ids change that way.

`col_types = cols(.default = col_character())` reads **every** column as text. That is what you want for a sheet you are about to sample and re-code: nothing is changed on the way in. ([read_csv() on the readr cheat sheet](../../resources/cheat-sheets/readr.html#read_csv-read-a-.csv-into-a-table).) Now read your coding sheet the same way:

```r
coded <- read_csv(
  "data/episode-codes.csv",
  col_types = cols(.default = col_character())
) %>%
  clean_names()

glimpse(coded)
```

```
> coded <- read_csv(
+   "data/episode-codes.csv",
+   col_types = cols(.default = col_character())
+ ) %>%
+   clean_names()

> glimpse(coded)
Rows: 120
Columns: 10
$ season_title  <chr> "Operation Overdrive", "Time Force", "Jungle Fury", "Tim…
$ episode_num   <chr> "24", "38", "20", "30", "28", "7", "3", "24", "39", "40"…
$ episode_title <chr> "Ronny on Empty: Part 2", "The End of Time: Part 1", "Da…
$ air_date      <chr> "2007-08-27", "2001-11-03", "2008-07-14", "2001-09-08", …
$ imdb_rating   <chr> "7.8", "8.6", "7.2", "8.5", "6.7", "7", "7.8", "6.2", "8…
$ total_votes   <chr> "26", "55", "35", "54", "40", "34", "210", "38", "59", "…
$ desc          <chr> "With Ronny's life force fading, quickly, Will gets some…
$ threat        <chr> "villain", "villain", "villain", "villain", "villain", "…
$ focus         <chr> "team", "team", "one_ranger", "team", "one_ranger", "one…
$ coder_notes   <chr> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, …
```

**Check:** 120 rows, and every column says `<chr>`.

If the first row of your file is a title and the column names are on the second row, `glimpse()` shows names like `...2`. Add `skip = 1,` on the line after the file name, so `read_csv()` starts at the second row.

## Step 3: Give every item an id, if it has none

The later steps find each item by a column named `id`. Look in the **Terminal** panel at the list `glimpse(coded)` printed at the end of Step 2: each of its lines starts with `$` and then one of your column names, such as `$ season_title`. `clean_names()` wrote these names in lower case with no spaces, so `Post ID` on your sheet shows here as `post_id`.

**If one of those names is your sheet's id**, the column that gives each post or video its own number, such as `post_id` or `video_id`, copy that column into a new column named `id`. At the bottom of your script, under the lines from Step 2, type these two lines. Change `post_id` to your id column's name, exactly as the list shows it after the `$`. Then select both lines and run them:

```r
coded <- coded %>%
  mutate(id = post_id)
```

R shows your two lines again and no message. That means it worked: R added a column named `id` to `coded`, the copy of your sheet that R holds, and your file does not change. Now go down to the paragraph that starts **The check, for every sheet**.

**If none of those names is an id**, make one from two of your columns: the column that says who posted the item, such as an account name, and the column with its date. The check below tells you whether those two are enough. The course's example sheet has no id column, but the season and the episode number together name each episode once. `paste()` joins them into one text column, and `mutate()` adds it ([mutate() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#mutate-add-or-change-a-column)). At the bottom of your script, type these two lines, with your two column names in place of `season_title` and `episode_num`. Then select both lines and run them:

```r
coded <- coded %>%
  mutate(id = paste(season_title, episode_num))
```

**The check, for every sheet:** no id appears twice. `count()` counts the rows for each id, and `filter()` keeps the ids with more than one ([count() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#count-how-many-rows-in-each-group)). At the bottom of your script, type these three lines, select them, and run them:

```r
coded %>%
  count(id) %>%
  filter(n > 1)
```

```
> coded <- coded %>%
+   mutate(id = paste(season_title, episode_num))

> coded %>%
+   count(id) %>%
+   filter(n > 1)
# A tibble: 0 × 2
# ℹ 2 variables: id <chr>, n <int>
```

**Check:** your output includes the line `# A tibble: 0 × 2`, as in the example: no id is used twice. If your output lists rows instead, each row shows an id that more than one item shares.

- **If you copied your own id column**, that item is on your sheet twice. Open your sheet where you coded it, delete one of the two rows, and download it again as a CSV file into your `data` folder under the same name, with the steps in [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder). Then select every line from Step 2 down to here and run them again.
- **If you used `paste()`**, add a third column inside it: after the second name, type a comma, a space, and the name of another column, such as a time. The example's line would become `mutate(id = paste(season_title, episode_num, air_date))`. Then select the `mutate()` lines and the check lines and run them again.

## Step 4: Draw the pilot

`slice_sample()` draws rows at random, and `set.seed()` makes the draw the same every time, for you and for anyone checking your work ([slice_sample() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#slice_sample-draw-a-random-few-rows)). Pick your own seed number and write it in your sampling plan. The MC 501 pilot is 20 to 30 items; the example draws 20:

```r
set.seed(2026)

pilot <- coded %>%
  slice_sample(n = 20)

pilot %>%
  count(threat)
```

```
> set.seed(2026)

> pilot <- coded %>%
+   slice_sample(n = 20)

> pilot %>%
+   count(threat)
# A tibble: 3 × 2
  threat      n
  <chr>   <int>
1 monster     4
2 none        3
3 villain    13
```

**Check:** 20 rows in all (4 + 3 + 13 here; yours will differ). Run the three lines again, seed line included, and the same 20 come back.

If you have not coded yet, code these items now: they are your pass 1. The example already has pass 1 codes, so save them under the name `threat_p1`, with the id. `select()` keeps the columns you name and can rename one as it keeps it ([select() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#select-keep-the-columns-you-name)):

```r
first_codes <- pilot %>%
  select(id, threat_p1 = threat)

write_csv(first_codes, "data/pilot-first-codes.csv")
```

```
> first_codes <- pilot %>%
+   select(id, threat_p1 = threat)

> write_csv(first_codes, "data/pilot-first-codes.csv")
```

**Check:** `pilot-first-codes.csv` appears in the `data` folder in the Explorer.

## Step 5: Make the blind re-code sheet

The re-code sheet holds everything you need to code each item again, and an empty column for pass 2, but **not** your pass 1 codes. Keep the id and the columns you read or watch when you code (here the title and the description; for you, perhaps a link and a caption):

```r
recode_sheet <- pilot %>%
  select(id, episode_title, desc) %>%
  mutate(threat_p2 = NA)

write_csv(recode_sheet, "data/pilot-recode.csv", na = "")

glimpse(recode_sheet)
```

```
> recode_sheet <- pilot %>%
+   select(id, episode_title, desc) %>%
+   mutate(threat_p2 = NA)

> write_csv(recode_sheet, "data/pilot-recode.csv", na = "")

> glimpse(recode_sheet)
Rows: 20
Columns: 4
$ id            <chr> "In Space 36", "Megaforce 15", "In Space 11", "Time Forc…
$ episode_title <chr> "The Enemy Within", "The Human Factor", "The Delta Disco…
$ desc          <chr> "While searching for their Mega Voyager, the Power Range…
$ threat_p2     <lgl> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, …
```

**Check:** three text columns and an empty `threat_p2`, and no `threat` column. `na = ""` writes the empty column as blank cells, not the letters `NA`, so you have nothing to delete before you code.

## Step 6: Code pass 2, at least 48 hours later

Wait at least 48 hours after pass 1. Do not open your pass 1 codes. Then code every row of `pilot-recode.csv` with your codebook, typing each code exactly as the codebook spells it. This uses Google Sheets, which is free; Excel works the same way.

1. In a web browser, go to `sheets.google.com` and sign in. Click **Blank spreadsheet**.
2. Click **File**, then **Import**. Click the **Upload** tab, then **Browse**, and choose `pilot-recode.csv` in your workspace's `data` folder.
3. In the **Import file** box, set **Import location** to **Replace spreadsheet**. Uncheck **Convert text to numbers, dates, and formulas**, so long ids stay text. Click **Import data**.
4. Type a code in the `threat_p2` cell of every row.
5. Click **File**, then **Download**, then **Comma Separated Values (.csv)**.
6. Open your Downloads folder (File Explorer on Windows, Finder on a Mac) and drag the downloaded file onto the `data` folder in VS Code's Explorer. Right-click it there (on a Mac, Control-click or click with two fingers), select **Rename...**, type `pilot-recode-done.csv`, and press **Enter**.

For the example, use the practice file `pilot-recode-done.csv` from the example data list.

## Step 7: Read pass 2 back and line it up with pass 1

Read the finished sheet as text, keep the id and the pass 2 code, and fix the two typing slips a spreadsheet or a phone keyboard adds: capitals and extra spaces. `str_to_lower()` makes every letter lowercase and `str_squish()` removes spaces at the ends ([the stringr cheat sheet](../../resources/cheat-sheets/stringr.html)):

```r
second_codes <- read_csv(
  "data/pilot-recode-done.csv",
  col_types = cols(.default = col_character())
) %>%
  clean_names() %>%
  select(id, threat_p2) %>%
  mutate(threat_p2 = str_to_lower(threat_p2)) %>%
  mutate(threat_p2 = str_squish(threat_p2))
```

Do the same to pass 1, so a capital typed in either pass does not count as a disagreement. Then join the two passes by id ([left_join() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#left_join-add-another-tables-columns-by-a-shared-key)):

```r
both_passes <- first_codes %>%
  mutate(threat_p1 = str_to_lower(threat_p1)) %>%
  mutate(threat_p1 = str_squish(threat_p1)) %>%
  left_join(second_codes, by = join_by(id))

both_passes %>%
  filter(is.na(threat_p1) | is.na(threat_p2))
```

```
> second_codes <- read_csv(
+   "data/pilot-recode-done.csv",
+   col_types = cols(.default = col_character())
+ ) %>%
+   clean_names() %>%
+   select(id, threat_p2) %>%
+   mutate(threat_p2 = str_to_lower(threat_p2)) %>%
+   mutate(threat_p2 = str_squish(threat_p2))

> both_passes <- first_codes %>%
+   mutate(threat_p1 = str_to_lower(threat_p1)) %>%
+   mutate(threat_p1 = str_squish(threat_p1)) %>%
+   left_join(second_codes, by = join_by(id))

> both_passes %>%
+   filter(is.na(threat_p1) | is.na(threat_p2))
# A tibble: 1 × 3
  id                   threat_p1 threat_p2
  <chr>                <chr>     <chr>    
1 Super Ninja Steel 15 none      <NA>     
```

**Check:** the `filter()` lists every item missing a code in either pass. Here it is `Super Ninja Steel 15`, left blank on purpose. Go back to your sheet and code any item it lists, download it again, and rerun this step until it prints `0 × 3`. An item missing from pass 2 also shows up here, because `left_join()` keeps every pilot item.

Then save the lined-up table:

```r
write_csv(both_passes, "data/pilot-both-passes.csv", na = "")
```

## Step 8: Compare the two passes

[Guide 07](07-reliability-grid.md), *Check Your Reliability in R*, compares the two passes and computes the statistic your codebook calls for, Cohen's kappa or Krippendorff's alpha. Your `pilot-both-passes.csv` already has the shape it needs, so start at [its Part 2](07-reliability-grid.md#part-2-run-the-check).

## What goes in your write-up

- In the sampling plan: the pilot size, how you drew it, and the seed.
- In the pilot write-up: the gap between the two passes in hours, that pass 1 codes were hidden during pass 2, and the reliability figure from [guide 07](07-reliability-grid.md).
- In the White Paper Methods: the stability figure from this pilot re-code. There is no second re-code.

## If it does not work

If running a line opens a box titled **Choose where to run the selected code**, press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Instead, click the **AURA Lab R Companion** icon on VS Code's left edge and select **Run my steps from the top**.

**Your ids end in `e+18`, or two items share an id.** The sheet was read as numbers somewhere: by `read_csv()` without `col_types`, or by a spreadsheet that converted it. Read it again as in Step 2, and when you import into Google Sheets, uncheck **Convert text to numbers, dates, and formulas**. If the ids were already changed in a file you saved from a spreadsheet, go back to the file you downloaded or exported first.

**Every `threat_p2` is `NA` after the join.** The ids in the two files do not match. Run `head(first_codes$id)` and `head(second_codes$id)` and compare them: a spreadsheet may have changed them, or the re-code sheet came from a different draw.

**`Column 'threat_p2' doesn't exist`.** The spreadsheet renamed the column, or you renamed it while coding. Run `names(read_csv("data/pilot-recode-done.csv"))` and use the name it prints in `select()`.

**`cannot open file 'data/...': No such file or directory`.** The file is not in your `data` folder, or its name differs. Check the Explorer under `data` and type the name exactly as it shows.
