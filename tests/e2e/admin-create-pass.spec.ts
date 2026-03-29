import { expect, test } from "@playwright/test";

test("admins can open the new pass page and create a team pass", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();

  await page.getByRole("link", { name: /新建直通卡/i }).click();
  await expect(page).toHaveURL(/\/admin\/new$/);

  await page.getByRole("link", { name: /^团队直通卡$/i }).click();
  await expect(page).toHaveURL(/\/admin\/new\?type=team$/);
  await page.getByLabel(/团队名称/i).fill("Admin Issued Team");
  await page.getByLabel(/主联系人姓名/i).fill("Mina");
  await page.getByLabel(/联系方式/i).fill("mina@example.com");
  await page.getByLabel(/团队人数/i).fill("5");
  await page.getByLabel(/项目名称/i).fill("Issued Console");
  await page.getByLabel(/角色/i).fill("Builder");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("Issued by the organizer");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\//, { timeout: 15000 });
});
