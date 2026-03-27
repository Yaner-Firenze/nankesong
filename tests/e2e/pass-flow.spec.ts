import { expect, test } from "@playwright/test";

test("users can choose a pass type and start the application flow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /南客松 s2 直通卡登记/i })
  ).toBeVisible();

  await page.getByRole("link", { name: /团队直通卡登记/i }).click();

  await expect(page).toHaveURL(/\/apply\?type=team$/);

  await page.getByLabel(/团队名称/i).fill("Flux Crew");
  await page.getByLabel(/主联系人姓名/i).fill("Lin");
  await page.getByLabel(/联系方式/i).fill("lin@example.com");
  await page.getByLabel(/团队人数/i).fill("4");
  await page.getByLabel(/项目名称/i).fill("Team Console");
  await page.getByLabel(/角色/i).fill("Founder");
  await page
    .getByLabel(/项目一句话介绍/i)
    .fill("A shared ops dashboard for the team");

  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(
    page.getByRole("heading", { name: /直通卡已生成/i })
  ).toBeVisible();
});
