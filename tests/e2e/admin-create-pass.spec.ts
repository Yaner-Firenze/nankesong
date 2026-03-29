import { expect, test } from "@playwright/test";

test("admins can open the new pass page and create a team pass", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();
  await expect(
    page.getByRole("heading", { name: /直通卡管理后台/i })
  ).toBeVisible({ timeout: 15000 });

  await page.goto("/admin/new?type=team");
  await expect(page.getByRole("heading", { name: /新建直通卡/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByLabel(/团队名称/i)).toBeVisible({ timeout: 15000 });
  await page.getByLabel(/团队名称/i).fill("Admin Issued Team");
  await page.getByLabel(/主联系人姓名/i).fill("Mina");
  await page.getByLabel(/联系方式/i).fill("mina@example.com");
  await page.getByLabel(/团队人数/i).fill("2");
  await page.getByLabel(/项目编号/i).fill("PRJ-TEAM-001");
  await page.getByLabel(/项目名称/i).fill("Issued Console");
  await page.getByLabel(/角色/i).fill("Builder");
  await page.getByLabel(/成员 1 姓名/i).fill("Mina");
  await page
    .getByLabel(/成员 1 身份证号码/i)
    .fill("110101199001011234");
  await page.getByLabel(/成员 2 姓名/i).fill("Ada");
  await page
    .getByLabel(/成员 2 身份证号码/i)
    .fill("110101199001011235");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("Issued by the organizer");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\//, { timeout: 15000 });
});

test("admins see a friendly validation error instead of a crash on invalid identity number", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();
  await expect(
    page.getByRole("heading", { name: /直通卡管理后台/i })
  ).toBeVisible({ timeout: 15000 });

  await page.goto("/admin/new");
  await expect(page.getByRole("heading", { name: /新建直通卡/i })).toBeVisible({
    timeout: 15000,
  });

  await page.getByLabel(/姓名/i).fill("Ada");
  await page.getByLabel(/联系方式/i).fill("ada@example.com");
  await page.getByLabel(/身份证号码/i).fill("123");
  await page.getByLabel(/项目名称/i).fill("Invalid Identity");
  await page.getByLabel(/角色/i).fill("Builder");
  await page.getByLabel(/项目一句话介绍/i).fill("Invalid identity test");
  await page.locator("form").evaluate((form) => {
    (form as HTMLFormElement).noValidate = true;
  });
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/new(?:\?.*)?$/);
  await expect(
    page.getByText(/提交失败，请检查必填项、身份证号码格式，以及团队成员人数后再试。/)
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("heading", { name: /新建直通卡/i })).toBeVisible({
    timeout: 15000,
  });
});
