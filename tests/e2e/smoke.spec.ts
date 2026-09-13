import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home page renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("contact page renders the form", async ({ page }) => {
    await page.goto("/contact");
    // Par rôle : la page porte aussi un bouton « Copier : Email » et un lien
    // « Email » (coordonnées, pied de page), qu'un simple getByLabel confondrait.
    await expect(page.getByRole("textbox", { name: /^nom$/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /^email$/i })).toBeVisible();
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
