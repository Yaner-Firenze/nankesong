import { expect, test } from "@playwright/test";

test("admins can soft delete a pass record", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();

  await page.getByRole("link", { name: /新建直通卡/i }).click();
  await page.getByRole("link", { name: /^团队直通卡$/i }).click();

  await page.getByLabel(/团队名称/i).fill("Delete Flow Team");
  await page.getByLabel(/主联系人姓名/i).fill("Casey");
  await page.getByLabel(/联系方式/i).fill("casey@example.com");
  await page.getByLabel(/团队人数/i).fill("3");
  await page.getByLabel(/项目名称/i).fill("Delete Console");
  await page.getByLabel(/角色/i).fill("Founder");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("A flow created for the delete test");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\/[^/]+$/);
  const createdUrl = page.url();
  const passId = createdUrl.match(/\/admin\/pass\/([^/?#]+)/)?.[1];

  expect(passId).toBeTruthy();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /删除记录/i }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText(/delete console/i)).not.toBeVisible();

  await page.goto(`/pass/${passId}`);
  await expect(page.getByText(/404/i)).toBeVisible();
});
