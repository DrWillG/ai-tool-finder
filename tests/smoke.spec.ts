import { test, expect } from "@playwright/test";

const SITE = "https://drwillg.github.io/ai-tool-finder/";

test.describe("AI Tool Finder — live site smoke tests", () => {
  test("homepage loads and shows hero", async ({ page }) => {
    await page.goto(SITE);
    await expect(page).toHaveTitle(/AI Tool Finder/);
    await expect(page.getByText("Find your AI tools")).toBeVisible();
  });

  test("tool count on hero is 40 or more", async ({ page }) => {
    await page.goto(SITE);
    // The hero stats show toolCount dynamically from TOOLS object
    const statsText = await page.locator("text=Tools reviewed").locator("..").innerText();
    const count = parseInt(statsText.match(/\d+/)?.[0] ?? "0");
    expect(count).toBeGreaterThanOrEqual(40);
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
    await expect(page.getByText(/grade|K.2|elementary/i)).toBeVisible({ timeout: 5000 });
  });

  test("new 2026 tools are present in the app bundle", async ({ page }) => {
    await page.goto(SITE);
    const content = await page.content();
    const newTools = ["Newsela", "ReadTheory", "Duolingo", "Quizlet"];
    for (const tool of newTools) {
      expect(content).toContain(tool);
    }
  });

  test("quiz completes and shows results", async ({ page }) => {
    await page.goto(SITE);
    await page.getByRole("button", { name: "Start the finder" }).click();

    // Step 1: Grade
    await page.getByText(/6.8|6–8|Middle/i).first().click();
    await page.getByRole("button", { name: /next|continue/i }).first().click();

    // Step 2: Subject
    await page.getByText(/math/i).first().click();
    await page.getByRole("button", { name: /next|continue/i }).first().click();

    // Step 3: Ecosystem
    await page.getByText(/google/i).first().click();
    await page.getByRole("button", { name: /next|continue/i }).first().click();

    // Step 4: Need
    await page.getByText(/save time|save_time/i).first().click();
    await page.getByRole("button", { name: /next|continue/i }).first().click();

    // Step 5: Budget
    await page.getByText(/free/i).first().click();
    await page.getByRole("button", { name: /see|find|results/i }).first().click();

    // Results should appear
    await expect(page.locator("[class*='result'], [class*='tool'], h2, h3").first()).toBeVisible({ timeout: 8000 });
  });
});
