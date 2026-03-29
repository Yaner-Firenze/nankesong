# 南客松 S2 后台发卡模式 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前“公开自助登记生成直通卡”的产品流改为“仅后台创建、公开侧只展示说明与直通卡详情”的后台发卡模式。

**Architecture:** 保留现有 `passes` 数据层、二维码详情页、admin 登录/搜索/备注/软删除能力，只重组创建入口与页面职责。公开首页改成说明页，`/apply` 下线；新增 `/admin/new` 复用现有表单与创建逻辑，但把创建后的落点切到后台详情页。

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, server actions, Drizzle ORM, Vitest, Playwright

---

## File Map

**Modify**
- `src/app/page.tsx`
  - 将首页从公开登记入口改为说明页，移除公开创建 CTA
- `src/app/pass/[id]/page.tsx`
  - 改公开详情页文案，明确这是主办方发放的直通卡
- `src/app/pass/[id]/created/page.tsx`
  - 改为兼容页或直接跳转，不再作为主流程页面
- `src/app/admin/page.tsx`
  - 保持列表页逻辑，可能补充空态/入口说明
- `src/components/admin-pass-list.tsx`
  - 新增 “新建直通卡” 入口，调整后台描述文案
- `src/components/pass-form.tsx`
  - 让表单可复用于 admin 新建场景，文案从“用户提交”切为“活动方录入”
- `src/components/pass-submit-button.tsx`
  - 按场景显示更准确的按钮文案
- `src/actions/pass-actions.ts`
  - 区分公开创建与后台创建，后台创建成功后跳转到 `/admin/pass/[id]`

**Create**
- `src/app/admin/new/page.tsx`
  - 后台新建直通卡页
- `tests/e2e/admin-create-pass.spec.ts`
  - 覆盖后台创建个人/团队直通卡
- `tests/unit/pass-actions-admin.test.ts`
  - 锁住后台创建 action 的跳转与输入处理

**Delete**
- `src/app/apply/page.tsx`
  - 下线公开创建页面

**Update tests**
- `tests/e2e/pass-flow.spec.ts`
  - 改为验证首页不再提供公开创建入口，只保留说明与详情访问能力
- `tests/e2e/admin-flow.spec.ts`
  - 改成从后台创建记录，再完成备注链路

## Task 1: 下线公开创建入口

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/app/apply/page.tsx`
- Modify: `tests/e2e/pass-flow.spec.ts`

- [ ] **Step 1: 写公开入口下线的失败测试**

```ts
test("public homepage only shows pass guidance instead of self-serve creation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /南客松 s2 直通卡/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /个人直通卡登记|团队直通卡登记/i })
  ).toHaveCount(0);
});
```

- [ ] **Step 2: 写 `/apply` 下线的失败测试**

```ts
test("apply route is no longer available as a public creation entry", async ({
  page,
}) => {
  await page.goto("/apply?type=team");
  await expect(page).not.toHaveURL(/\/apply\?type=team$/);
});
```

- [ ] **Step 3: 运行 e2e，确认当前实现失败**

Run: `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: 仍能看到公开登记入口，且 `/apply` 仍然可用

- [ ] **Step 4: 实现最小改动**

Implementation notes:
- `src/app/page.tsx`
  - 删除 `PassTypePicker`
  - 改为“主办方发放 / 飞书报名提交 / 扫码查看内容”的说明页
- `src/app/apply/page.tsx`
  - 删除文件；如需要保留路由兼容，则新建最小页面做 `redirect("/")`，但本 spec 已确认“直接删除即可”，优先直接删文件

- [ ] **Step 5: 重新运行 e2e，确认通过**

Run: `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/app/apply/page.tsx tests/e2e/pass-flow.spec.ts
git commit -m "feat: remove public self-serve pass creation"
```

## Task 2: 新增后台建卡页面并复用表单

**Files:**
- Create: `src/app/admin/new/page.tsx`
- Modify: `src/components/pass-form.tsx`
- Modify: `src/components/pass-submit-button.tsx`
- Modify: `src/components/admin-pass-list.tsx`
- Test: `tests/e2e/admin-create-pass.spec.ts`

- [ ] **Step 1: 写后台新建页 e2e 失败测试**

```ts
test("admins can open the new pass page and create a team pass", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();

  await page.getByRole("link", { name: /新建直通卡/i }).click();
  await expect(page).toHaveURL(/\/admin\/new$/);

  await page.getByRole("radio", { name: /团队直通卡/i }).check();
  await page.getByLabel(/团队名称/i).fill("Admin Issued Team");
  await page.getByLabel(/主联系人姓名/i).fill("Mina");
  await page.getByLabel(/联系方式/i).fill("mina@example.com");
  await page.getByLabel(/团队人数/i).fill("5");
  await page.getByLabel(/项目名称/i).fill("Issued Console");
  await page.getByLabel(/角色/i).fill("Builder");
  await page.getByLabel(/项目一句话介绍/i).fill("Issued by the organizer");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\//);
});
```

- [ ] **Step 2: 运行该 e2e，确认失败**

Run: `CI=1 pnpm test:e2e tests/e2e/admin-create-pass.spec.ts`
Expected: `/admin/new` 不存在，列表页也没有新建入口

- [ ] **Step 3: 实现后台页面与表单复用**

Implementation notes:
- `src/app/admin/new/page.tsx`
  - `await requireAdmin()`
  - 提供个人 / 团队切换 UI
  - 复用 `PassForm`
  - 生成 `submissionKey={crypto.randomUUID()}`
- `src/components/pass-form.tsx`
  - 新增 `mode: "public" | "admin"` prop
  - 标题、提示、备注字段文案按模式切换
  - admin 模式下不出现“你/报名时投递即可查看你的登记信息”之类的用户语境
- `src/components/pass-submit-button.tsx`
  - 支持传入按钮文案，如 `生成直通卡`
- `src/components/admin-pass-list.tsx`
  - 顶部加 `/admin/new` 链接按钮

- [ ] **Step 4: 运行后台新建 e2e，确认通过**

Run: `CI=1 pnpm test:e2e tests/e2e/admin-create-pass.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/new/page.tsx src/components/pass-form.tsx src/components/pass-submit-button.tsx src/components/admin-pass-list.tsx tests/e2e/admin-create-pass.spec.ts
git commit -m "feat: add admin-issued pass creation page"
```

## Task 3: 调整创建 action 与后台落点

**Files:**
- Modify: `src/actions/pass-actions.ts`
- Create: `tests/unit/pass-actions-admin.test.ts`
- Modify: `tests/e2e/admin-flow.spec.ts`

- [ ] **Step 1: 写后台创建 action 的失败单测**

```ts
it("redirects admin-created passes to the admin detail page", async () => {
  const formData = new FormData();
  formData.set("mode", "admin");
  formData.set("type", "individual");
  formData.set("name", "Ada");
  formData.set("contactInfo", "ada@example.com");
  formData.set("projectName", "Issued Pass");
  formData.set("role", "Builder");
  formData.set("projectSummary", "Created by admin");

  await expect(createPassAction(formData)).rejects.toThrow(
    expect.objectContaining({ digest: expect.stringContaining("/admin/pass/") })
  );
});
```

- [ ] **Step 2: 运行单测，确认失败**

Run: `pnpm test:unit tests/unit/pass-actions-admin.test.ts`
Expected: 仍然跳到 `/pass/[id]/created`

- [ ] **Step 3: 实现 action 分流**

Implementation notes:
- `src/actions/pass-actions.ts`
  - 读取 `mode`
  - `mode === "admin"` 时先 `await requireAdmin()`
  - 后台创建后 `redirect(/admin/pass/${record.id})`
  - 公开模式如果还存在兼容入口，保持旧逻辑；但新主路径只走 admin
- `src/components/pass-form.tsx`
  - 在 admin 模式下传 hidden `mode=admin`
- `tests/e2e/admin-flow.spec.ts`
  - 改成先登录后台，再创建，再写备注，避免依赖公开创建链路

- [ ] **Step 4: 运行相关测试**

Run:
- `pnpm test:unit tests/unit/pass-actions-admin.test.ts`
- `CI=1 pnpm test:e2e tests/e2e/admin-flow.spec.ts tests/e2e/admin-create-pass.spec.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/actions/pass-actions.ts src/components/pass-form.tsx tests/unit/pass-actions-admin.test.ts tests/e2e/admin-flow.spec.ts
git commit -m "feat: route pass creation through admin flow"
```

## Task 4: 收尾公开详情文案与兼容页

**Files:**
- Modify: `src/app/pass/[id]/page.tsx`
- Modify: `src/app/pass/[id]/created/page.tsx`
- Modify: `tests/e2e/pass-flow.spec.ts`

- [ ] **Step 1: 写公开详情页语义测试**

```ts
test("issued pass detail page explains organizer-issued usage", async ({ page }) => {
  // setup: create a pass through admin or fixture
  await page.goto("/pass/<fixture-id>");
  await expect(page.getByText(/主办方发放|飞书报名表单中提交/i)).toBeVisible();
});
```

- [ ] **Step 2: 运行测试，确认失败或语义不匹配**

Run: `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: 仍残留自助登记语义或旧成功页语义

- [ ] **Step 3: 实现收尾改动**

Implementation notes:
- `src/app/pass/[id]/page.tsx`
  - 文案改成“主办方发放的直通卡 / 请在飞书报名表单中提交”
- `src/app/pass/[id]/created/page.tsx`
  - 改成兼容页：若访问此页则重定向到 `/admin/pass/[id]` 或 `/pass/[id]`
  - 优先选 `/pass/[id]`，这样公开旧链接不泄露后台入口

- [ ] **Step 4: 跑全量相关验证**

Run:
- `pnpm test:unit`
- `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts tests/e2e/admin-flow.spec.ts tests/e2e/admin-create-pass.spec.ts tests/e2e/admin-delete.spec.ts`
- `pnpm build`

Expected:
- 全部 PASS
- 无 `/apply` 引用残留

- [ ] **Step 5: Commit**

```bash
git add src/app/pass/[id]/page.tsx src/app/pass/[id]/created/page.tsx tests/e2e/pass-flow.spec.ts
git commit -m "feat: finalize admin-issued pass public experience"
```

## Task 5: 文档与交付收口

**Files:**
- Modify: `docs/superpowers/specs/2026-03-29-nankesong-s2-admin-issued-pass-design.md`
  - 状态从 review 改为 implemented 或 accepted（如果团队有这个习惯）
- Modify: `README.md`（若存在且需要对外交付）

- [ ] **Step 1: 检查是否有 README 需要同步**

Run: `ls README.md`
Expected: 若存在，再同步首页/后台使用方式

- [ ] **Step 2: 更新文档**

Documentation notes:
- 公开侧只保留说明与详情访问
- 新建入口为 `/admin/new`
- 选手不再自助登记

- [ ] **Step 3: 最终验证**

Run:
- `git status --short`
- 确认只包含本次改造相关文件

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-03-29-nankesong-s2-admin-issued-pass-design.md README.md
git commit -m "docs: document admin-issued pass workflow"
```
