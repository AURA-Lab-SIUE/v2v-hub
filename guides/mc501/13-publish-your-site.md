# Publish Your Site

Render your project and put it live on GitHub Pages, after three checks that catch the common failures.

## Steps

1. Commit and push every change first (guide 12).
2. Open an R terminal: run **AURA: Open an R terminal** from the Command Palette.
3. Type this line in the R terminal and press **Enter**:

    ```r
    v2v::deploy_portfolio()
    ```

    ![](img/deploy-portfolio-typed.png){fig-alt="The R terminal in VS Code with v2v::deploy_portfolio() typed after the prompt, ready to run."}

4. Read the **Pre-flight checks**. Each line starts with a check mark when it passes.
5. When it asks **Publish to GitHub Pages? [y/N]**, type `y` and press **Enter**. Any other answer stops without publishing.
6. When it finishes, it prints that the portfolio is live on GitHub Pages. Open that address in a browser.

To read what the command does before you run it, put your cursor on `deploy_portfolio` in a script and run **R: Open help for selection** from the Command Palette. The help page opens beside your script.

![](img/deploy-portfolio-help.png){fig-alt="The R Help page for deploy_portfolio in the v2v package, titled Deploy a student portfolio to GitHub Pages. The Description says it checks that the renv library is in sync, that there are no uncommitted changes, and that a _quarto.yml file exists, then renders and publishes the project. Usage reads deploy_portfolio(path = &quot;.&quot;, render = TRUE, ask = interactive())."}

## What you should see

```
── Pre-flight checks ──
✔ renv library in sync
✔ no uncommitted changes
✔ _quarto.yml valid
✔ Portfolio live on GitHub Pages.
```

## If it does not work

If a check fails, fix that one thing and run the command again. **no uncommitted changes** failing means you have work to commit and push (guide 12).
