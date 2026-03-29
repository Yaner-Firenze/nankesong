import { expect, test } from "@playwright/test";

test("admins can log in, view passes, and save an internal note", async ({
  page,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();

  await expect(
    page.getByRole("heading", { name: /直通卡管理后台/i })
  ).toBeVisible();

  await page.getByRole("link", { name: /新建直通卡/i }).click();
  await page.getByRole("link", { name: /^团队直通卡$/i }).click();

  await page.getByLabel(/团队名称/i).fill("Admin Flow Team");
  await page.getByLabel(/主联系人姓名/i).fill("Casey");
  await page.getByLabel(/联系方式/i).fill("casey@example.com");
  await page.getByLabel(/团队人数/i).fill("3");
  await page.getByLabel(/项目名称/i).fill("Admin Console");
  await page.getByLabel(/角色/i).fill("Founder");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("A flow created for the admin test");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await page.getByLabel(/内部备注/i).fill("管理员已核对");
  await page.getByRole("button", { name: /保存备注/i }).click();

  await expect(page.getByLabel(/内部备注/i)).toHaveValue(
    "管理员已核对"
  );
});
