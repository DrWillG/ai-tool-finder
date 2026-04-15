import { test, expect } from "@playwright/test";

const SITE = "https://drwillg.github.io/ai-tool-finder/";

test.describe("AI Tool Finder — live site smoke tests", () => {
  test("homepage loads and shows hero", async ({ page }) => {
    await page.goto(SITE);
    await expect(page).toHaveTitle(/AI Tool Finder/);
    await expect(page.getByText("Find your AI tools")).toBeVisible();
  });

  test("tool count on hero is 35 or more", async ({ page }) => {
    await page.goto(SITE);
    // The hero stats show toolCount dynamically from TOOLS object
    const statsText = await page.locator("text=Tools reviewed").locator("..").innerText();
    const count = parseInt(statsText.match(/\d+/)?.[0] ?? "0");
    expect(count).toBeGreaterThanOrEqual(35);
  });

  test("updated date on hero is not March 2026 (hardcoded old date)", async ({ page }) => {
    await page.goto(SITE);
    const statsText = await page.locator("text=Updated").locator("..").innerText();
    expect(statsText).not.toContain("Mar 22");
  });

  test("Start the finder button works", async ({ page }) => {
    await page.goto(SITE);
    await page.getByRole("button", { name: "Start the finder" }).click();
    // Should advance to quiz — first question about grade level
    await expect(page.getByText("Grade level?")).toBeVisible({ timeout: 5000 });
  });

  test("new 2026 tools are present in the app bundle", async ({ page }) => {
    // Tool data lives in JS chunks, not the initial HTML.
    // Collect text-fetch Promises synchronously in the event handler,
    // then await them all after networkidle to avoid a race condition.
    const jsTextPromises: Promise<string>[] = [];
    page.on("response", (response) => {
      if (response.url().includes(".js") && response.status() === 200) {
        jsTextPromises.push(response.text().catch(() => ""));
      }
    });
    await page.goto(SITE);
    await page.waitForLoadState("networkidle");
    const jsContent = (await Promise.all(jsTextPromises)).join(" ");
    const newTools = ["Newsela", "ReadTheory", "Duolingo", "Quizlet"];
    for (const tool of newTools) {
      expect(jsContent).toContain(tool);
    }
  });

  test("quiz completes and shows results", async ({ page }) => {
    await page.goto(SITE);
    await page.getByRole("button", { name: "Start the finder" }).click();

    // Step 1: Grade — quiz auto-advances after each selection (no Next button)
    await page.getByText(/6.8|6–8|Middle/i).first().click();

    // Step 2: Subject
    await expect(page.getByText("Step 2")).toBeVisible({ timeout: 5000 });
    await page.getByText(/math/i).first().click();

    // Step 3: Ecosystem
    await expect(page.getByText("Step 3")).toBeVisible({ timeout: 5000 });
    await page.getByText(/google/i).first().click();

    // Step 4: Need
    await expect(page.getByText("Step 4")).toBeVisible({ timeout: 5000 });
    await page.getByText(/save time/i).first().click();

    // Step 5: Budget
    await expect(page.getByText("Step 5")).toBeVisible({ timeout: 5000 });
    await page.getByText(/free only/i).first().click();

    // Results should appear after the loading phase (~1.6s)
    await expect(page.locator("[class*='result'], [class*='tool'], h2, h3").first()).toBeVisible({ timeout: 10000 });
  });
});
