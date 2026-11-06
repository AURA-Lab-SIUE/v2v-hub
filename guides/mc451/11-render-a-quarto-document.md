# Render a Quarto Document

Turn your `.qmd` file into a finished page in which every number and chart comes from your code.

Prefer to watch first? The walkthrough video [Render a Quarto Document](https://siue.yuja.com/V/Video?v=17649358&a=85867670) shows these steps.

## Steps

1. Open your `.qmd` file in the editor.
2. Save it: in the menu bar at the top, select **File**, then **Save**.
3. Open the Command Palette: **View**, then **Command Palette...** (or **Ctrl+Shift+P**; **Cmd+Shift+P** on a Mac).
4. Type `Quarto: Preview` and press **Enter** (**Return** on a Mac). (Keyboard: **Ctrl+Shift+K**, or **Cmd+Shift+K** on a Mac.)

    ![](img/quarto-preview-palette.png){fig-alt="The Command Palette with Quarto: Preview typed. The first line, Quarto: Preview, is highlighted and shows its shortcut Ctrl+Shift+K."}

5. Wait for the Terminal panel to finish. The rendered page opens in a panel beside your file.

    ![](img/quarto-preview.png){fig-alt="VS Code with pilot-summary.qmd open on the left and a Quarto Preview panel on the right showing the rendered page: the title Pilot summary, the code, a table counting messages by tone, and a bar chart. The Terminal panel below shows the render finishing."}

6. After each change, save the file again, then run **Quarto: Preview** again from the Command Palette, as in steps 3 and 4. Saving alone does not refresh the preview.
7. To build the final file, first close the **Quarto Preview** tab. Then run **Quarto: Render Document** from the Command Palette. If a list of formats opens, select **Render HTML**.

    ![](img/quarto-render-palette.png){fig-alt="The Command Palette with Quarto: Render Document typed and highlighted as the first line."}

## What you should see

![](img/quarto-output-created.png){fig-alt="The Terminal panel after a preview. It reads Output created: pilot-summary.html, then Watching files for changes and the local address the preview uses."}

The Terminal panel ends with `Output created:` followed by the file name, and the rendered page shows your text, tables, and charts.

## If it does not work

If the render stops at a chunk, the Terminal names the chunk and the line. Run that chunk on its own to see the R error, then use guide 03.

If you press **Run Cell** (the ▷ at the top right of a code cell) and your code lands in a terminal named **powershell** (**zsh** on a Mac) instead of **R (AURA)**, it did not run in R. Select **R (AURA)** in the list of terminals at the right of the Terminal panel, then press **Run Cell** again. (Keyboard: click inside the cell and press **Ctrl+Shift+Enter**, or **Cmd+Shift+Enter** on a Mac; it switches to **R (AURA)** before it runs the cell.)
