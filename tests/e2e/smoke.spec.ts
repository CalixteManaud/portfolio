import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("contact page renders the form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("about page renders timeline header", async ({ page }) => {
    await page.goto("/parcours");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("projects index lists at least one project", async ({ page }) => {
    await page.goto("/projets");
    await expect(page.locator("article, li").first()).toBeVisible();
  });
});
