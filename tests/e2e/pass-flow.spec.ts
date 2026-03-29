import { expect, test } from "@playwright/test";

test("public homepage only shows pass guidance instead of self-serve creation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /南客松 s2 直通卡/i })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /个人直通卡登记|团队直通卡登记/i })
  ).toHaveCount(0);
});

test("apply route is no longer available as a public creation entry", async ({
  page,
}) => {
  const response = await page.goto("/apply?type=team");
  expect(response?.status()).toBe(404);
});
