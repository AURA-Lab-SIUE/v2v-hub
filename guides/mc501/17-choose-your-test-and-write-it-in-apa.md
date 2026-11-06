# Choose Your Test and Write It in APA

Match each research question to the test that answers it, adjust for counts and for numbers that come from your sources, check that a chi-square has enough items in every cell, and write each result as an APA sentence from a template. You type every line of R yourself and see what each one prints.

[Guide 10](10-tests-and-check-my-test-choice.md), *Test Your Own Hypotheses*, runs the four course tests step by step. This guide comes before and after it: before, to choose the test and set up the outcome; after, to write the sentence. It continues from [guide 16](16-describe-counts-and-source-measures.md), *Describe a Coded Category Against Counts and Source Measures*, so describe your data first.

## The example data

The same 120 Power Rangers episodes as [guide 16](16-describe-counts-and-source-measures.md): hand-coded `threat` (`monster`, `villain`, or `none`), the episode's IMDb vote count `total_votes`, its season (`season_title`, `season_num`), the season's `producer`, and the season's own IMDb rating from the season table.

- [episodes_analysis.RDS](../../resources/examples/own-study-walkthrough/episodes_analysis.RDS) and [power_rangers_seasons.csv](../../resources/examples/own-study-walkthrough/power_rangers_seasons.csv), both in your `data` folder, as in [guide 16](16-describe-counts-and-source-measures.md).
- [choose-test.R](../../resources/examples/own-study-walkthrough/choose-test.R): the finished script, to compare with yours at any step.

## Words used here

- **Outcome:** the variable you are explaining or comparing, such as votes.
- **Unit of analysis:** the thing each row stands for in a test: an item (an episode, a post) or a source (a season, an account).
- **Expected count:** how many items a chi-square expects in a cell if the two categories had nothing to do with each other.
- **APA sentence:** one sentence that reports a result the way APA style asks: the finding in words, then the statistic, its degrees of freedom, the p-value, and the effect size.

### How to run lines in this guide

Type the lines into your script exactly as shown. Select them: click just before the first letter of the first line, hold the mouse button (or press on the trackpad), and drag to the end of the last line. Then right-click the highlighted lines (on a Mac, Control-click or click with two fingers) and select **Run the selected lines in R**. (Keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac.) What R prints appears in the **Terminal** panel along the bottom of VS Code.

## Step 1: Match each question to a test

Write each research question as a comparison first: *what* is compared, *across what*. Then find it in this list:

- **Two categories**, such as your coded category and a category of the source: a chi-square test, with Cramér's *V* as the effect size. [Guide 10, Step 3](10-tests-and-check-my-test-choice.md#step-3-test-1-the-chi-square-test-two-categories) runs it.
- **A number across exactly two groups:** a Welch t-test, with Cohen's *d*. [Guide 10, Step 4](10-tests-and-check-my-test-choice.md#step-4-test-2-the-welch-t-test-a-number-across-two-groups) runs it.
- **A number across three or more groups:** a one-way ANOVA, with eta squared (*η*²). [Guide 10, Step 5](10-tests-and-check-my-test-choice.md#step-5-test-3-the-one-way-anova-a-number-across-three-or-more-groups) runs it.
- **A number predicted from another number:** a linear regression, with *R*². [Guide 10, Step 6](10-tests-and-check-my-test-choice.md#step-6-test-4-the-linear-regression-a-number-predicted-from-a-number) runs it.

The example's question is: *Do episodes with different threats draw different numbers of IMDb votes?* Votes are a number, and threat has three groups, so the test is a one-way ANOVA.

Then check your choice with the R Companion: click **View** in the menu bar, then **Command Palette...**, type `AURA: Check my test choice`, and click it in the list. [Guide 10, Step 1](10-tests-and-check-my-test-choice.md#step-1-check-that-each-test-fits-your-variables) walks through its three questions.

## Step 2: Set up your outcome, with a log for counts

1. In the Explorer, right-click (on a Mac, Control-click or click with two fingers) the empty space below the file list and select **New File...**. Type `choose-test.R` and press **Enter**.
2. Open an R terminal if one is not open: **View**, then **Command Palette...**, type `AURA: Open an R terminal`, and click it in the list.

```r
library(tidyverse)
library(janitor)
library(v2v)
library(effectsize)
options(scipen = 10)
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


> library(v2v)
v2v 0.3.9 loaded.
  setup()  checks that R, Quarto and Git are ready
  ?v2v     lists what this package gives you

Attaching package: 'v2v'

The following object is masked from 'package:janitor':

    crosstab


> library(effectsize)

> options(scipen = 10)
Warning message:
package 'effectsize' was built under R version 4.5.3 
```

**Check:** the `v2v` line says 0.3.9 or newer. The `masked` lines and a note that a package `was built under R version` are notes, not errors.

A count like votes is skewed ([guide 16, Step 3](16-describe-counts-and-source-measures.md#step-3-is-your-count-skewed-compare-the-mean-and-the-median)): a few items with very large counts would decide a test on their own. `log10()` turns each count into its power of 10, so 10 becomes 1, 100 becomes 2, and 1,000 becomes 3, and the test then compares how many times larger one group's counts are. `+ 1` keeps an item with a count of 0 in the test, since the log of 0 does not exist.

The settings block below reads the analysis file, joins the season's rating as in [guide 16, Step 6](16-describe-counts-and-source-measures.md#step-6-find-out-how-much-the-number-belongs-to-the-source), and keeps the columns the tests use. `transmute()` keeps only the columns it names ([transmute() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#transmute-keep-only-the-columns-you-build)):

```r
seasons <- read_csv("data/power_rangers_seasons.csv", show_col_types = FALSE) %>%
  clean_names() %>%
  select(season_title, season_rating = imdb_rating)

analysis <- read_rds("data/episodes_analysis.RDS") %>%
  left_join(seasons, by = join_by(season_title)) %>%
  transmute(
    threat,
    producer,
    season_title,
    season_num,
    season_rating,
    votes = total_votes,
    votes_log = log10(total_votes + 1)
  )

glimpse(analysis)
```

```
> seasons <- read_csv("data/power_rangers_seasons.csv", show_col_types = FALSE) %>%
+   clean_names() %>%
+   select(season_title, season_rating = imdb_rating)

> analysis <- read_rds("data/episodes_analysis.RDS") %>%
+   left_join(seasons, by = join_by(season_title)) %>%
+   transmute(
+     threat,
+     producer,
+     season_title,
+     season_num,
+     season_rating,
+     votes = total_votes,
+     votes_log = log10(total_votes + 1)
+   )

> glimpse(analysis)
Rows: 120
Columns: 7
$ threat        <fct> villain, villain, villain, villain, villain, villain, vi…
$ producer      <fct> Disney, Saban, Disney, Saban, Saban/Disney, Disney, Saba…
$ season_title  <chr> "Operation Overdrive", "Time Force", "Jungle Fury", "Tim…
$ season_num    <dbl> 15, 9, 16, 9, 10, 16, 7, 18, 9, 8, 16, 4, 26, 4, 8, 2, 2…
$ season_rating <dbl> 5.5, 7.1, 6.6, 7.1, 6.3, 6.6, 6.9, 5.1, 7.1, 6.5, 6.6, 6…
$ votes         <dbl> 26, 55, 35, 54, 40, 34, 210, 38, 59, 64, 35, 289, 29, 28…
$ votes_log     <dbl> 1.431364, 1.748188, 1.556303, 1.740363, 1.612784, 1.5440…
```

**Check:** 120 rows and seven columns, with `votes_log` between about 1.3 and 2.8. `show_col_types = FALSE` only stops `read_csv()` printing the column types.

## Step 3: Run the test on the items

The ANOVA from [guide 10, Step 5](10-tests-and-check-my-test-choice.md#step-5-test-3-the-one-way-anova-a-number-across-three-or-more-groups), on `votes_log`. First each group's n, mean, and standard deviation, which the APA sentence needs:

```r
analysis %>%
  group_by(threat) %>%
  summarize(
    n = n(),
    mean = mean(votes_log),
    sd = sd(votes_log)
  )
```

```
> analysis %>%
+   group_by(threat) %>%
+   summarize(
+     n = n(),
+     mean = mean(votes_log),
+     sd = sd(votes_log)
+   )
# A tibble: 3 × 4
  threat      n  mean    sd
  <fct>   <int> <dbl> <dbl>
1 monster    37  2.08 0.466
2 villain    56  1.93 0.419
3 none       27  1.79 0.384
```

```r
fit_items <- aov(votes_log ~ threat, data = analysis)
summary(fit_items)
eta_squared(fit_items)
```

```
> fit_items <- aov(votes_log ~ threat, data = analysis)

> summary(fit_items)
             Df Sum Sq Mean Sq F value Pr(>F)  
threat        2  1.306  0.6529   3.586 0.0308 *
Residuals   117 21.300  0.1821                 
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

> eta_squared(fit_items)
For one-way between subjects designs, partial eta squared is equivalent
  to eta squared. Returning eta squared.
# Effect Size for ANOVA

Parameter | Eta2 |       95% CI
-------------------------------
threat    | 0.06 | [0.00, 1.00]

- One-sided CIs: upper bound fixed at [1.00].
```

**Check:** `F value` 3.586 on 2 and 117 `Df`, `Pr(>F)` 0.0308, below .05. Eta squared is 0.06: threat accounts for 6 percent of the variation in log votes. Read alone, monster episodes draw more votes.

## Step 4: Check whether the source explains it

[Guide 16, Step 6](16-describe-counts-and-source-measures.md#step-6-find-out-how-much-the-number-belongs-to-the-source) found that votes belong mostly to the season: seasons 1 to 7 have far more votes than later seasons. If monsters are more common in the early seasons, the test above may be measuring the seasons, not the threats. Run the same test inside each group of sources. `filter()` keeps only the rows that match ([filter() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#filter-keep-the-rows-that-pass-a-test)):

```r
early <- analysis %>%
  filter(season_num <= 7)

later <- analysis %>%
  filter(season_num >= 8)

summary(aov(votes_log ~ threat, data = early))
summary(aov(votes_log ~ threat, data = later))
```

```
> early <- analysis %>%
+   filter(season_num <= 7)

> later <- analysis %>%
+   filter(season_num >= 8)

> summary(aov(votes_log ~ threat, data = early))
            Df Sum Sq Mean Sq F value Pr(>F)
threat       2 0.0703 0.03515   1.555  0.224
Residuals   40 0.9040 0.02260               

> summary(aov(votes_log ~ threat, data = later))
            Df Sum Sq Mean Sq F value Pr(>F)
threat       2 0.0343 0.01713   0.703  0.498
Residuals   74 1.8031 0.02437               
```

**Check:** inside the early seasons, `Pr(>F)` is 0.224; inside the later seasons, 0.498. Neither is below .05. The difference in Step 3 came from which seasons the episodes were in, not from the threats. That is a finding to report, and it changes what the example can claim.

On your own data, group your sources the way your description showed they split: big and small accounts, early and late periods, major and independent labels. Say in your Methods how you grouped them and why, before you look at the test results.

## Step 5: If your question is about sources, test one row per source

Some questions are about sources, not items: *Are seasons that mostly feature monsters rated lower than seasons that mostly feature villains?* The season rating is one number per season, so a test with one row per episode would count a season with 8 episodes 8 times. Build a table with one row per source and its most common code.

`count()` counts each source's codes ([count() on the dplyr cheat sheet](../../resources/cheat-sheets/dplyr.html#count-how-many-rows-in-each-group)). `group_by()` makes each source its own group, `slice_max(n, n = 1)` keeps the row with the largest count in each group, and `ungroup()` ends the grouping. `with_ties = FALSE` keeps one code when two are tied; it keeps the first in your factor order, so say in your Methods how ties were settled:

```r
by_season <- analysis %>%
  count(season_title, threat) %>%
  group_by(season_title) %>%
  slice_max(n, n = 1, with_ties = FALSE) %>%
  ungroup() %>%
  left_join(seasons, by = join_by(season_title))

by_season %>%
  count(threat)
```

```
> by_season <- analysis %>%
+   count(season_title, threat) %>%
+   group_by(season_title) %>%
+   slice_max(n, n = 1, with_ties = FALSE) %>%
+   ungroup() %>%
+   left_join(seasons, by = join_by(season_title))

> by_season %>%
+   count(threat)
# A tibble: 3 × 2
  threat      n
  <fct>   <int>
1 monster     7
2 villain    13
3 none        5
```

**Check:** 7 + 13 + 5 = 25, one row per season. Now the test runs on 25 rows:

```r
fit_seasons <- aov(season_rating ~ threat, data = by_season)
summary(fit_seasons)
eta_squared(fit_seasons)
```

```
> fit_seasons <- aov(season_rating ~ threat, data = by_season)

> summary(fit_seasons)
            Df Sum Sq Mean Sq F value Pr(>F)
threat       2  0.610  0.3051   1.106  0.349
Residuals   22  6.068  0.2758               

> eta_squared(fit_seasons)
For one-way between subjects designs, partial eta squared is equivalent
  to eta squared. Returning eta squared.
# Effect Size for ANOVA

Parameter | Eta2 |       95% CI
-------------------------------
threat    | 0.09 | [0.00, 1.00]

- One-sided CIs: upper bound fixed at [1.00].
```

**Check:** 2 and 22 `Df`: 25 seasons, not 120 episodes. `Pr(>F)` is 0.349, so season ratings do not differ by a season's most common threat. With 5 to 13 seasons per group, only a large difference could show up; say so in your Discussion.

## Step 6: Before a chi-square, check the expected counts

A chi-square needs at least 5 expected items in every cell. Check before you report it. The example crosses threat with all four producers ([chisq.test() on the stats cheat sheet](../../resources/cheat-sheets/stats.html#chisq.test-is-the-pairing-more-than-chance)):

```r
counts <- xtabs(~ threat + producer, data = analysis)
counts

chi <- chisq.test(counts)
chi$expected
```

```
> counts <- xtabs(~ threat + producer, data = analysis)

> counts
         producer
threat    Saban Saban/Disney Disney Saban Brands
  monster    20            3      7            7
  villain    23            2     23            8
  none       11            0      1           15

> chi <- chisq.test(counts)

> chi$expected
         producer
threat    Saban Saban/Disney    Disney Saban Brands
  monster 16.65     1.541667  9.558333         9.25
  villain 25.20     2.333333 14.466667        14.00
  none    12.15     1.125000  6.975000         6.75
Warning message:
In stats::chisq.test(x, y, ...) :
  Chi-squared approximation may be incorrect
```

**Check:** R warns `Chi-squared approximation may be incorrect`, and the `Saban/Disney` column of the expected counts is 1.54, 2.33, and 1.13, all below 5. A producer with 5 episodes is too small for this test. Leave it out or combine it with a similar group in your settings block, as [guide 10, Step 2](10-tests-and-check-my-test-choice.md#step-2-name-your-variables-once-in-a-settings-block) does with `levels`, then run the test and check the expected counts again. Say which you did.

## Step 7: Write each result as an APA sentence

Each template below shows the form; the brackets say which number from R's output goes there. Write the finding in words first, then the numbers. In the templates, the letters in *italics* are written in italics in your document.

**Rules for every sentence (APA 7):**

- Round statistics and p-values to two or three decimal places, the same way throughout.
- Drop the zero before the decimal point for a number that can never be larger than 1: *p* = .031, *V* = .34, *η*² = .06. Keep it when the number can be: *t*(44.12) = 0.97, *d* = 0.25.
- When R prints a p-value below .001 (such as `0.0001134` or `<2e-16`), write *p* < .001.
- A result above .05 is still a finding. Report it with its numbers in the same form.

### Chi-square

> [The two categories went together, or did not], *χ*²([df], *N* = [sum of the counts table]) = [X-squared], *p* = [p-value], *V* = [Cramér's V].

From [guide 10, Step 3](10-tests-and-check-my-test-choice.md#step-3-test-1-the-chi-square-test-two-categories) (115 episodes after leaving out `Saban/Disney`): "The threat in an episode differed by producer, *χ*²(4, *N* = 115) = 24.30, *p* < .001, *V* = .33."

### Welch t-test

> [Group A] (*M* = [mean], *SD* = [sd]) and [group B] (*M* = [mean], *SD* = [sd]) [differed, or did not differ] in [outcome], *t*([df, two decimals]) = [t], *p* = [p-value], *d* = [Cohen's d].

Welch's `df` is usually a decimal, such as 101.5; report it to two decimal places.

### One-way ANOVA

> [Outcome] [differed, or did not differ] by [category], *F*([group Df], [Residuals Df]) = [F value], *p* = [Pr(>F)], *η*² = [Eta2].

From Step 3: "Log-transformed IMDb votes differed by the threat in the episode, *F*(2, 117) = 3.59, *p* = .031, *η*² = .06."

From Step 4, the sentence that has to follow it: "Within the early seasons, *F*(2, 40) = 1.56, *p* = .224, and within the later seasons, *F*(2, 74) = 0.70, *p* = .498, the difference did not hold, so it reflects the seasons the episodes came from."

### Linear regression

> [Outcome] [rose, fell, or did not change] with [predictor], *b* = [Estimate], *SE* = [Std. Error], *t*([residual df]) = [t value], *p* = [Pr(>|t|)], *R*² = [Multiple R-squared].

### Check your numbers

[Guide 10, Step 7](10-tests-and-check-my-test-choice.md#step-7-write-each-sentence-then-check-its-numbers) shows how the R Companion prints the same numbers in APA form, so you can compare your sentence with it one number at a time.

## What goes in your write-up

- In Methods: which test answers each question, that counts were log-transformed (and the `+ 1`), the unit of analysis for each test (items or sources), how you grouped sources in Step 4, and any group you left out or combined for a chi-square.
- In Results: one APA sentence per test, in the order of your questions, including the results above .05.
- In Discussion: anything the source check changed, and any test that rests on a small number of sources.

## If it does not work

If running a line opens a box titled **Choose where to run the selected code**, press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Instead, click the **AURA Lab R Companion** icon on VS Code's left edge and select **Run my steps from the top**.

**`NaNs produced` or `-Inf` in `votes_log`.** A count is below 0 or the `+ 1` is missing. Counts cannot be negative, so check the column for typing errors in your coding sheet.

**`object 'season_rating' not found`.** The `seasons` block has not run, or your source table names the column differently. Run `names(seasons)` and use the name it prints.

**`grouping factor must have exactly 2 levels`** (Welch t-test). Your two-group column has more or fewer than two groups. [Guide 10, Step 2](10-tests-and-check-my-test-choice.md#step-2-name-your-variables-once-in-a-settings-block) shows how to keep two with `levels`.

**A filtered table has 0 rows.** The number in `filter()` does not match your data. Run `analysis %>% count(season_num)` (with your own source column) and pick the cut from what it prints.
