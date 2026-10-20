# Load the Course Data with Write R Code

Write the commented code that loads the tidyverse, the course package, and the Twitch data, then run it.

Prefer to watch first? The walkthrough video [Wrangling and the reliability grid](https://siue.yuja.com/V/Video?v=17490319&a=95173025) shows these steps.

## Steps

1. Open your R script or Quarto document and put the cursor on an empty line near the top.
2. Open the Command Palette: **View**, then **Command Palette...** (or **Ctrl+Shift+P**; **Cmd+Shift+P** on a Mac).
3. Type `AURA: Open an R terminal` and press **Enter**. Wait for the R prompt `>` at the bottom.
4. Open the Command Palette again, type `AURA: Write R code`, and press **Enter**.
5. Under **R2 Data**, select **Load the course Twitch corpus**.
6. A message at the bottom right asks **Run it now?**. Select **Run it** before it disappears.

## What you should see

![](img/write-r-code-load.png){fig-alt="VS Code editor showing a script named wrangle.R with a commented block the R Companion inserted: library(tidyverse), library(v2v), chat <- twitch_chat(), streams <- twitch_streams(), glimpse(chat), and glimpse(streams)."}

The terminal lists the columns of `chat` (35,267 rows) and `streams` (32,276 rows). Scroll up in the terminal if the counts have already passed.

## If it does not work

If the terminal says `could not find function "%>%"`, the code ran before R was ready. Select the lines in the editor and press **Ctrl+Enter** to run them again.
