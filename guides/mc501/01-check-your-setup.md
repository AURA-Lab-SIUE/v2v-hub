# Check Your Setup

Confirm that R, VS Code, and every package this course needs are ready, and install anything missing.

Prefer to watch first? The walkthrough video [Setup](https://siue.yuja.com/V/Video?v=17489654&a=114591092) shows these steps.

## Steps

1. Open VS Code.
2. Open the Command Palette: **View**, then **Command Palette...** (or **Ctrl+Shift+P**; **Cmd+Shift+P** on a Mac).
3. Type `AURA: Pick my course` and press **Enter**. Select **MC 501 Research Methods (graduate)**.
4. Open the Command Palette again, type `AURA: Check my setup`, and press **Enter**.
5. If the first line of the list reads **Install what is missing**, select it. The Output panel at the bottom shows R installing the packages.
6. When it finishes, the list opens again with **SETUP OK** at the top.

## What you should see

![](img/check-setup.png){fig-alt="The R Companion's Output panel after Check my setup. Two lines read: RESULT: everything this course needs is installed. SETUP OK: R and the course packages are working."}

The Output panel reads **RESULT: everything this course needs is installed** and **SETUP OK: R and the course packages are working.**

## If it does not work

If the list says R was not found, close VS Code completely, open it again, and run **AURA: Check my setup** once more. A new VS Code window picks up an R you installed after it opened.
