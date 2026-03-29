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

test("issued passes remain publicly viewable and the old created route redirects", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();

  await page.getByRole("link", { name: /新建直通卡/i }).click();
  await page.getByLabel(/姓名/i).fill("Ada");
  await page.getByLabel(/联系方式/i).fill("ada@example.com");
  await page.getByLabel(/项目名称/i).fill("Public Pass");
  await page.getByLabel(/角色/i).fill("Builder");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("Issued by the organizer");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\//, { timeout: 15000 });
  const currentUrl = page.url();
  const match = currentUrl.match(/\/admin\/pass\/([^/?#]+)/);
  expect(match?.[1]).toBeTruthy();
  const id = match![1];

  await page.goto(`/pass/${id}`);
  await expect(
    page.getByText(/由南客松主办方发放的直通卡/i)
  ).toBeVisible();

  await page.goto(`/pass/${id}/created`);
  await expect(page).toHaveURL(new RegExp(`/pass/${id}$`));
  await expect(page.getByRole("heading", { name: /直通卡信息/i })).toBeVisible();
});
