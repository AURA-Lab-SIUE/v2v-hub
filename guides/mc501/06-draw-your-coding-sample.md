# Draw Your Coding Sample

Draw a stratified random sample of messages that you, or anyone else, can draw again exactly.

## Steps

1. Load the course data first (guide 04).
2. Add this code below it:

    ```r
    coding_sample <- v2v::sample_messages(
      chat,
      n_per_channel = 30,
      seed = 409
    )
    ```

3. Change `n_per_channel` so the total fits your time budget: seconds per message times number of messages.
4. Choose your own `seed` number and write it in your sampling plan.
5. Select the lines and press **Ctrl+Enter** to run them.
6. Save the sample as a CSV so you can code it: run **AURA: Write R code** and select **Save a table as a CSV file**. A box asks for the file name: type `data/coding-sample.csv` and press **Enter**.
7. In the block it wrote, change `gaming` to `coding_sample` in the `write_csv(` line. Then select the block's lines and press **Ctrl+Enter** (**Cmd+Enter** on a Mac) to run them.

## What you should see

`coding_sample` appears with up to `n_per_channel` messages from each channel. Running the same lines again returns the same messages.

The save step prints the number of rows saved, the same as `nrow(coding_sample)`, and `coding-sample.csv` appears in the `data` folder in the Explorer.

## If it does not work

If pressing **Ctrl+Enter** (**Cmd+Enter** on a Mac) opens a box titled **Choose where to run the selected code**, press **Esc**. Do not pick **New R Interactive window** or **Create R terminal**: both start a new R that has none of your tables. Instead, click the **AURA R Companion** icon on VS Code's left edge and select **Run my steps from the top**. It runs your file from the first line, in the same R as **Run it**.

If R says `unused argument (by = channel)`, you have older code. The arguments are `chat`, `n_per_channel`, and `seed`, as in step 2.

If R says `cannot open file 'data/...': No such file or directory`, your workspace has no `data` folder yet. Click in the R terminal, type `dir.create("data")`, press **Enter**, and run the block again.
