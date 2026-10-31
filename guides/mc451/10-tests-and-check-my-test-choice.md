# Run a Test and Check Your Test Choice

Check that the test you chose fits your variables, run it with its effect size, and check the numbers in your sentence.

Prefer to watch first? The walkthrough video [Tests](https://siue.yuja.com/V/Video?v=17490908&a=168993969) shows these steps.

## Steps

1. Run **AURA: Write R code** and, under **R4 Test**, select **Settings block (name the test variables)**, then **Run it**. Change only this block to use your own columns.
2. Write down the test you chose.
3. Open the Command Palette: **View**, then **Command Palette...** (or **Ctrl+Shift+P**; **Cmd+Shift+P** on a Mac). Type `AURA: Check my test choice` and press **Enter**.
4. Answer the questions about your outcome and your groups, then pick the test you wrote down.
5. Read the message at the bottom right. **Fits** means the choice matches your variables. **Does not fit** names what is wrong.
6. Run **AURA: Write R code** and select your test, for example **Welch t-test with Cohen's d**, then **Run it**.
7. Write your results sentence yourself. Then select **APA numbers to check your sentence**, pick the same test, and select **Run it**.
8. Compare each number in your sentence with the printed line.

## What you should see

![](img/test-choice-fits.png){fig-alt="The bottom right of VS Code after Check my test choice. A message begins: Fits. A Welch t-test compares the mean of a number between two groups."}

The test prints the plain R result first, then the effect size, then the `v2v` check with the same numbers.

## If it does not work

If R says `grouping factor must have exactly 2 levels`, the `group2` column in your settings block does not have exactly two groups. Run `analysis %>% count(group2)` to see them, then fix the settings block and run it again.
