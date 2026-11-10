# Check Your Reliability in R: Pass 1 Against Pass 2

Put your two coding passes side by side in one sheet, then have R count how often you agreed with yourself, list the items you coded differently, and compute Cohen's kappa for each variable. It works on your own coding sheet, whatever you study. You type every line of R yourself and see what each one prints.

This guide is for the stability check in the [Sampling Plan and Pilot](../../mc451-assignments.html#sampling-plan-and-pilot) and for the stability re-code in the [White Paper](../../mc451-assignments.html#white-paper). Make your second pass first: [Guide 15](15-draw-a-pilot-and-make-a-blind-recode-sheet.md), *Draw a Pilot Sample and Make a Blind Re-code Sheet*, draws the items and makes a re-code sheet that hides your first codes.

**Stability:** how closely you agree with yourself when you code the same items twice. You are the only coder on your project, so pass 1 and pass 2 are both yours. In your write-up, call the number a stability figure, never agreement between coders.

## The example data

The example is the Power Rangers study from [guide 08](08-wrangling.md) and [guide 15](15-draw-a-pilot-and-make-a-blind-recode-sheet.md): the same 20 pilot episodes, each coded for `threat` (`monster`, `villain`, or `none`) and `focus` (`team`, `one_ranger`, or `other`).

- [pilot-pass-1.csv](../../resources/examples/own-study-walkthrough/pilot-pass-1.csv): pass 1, the first coding of the 20 episodes.
- [pilot-pass-2.csv](../../resources/examples/own-study-walkthrough/pilot-pass-2.csv): a **practice** pass 2, made up for this guide so the check has something to find. Your own second pass is real coding.
- [reliability.R](../../resources/examples/own-study-walkthrough/reliability.R): the starter script. It runs on the example as it is, and a comment marks every line you change for your own study (`CHANGE`).

Put the two CSV files in the folder named `data` in your course workspace, the folder you have open in VS Code. [Guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder) has the steps.

**No folder named `data`?** Look at the Explorer, the list of files and folders on the left side of VS Code. If no line in that list reads `data`, make the folder before you go on: [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder) has the steps.

## Words used here

- **Pass 1, pass 2:** your first coding of an item, and your second coding of the same item at least 48 hours later, with your first codes out of sight.
- **Id:** a column that names each item once and only once, the same way in both passes, so R can line the two passes up row by row.
- **Percent agreement:** the share of items where both passes gave the same code.
- **Cohen's kappa:** agreement after taking out the matches you would get by luck alone. 1 means the passes always matched; 0 means they matched no more often than chance.

### How to run lines in this guide

Type the lines into your script exactly as shown. Select them: click just before the first letter of the first line, hold the mouse button (or press on the trackpad), and drag to the end of the last line. Then right-click the highlighted lines (on a Mac, Control-click or click with two fingers) and select **Run the selected lines in R**. (Keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac.) What R prints appears in the **Terminal** panel along the bottom of VS Code.

## Part 1: Prepare your code sheet

The check needs one sheet with this shape:

| id | threat_p1 | threat_p2 |
|:---|:---|:---|
| In Space 36 | villain | villain |
| Time Force 26 | villain | none |

A second variable adds two more columns, `focus_p1` and `focus_p2`, and so on for each variable in your codebook.

- **One row per item**, and the same items in both passes.
- **An `id` column** that names each item the same way in both passes.
- **One column per variable per pass**, named for the variable and the pass: `threat_p1` for pass 1, `threat_p2` for pass 2.
- **Ids read as text.** A long id, such as a 19-digit post id, loses its last digits if R or a spreadsheet reads it as a number, and then the passes no longer match. [Guide 15, Step 2](15-draw-a-pilot-and-make-a-blind-recode-sheet.md) shows what that looks like.

Which of these describes your files?

- **You made your re-code sheet with guide 15.** Your `data/pilot-both-passes.csv` already has this shape. Skip to [Part 2](#part-2-run-the-check).
- **You have one sheet per pass**, such as a pass 1 sheet and a pass 2 sheet with the same column names. Steps 1 to 3 join them into one sheet. The example is this case.
- **You typed both passes into one sheet**, side by side. Rename its columns in your spreadsheet to the `_p1` and `_p2` pattern, save it as `pilot-both-passes.csv` in your `data` folder, and skip to [Part 2](#part-2-run-the-check). If that sheet holds every item but you coded only some of them a second time, do this before you save: make a copy of the sheet, and in the copy delete every row that has no pass 2 code. Save the copy, not the full sheet, as `pilot-both-passes.csv`. A row with an empty pass 2 code makes Step 6 print `NA` where a number should be.

If you study two sources, such as Reddit posts and news articles, keep one sheet per source, each with its own pass 1 and pass 2, and run this guide once per source. You report one number per source.

### Step 1: Open a script and load the packages

1. In the Explorer, right-click (on a Mac, Control-click or click with two fingers) the empty space below the file list and select **New File...**. Type `reliability.R` and press **Enter**. (Or download the starter script from the example data list and drag it into your workspace.)
2. Open an R terminal if one is not open: **View**, then **Command Palette...**, type `AURA: Open an R terminal`, and click it in the list.

```r
library(tidyverse)
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
```

**Check:** no line says `Error`. The `Conflicts` lines are normal.

Kappa comes from the **irr** package, which the course package installs for you. The code names it in full (`irr::kappa2()`), so you never load irr yourself.

### Step 2: Read each pass as text

`read_csv()` reads a CSV into a table, and `col_types = cols(.default = col_character())` reads every column as text, so no id loses a digit ([read_csv() on the readr cheat sheet](../../resources/cheat-sheets/readr.html)). `select()` keeps only the id and your code columns ([select() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#select-keep-the-columns-you-name)). Change the file names and column names to yours:

```r
pass_1 <- read_csv(
  "data/pilot-pass-1.csv",
  col_types = cols(.default = col_character())
) %>%
  select(id, threat, focus)

pass_2 <- read_csv(
  "data/pilot-pass-2.csv",
  col_types = cols(.default = col_character())
) %>%
  select(id, threat, focus)
```

```
> pass_1 <- read_csv(
+   "data/pilot-pass-1.csv",
+   col_types = cols(.default = col_character())
+ ) %>%
+   select(id, threat, focus)

> pass_2 <- read_csv(
+   "data/pilot-pass-2.csv",
+   col_types = cols(.default = col_character())
+ ) %>%
+   select(id, threat, focus)
```

**Check:** R prints no `Error`. If R says ``Can't subset columns that don't exist``, a column is named differently in your file: run `names(read_csv("data/pilot-pass-1.csv"))` and use the names it prints.

### Step 3: Line the passes up by id

`left_join()` puts pass 2 beside pass 1, matching each item by its id ([left_join() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#left_join-add-another-tables-columns-by-a-shared-key)). Both tables have a `threat` column, so `suffix` names them `threat_p1` and `threat_p2`. The `filter()` then lists any item missing a code in either pass. Write one `is.na()` pair for each of your variables:

```r
both_passes <- pass_1 %>%
  left_join(pass_2, by = join_by(id), suffix = c("_p1", "_p2"))

both_passes %>%
  filter(is.na(threat_p1) | is.na(threat_p2) | is.na(focus_p1) | is.na(focus_p2))
```

```
> both_passes <- pass_1 %>%
+   left_join(pass_2, by = join_by(id), suffix = c("_p1", "_p2"))

> both_passes %>%
+   filter(is.na(threat_p1) | is.na(threat_p2) | is.na(focus_p1) | is.na(focus_p2))
# A tibble: 0 × 5
# ℹ 5 variables: id <chr>, threat_p1 <chr>, focus_p1 <chr>, threat_p2 <chr>,
#   focus_p2 <chr>
```

**Check:** `0 × 5` means every item has a code in both passes. If rows appear, either a cell is blank or an id is written differently in the two files (an extra space, a capital letter, or a long id changed by a spreadsheet). Fix it in your sheet, save it, and run Steps 2 and 3 again until this prints 0 rows.

Then save the side-by-side sheet. `na = ""` writes any blank as an empty cell:

```r
write_csv(both_passes, "data/pilot-both-passes.csv", na = "")
```

**Check:** `pilot-both-passes.csv` appears in the `data` folder in the Explorer. This is the same file guide 15 makes, so from here on both routes are the same.

## Part 2: Run the check

### Step 4: Read the side-by-side sheet

```r
both_passes <- read_csv(
  "data/pilot-both-passes.csv",
  col_types = cols(.default = col_character())
)

glimpse(both_passes)
```

```
> both_passes <- read_csv(
+   "data/pilot-both-passes.csv",
+   col_types = cols(.default = col_character())
+ )

> glimpse(both_passes)
Rows: 20
Columns: 5
$ id        <chr> "In Space 36", "Megaforce 15", "In Space 11", "Time Force 26…
$ threat_p1 <chr> "villain", "villain", "villain", "villain", "villain", "mons…
$ focus_p1  <chr> "team", "one_ranger", "one_ranger", "one_ranger", "one_range…
$ threat_p2 <chr> "villain", "villain", "villain", "none", "villain", "monster…
$ focus_p2  <chr> "team", "one_ranger", "team", "one_ranger", "one_ranger", "o…
```

**Check:** `Rows` is the number of items you coded twice, and every variable has a `_p1` and a `_p2` column. The order of the columns does not matter. If you came from guide 15, you see `id`, `threat_p1`, and `threat_p2`.

### Step 5: See every pair of codes

`count()` with both columns of one variable shows how often each pair of codes came up ([count() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#count-how-many-rows-in-each-group)):

```r
both_passes %>%
  count(threat_p1, threat_p2)
```

```
> both_passes %>%
+   count(threat_p1, threat_p2)
# A tibble: 4 × 3
  threat_p1 threat_p2     n
  <chr>     <chr>     <int>
1 monster   monster       4
2 none      none          3
3 villain   none          3
4 villain   villain      10
```

**Check:** rows where the two codes are the same are agreements; the others are disagreements. Here all three disagreements are `villain` in pass 1 and `none` in pass 2, which points at the line in the codebook that separates the two. A code spelled two ways, such as `villain` and `Villain `, shows up as its own row: fix the spelling in your sheet so it matches your codebook, then run Steps 2 to 5 again.

### Step 6: Percent agreement for each variable

`threat_p1 == threat_p2` is `TRUE` for each item where the passes match, and `mean()` turns those into a share between 0 and 1 ([summarize() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#group_by-plus-summarize-one-row-per-group)). Write one line per variable:

```r
both_passes %>%
  summarize(
    items = n(),
    threat = mean(threat_p1 == threat_p2),
    focus = mean(focus_p1 == focus_p2)
  )
```

```
> both_passes %>%
+   summarize(
+     items = n(),
+     threat = mean(threat_p1 == threat_p2),
+     focus = mean(focus_p1 == focus_p2)
+   )
# A tibble: 1 × 3
  items threat focus
  <int>  <dbl> <dbl>
1    20   0.85   0.9
```

The passes matched on 17 of 20 episodes for `threat` (85 percent) and 18 of 20 for `focus` (90 percent). Percent agreement counts lucky matches too, so it never goes in your write-up alone: Step 8 adds kappa.

**Check:** one number per variable, each between 0 and 1. `NA` means an item is missing a code: go back to Step 3.

### Step 7: List the items you coded differently

`filter()` keeps only the items where the two passes differ (`!=` means "is not equal to"), and `select()` shows just the id and the two codes ([filter() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#filter-keep-the-rows-that-pass-a-test)). Run it once per variable:

```r
both_passes %>%
  filter(threat_p1 != threat_p2) %>%
  select(id, threat_p1, threat_p2)

both_passes %>%
  filter(focus_p1 != focus_p2) %>%
  select(id, focus_p1, focus_p2)
```

```
> both_passes %>%
+   filter(threat_p1 != threat_p2) %>%
+   select(id, threat_p1, threat_p2)
# A tibble: 3 × 3
  id                          threat_p1 threat_p2
  <chr>                       <chr>     <chr>    
1 Time Force 26               villain   none     
2 Mighty Morphin (Season 2) 7 villain   none     
3 Ninja Steel 14              villain   none     

> both_passes %>%
+   filter(focus_p1 != focus_p2) %>%
+   select(id, focus_p1, focus_p2)
# A tibble: 2 × 3
  id             focus_p1   focus_p2
  <chr>          <chr>      <chr>   
1 In Space 11    one_ranger team    
2 Ninja Steel 13 one_ranger team    
```

**Check:** each row is an item to reread against your codebook. These items are where your edge cases and codebook revisions come from, and the pilot write-up asks for both. An empty table (`0 × 3`) means the passes never disagreed on that variable.

### Step 8: Cohen's kappa for each variable

The [Sampling Plan and Pilot](../../mc451-assignments.html#sampling-plan-and-pilot) asks how often your two passes agreed; report Cohen's kappa beside the percent agreement, as the course's pilot slides do. `kappa2()` takes a table with exactly two columns, pass 1 and pass 2, so `select()` picks them first ([kappa2() on the reliability cheat sheet](../../resources/cheat-sheets/reliability.html#irrkappa2-cohens-kappa)). Run it once per variable:

```r
both_passes %>%
  select(threat_p1, threat_p2) %>%
  irr::kappa2()

both_passes %>%
  select(focus_p1, focus_p2) %>%
  irr::kappa2()
```

```
> both_passes %>%
+   select(threat_p1, threat_p2) %>%
+   irr::kappa2()
 Cohen's Kappa for 2 Raters (Weights: unweighted)

 Subjects = 20 
   Raters = 2 
    Kappa = 0.746 

        z = 4.8 
  p-value = 1.59e-06 

> both_passes %>%
+   select(focus_p1, focus_p2) %>%
+   irr::kappa2()
 Cohen's Kappa for 2 Raters (Weights: unweighted)

 Subjects = 20 
   Raters = 2 
    Kappa = 0.844 

        z = 5.27 
  p-value = 1.33e-07 
```

The number to report is the `Kappa` line: 0.746 for `threat` and 0.844 for `focus`. "Subjects" is your items, and "Raters = 2" is your two passes; it says raters because kappa was built for two coders, but here both are you. Leave the z and the p-value out of your write-up: they test whether kappa is above zero, which is not what a stability check asks.

**Read the number against the course floor:** kappa of 0.70 or higher is good enough to go on, and 0.80 is comfortable. Below 0.70, fix the codebook rule behind the disagreements from Step 7 and pilot again. In the example, `threat` clears the floor and `focus` is comfortable. The [threshold table on the reliability cheat sheet](../../resources/cheat-sheets/reliability.html#read-the-number-against-the-threshold) has the details.

### If your codebook calls for Krippendorff's alpha

Alpha wants numbers, so first list your codes once, in your codebook's order. `match()` turns each code into its place in that list, and `t()` turns the table on its side, one row per pass, the way `kripp.alpha()` wants it ([alpha on the reliability cheat sheet](../../resources/cheat-sheets/reliability.html#irrkripp.alpha-krippendorffs-alpha)):

```r
threat_codes <- c("monster", "villain", "none")

both_passes %>%
  select(threat_p1, threat_p2) %>%
  mutate(threat_p1 = match(threat_p1, threat_codes)) %>%
  mutate(threat_p2 = match(threat_p2, threat_codes)) %>%
  t() %>%
  irr::kripp.alpha(method = "nominal")
```

```
> threat_codes <- c("monster", "villain", "none")

> both_passes %>%
+   select(threat_p1, threat_p2) %>%
+   mutate(threat_p1 = match(threat_p1, threat_codes)) %>%
+   mutate(threat_p2 = match(threat_p2, threat_codes)) %>%
+   t() %>%
+   irr::kripp.alpha(method = "nominal")
 Krippendorff's alpha

 Subjects = 20 
   Raters = 2 
    alpha = 0.747 
```

**Check:** every code in the Step 5 table is in your list, spelled the same way. `match()` turns a code that is not in the list into a blank, and alpha skips it without a warning.

Alpha's floor is 0.80. From 0.667 to 0.799, report it and call the results that rest on it tentative; below 0.667, fix the rule and pilot again. The starter script has the same block for `focus` (alpha 0.846).

## Or let the R Companion write the check

Version 0.7.2 of the AURA Lab R Companion writes the same check for you, from your own file. To see your version, click the **Extensions** icon on VS Code's left edge and find **AURA Lab R Companion** in the list.

1. Click inside your `reliability.R` script, on an empty line at the end.
2. Click the **AURA Lab R Companion** icon on VS Code's left edge. Under **Data**, click **Reliability: compare two coding passes**.
3. A list opens at the top of the window, asking **Where are your two coding passes?** Click **A CSV file with both passes**.
4. In the box that opens, find your `data` folder, click `pilot-both-passes.csv` (or your own file of both passes), and click **Use this file**.
5. Keep the table name it suggests, or type your own, and press **Enter**.
6. The next list shows each variable with a `_p1` and a `_p2` column, all ticked. Click **OK** to check them all. If your two pass columns have other names, tick **Choose the two columns myself** instead, then click your pass 1 column and your pass 2 column.

The code lands in your script with a comment above every step, and a message at the bottom right offers **Run it**. It prints percent agreement, every pair of codes, Cohen's kappa, and Krippendorff's alpha for each variable, then the same kappa from the course package's `reliability()` as a check.

**Check:** the numbers match the ones the steps above printed. In the example: agreement 0.85 and 0.9, kappa 0.746 and 0.844, alpha 0.747 and 0.846. The Companion reads every column as text too, so long ids keep their digits.

## What goes in your write-up

- **In the pilot write-up:** how many items you re-coded (the rubric asks for at least a quarter of your pilot items), the gap between the two passes in hours (at least 48), that your pass 1 codes were hidden during pass 2, and for each variable its percent agreement beside its kappa. Call it a stability figure from your own two passes. Then the codebook changes the Step 7 disagreements led to.
- **In your submission:** your coded pilot data (`pilot-both-passes.csv` holds both passes) and your `reliability.R`.
- **In the White Paper Methods:** the same check on your larger re-code, run with this guide on that re-code's sheet. The re-code may include or leave out your pilot items; say which you chose.

## If it does not work

If running a line opens a box titled **Choose where to run the selected code**, press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Instead, click the **AURA Lab R Companion** icon on VS Code's left edge and select **Run my steps from the top**.

**``'data/pilot-both-passes.csv' does not exist in current working directory``.** R did not find your file. The lines you ran at Step 4 tell R to open a file named `pilot-both-passes.csv` inside the folder named `data` in your course workspace, the folder you have open in VS Code. Do these four checks in order, in the Explorer, the list of files and folders on the left side of VS Code. Each check tells you where to go next. You run your lines again only at the end of check 4.

1. **Close every folder in the Explorer, then look for `data`.** Under the word **EXPLORER** at the top of this list, a line in capital letters shows the name of your course workspace. Do not click that line. Below it, each folder has a small arrow in front of its name. The arrow points right, like `>`, when the folder is closed, and points down, like `v`, when it is open. Click the name of every folder whose arrow points down, so that every arrow points right. Every folder is now closed, and the list is short. If one line in the short list reads exactly `data`, in small letters, go to check 2. If none does, make the folder with steps 3 and 4 of [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder). You should see a new line reading `data` in the list. Then come back here and go to check 2.
2. **Find out whether your sheet is inside `data`.** Your sheet is the one that holds both of your passes, the one you saved in Part 1 of this guide. Read the short list, with `data` still closed. If your sheet's name is in it, drag the name onto the word `data` and let go, and if a box asks whether to move it, select **Move**. Next, whether or not you dragged anything, look at the arrow in front of `data`: if it points right, click the word `data` once, so that it points down. The names that appear right below `data` are the files inside it. If your sheet's name is among them, go to check 3. If it is not, your sheet is not in your course workspace yet. Bring it in from your Downloads folder with steps 5 to 8 of [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder): those steps drag two example files, and you drag your one sheet the same way. You should then see your sheet's name right below `data`. Go to check 3.
3. **Check that your sheet's name ends in `.csv`.** That ending marks a CSV file, a plain copy of a spreadsheet, and it is the only kind of file these lines can open. If the name ends in `.csv`, go to check 4. If it ends in `.numbers` or `.xlsx`, or your sheet is only in Google Sheets and was never in your Downloads folder, you need a CSV copy of it. Open your sheet in the program you made it in (Numbers, Excel, or Google Sheets), the way you opened it to type your codes. Then use that program's **File** menu: in Numbers, **File**, then **Export To**, then **CSV...**; in Excel, **File**, then **Save As**, with the format **CSV UTF-8**; in Google Sheets, the **File** menu inside the web page, below the sheet's title, then **Download**, then **Comma-separated values (.csv)**. Save the copy in your Downloads folder. If a box opens and you are not sure what to choose in it, stop and email your instructor a picture of that box (a photo taken with your phone is fine). When the copy is saved, bring it in with steps 5 to 8 of [guide 08, Before you start](08-wrangling.md#before-you-start-put-both-files-in-your-data-folder), the same way as in check 2. You should see its name, ending in `.csv`, right below `data`. Go to check 4.
4. **Compare the two names, letter by letter, then run your lines.** One is your sheet's name below `data` in the Explorer, the one that ends in `.csv`. The other is in `reliability.R`, the file you type your lines into (if it is not showing, click `reliability.R` in the Explorer): in the Step 4 line that has `"data/` in it, it is the part between `data/` and the next quote mark. Every letter, every `-` and `_`, every capital letter, and the ending must be the same in both. If they differ, retype that part of your line to match the Explorer, and leave `"data/` in front of it as it is. If the Explorer shows `pilot-both-passes.csv.csv`, that part of your line becomes `pilot-both-passes.csv.csv`. Now run all of the Step 4 lines again, from the line that starts with `both_passes` through the `glimpse(both_passes)` line, as in [How to run lines in this guide](#how-to-run-lines-in-this-guide), and look at the bottom of the Terminal panel, the panel along the bottom of VS Code where the red message printed.

**It worked if** the newest lines there show `Rows:` and `Columns:`, and nothing red comes after them.

**The same red message again?** Then email your instructor a picture of the whole VS Code window, with the list on the left and the red message at the bottom both showing (a photo taken with your phone is fine).

**A different red message?** Find its first words among the bold headings in this section. If none matches, email your instructor the same kind of picture.

**``unexpected ',' in "  "data/pilot-both-passes.csv","``.** Only some of the Step 4 lines reached R. The first four of them, from the line that starts with `both_passes` to the line that holds only `)`, work only when they are highlighted and run together. In `reliability.R`, the file you type your lines into, delete those four lines and type the one line below in their place. If your sheet has a different name than `pilot-both-passes.csv` (your sheet's name is the one below `data` in the list of files and folders on the left side of VS Code), type your sheet's name in its place.

```r
both_passes <- read_csv("data/pilot-both-passes.csv", col_types = cols(.default = col_character()))
```

Highlight the new line from the `b` of `both_passes` to the last `)`, together with the `glimpse(both_passes)` line below it, and run them as in [How to run lines in this guide](#how-to-run-lines-in-this-guide). **It worked if** the newest lines at the bottom of the Terminal panel, the panel along the bottom of VS Code, show `Rows:` and `Columns:`, and nothing red comes after them. If a different red message prints, find its first words among the bold headings in this section. If the same one prints again, email your instructor a picture of the whole VS Code window, with the list on the left and the red message at the bottom both showing (a photo taken with your phone is fine).

**``Join columns in `y` must be present in the data``, with ``Problem with `id` ``.** One file has no column named `id`. Run `names(read_csv("data/pilot-pass-2.csv"))`: usually a title row sits above the headers, or the column is spelled differently, such as `ID`. For a title row, add `skip = 1,` on the line after the file name in `read_csv()`.

**Every `_p2` code is `NA` after the join.** The ids in the two files do not match. Run `head(pass_1$id)` and `head(pass_2$id)` and compare them: a spreadsheet may have changed long ids into numbers ending in `e+18`, or the files came from different draws. [Guide 15](15-draw-a-pilot-and-make-a-blind-recode-sheet.md) shows how to keep ids as text in Google Sheets.

**`object 'threat_p1' not found`.** The column has a different name in your table. Run `names(both_passes)` and use the names it prints.

**`Number of raters exeeds 2`** (the misspelling is irr's). The table reached `kappa2()` with more than two columns. Put the `select()` line with your two columns above it.

**`Kappa = NaN`.** Both passes used one code for every item, so kappa cannot be computed. Say so in your write-up instead of reporting a number.

**`could not find function "read_csv"`** (or `%>%`). The `library(tidyverse)` line has not run in this R session. Run it, then your line again.
