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
6. Save the sample as a CSV so you can code it: run **AURA: Write R code** and select **Save a table as a CSV file**.

## What you should see

`coding_sample` appears with up to `n_per_channel` messages from each channel. Running the same lines again returns the same messages.

## If it does not work

If R says `unused argument (by = channel)`, you have older code. The arguments are `chat`, `n_per_channel`, and `seed`, as in step 2.
