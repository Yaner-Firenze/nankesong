import { expect, test } from "@playwright/test";

test("admins can log in, view passes, and save an internal note", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /team direct pass/i }).click();

  await page.getByLabel(/team name/i).fill("Admin Flow Team");
  await page.getByLabel(/contact name/i).fill("Casey");
  await page.getByLabel(/contact info/i).fill("casey@example.com");
  await page.getByLabel(/team size/i).fill("3");
  await page.getByLabel(/project name/i).fill("Admin Console");
  await page.getByLabel(/role/i).fill("Founder");
  await page
    .getByLabel(/project summary/i)
    .fill("A flow created for the admin test");
  await page.getByRole("button", { name: /generate direct pass/i }).click();

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel(/password/i).fill("test-admin");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(
    page.getByRole("heading", { name: /admin direct passes/i })
  ).toBeVisible();

  await page.getByLabel(/search passes/i).fill("Admin Console");
  await page.getByRole("link", { name: /admin console/i }).click();

  await page.getByLabel(/internal note/i).fill("Checked by admin");
  await page.getByRole("button", { name: /save note/i }).click();

  await expect(page.getByLabel(/internal note/i)).toHaveValue(
    "Checked by admin"
  );
});
