import { expect, test } from "@playwright/test";

test("users can choose a pass type and start the application flow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /nankesong s2 direct pass/i })
  ).toBeVisible();

  await page.getByRole("link", { name: /team direct pass/i }).click();

  await expect(page).toHaveURL(/\/apply\?type=team$/);

  await page.getByLabel(/team name/i).fill("Flux Crew");
  await page.getByLabel(/contact name/i).fill("Lin");
  await page.getByLabel(/contact info/i).fill("lin@example.com");
  await page.getByLabel(/team size/i).fill("4");
  await page.getByLabel(/project name/i).fill("Team Console");
  await page.getByLabel(/role/i).fill("Founder");
  await page
    .getByLabel(/project summary/i)
    .fill("A shared ops dashboard for the team");

  await page.getByRole("button", { name: /generate direct pass/i }).click();

  await expect(
    page.getByRole("heading", { name: /your direct pass is ready/i })
  ).toBeVisible();
});
