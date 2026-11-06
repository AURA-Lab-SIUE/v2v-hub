# Draw Your Coding Sample

Draw a stratified random sample of messages that you, or anyone else, can draw again exactly.

## Steps

1. Load the course data first ([guide 04](04-load-the-course-data.md)).
2. Add this code below it:

    ```r
    set.seed(409)

    coding_sample <- chat %>%
      group_by(channel) %>%
      slice_sample(n = 30) %>%
      ungroup()
    ```

3. Change the `n` in `slice_sample()` so the total fits your time budget: seconds per message times number of messages.
4. Choose your own seed number for `set.seed()` and write it in your sampling plan.
5. Select the lines, then right-click it (on a Mac, Control-click or click with two fingers) and select **Run the selected lines in R** to run them. (Keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac.)
6. Save the sample as a CSV so you can code it: run **AURA: Write R code** and select **Save a table as a CSV file**. A box asks for the file name: type `data/coding-sample.csv` and press **Enter**.
7. In the block it wrote, change `gaming` to `coding_sample` in the `write_csv(` line. Then select the block's lines, right-click them (on a Mac, Control-click or click with two fingers), and select **Run the selected lines in R** (keyboard: **Ctrl+Enter**, or **Cmd+Enter** on a Mac).

## What you should see

`coding_sample` appears with up to `n` messages from each channel. Running the same lines again, seed line included, returns the same messages.

The save step prints the number of rows saved, the same as `nrow(coding_sample)`, and `coding-sample.csv` appears in the `data` folder in the Explorer.

## If it does not work

If running a line opens a box titled **Choose where to run the selected code**, press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Instead, click the **AURA Lab R Companion** icon on VS Code's left edge and select **Run my steps from the top**. It runs your file from the first line, in the same R as **Run it**.

If your draw changes from run to run, the `set.seed()` line did not run before it: select both blocks together and run them again. (Older code with `v2v::sample_messages(chat, n_per_channel = 30, seed = 409)` still works and draws the same rows.)

If R says `cannot open file 'data/...': No such file or directory`, your workspace has no `data` folder yet. Click in the R terminal, type `dir.create("data")`, press **Enter**, and run the block again.
