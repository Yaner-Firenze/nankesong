# 南客松 S2 身份证绑定与团队成员采集 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为后台发卡流程增加个人身份证唯一绑定、团队项目编号和 2～5 名团队成员身份证采集，同时确保公开页不泄露身份证信息。

**Architecture:** 扩展 `passes` 主表，新增 `identityNumber`、`projectCode` 和 JSON `members` 字段；复用现有后台建卡链路，在 validation、mapper、server action 和 admin 展示层同步扩展。公开二维码页保持现有 URL 结构，只收紧数据展示边界，不让身份证号进入公开面。

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, server actions, Drizzle ORM, Zod, Vitest, Playwright

---

## File Map

**Modify**
- `src/lib/db/schema.ts`
  - 为 `passes` 表新增 `identityNumber`、`projectCode`、`members`
  - 为个人身份证号增加唯一约束
- `src/lib/validation/pass.ts`
  - 扩展个人/团队建卡 schema
  - 新增团队成员数组与身份证校验
- `src/lib/pass-mappers.ts`
  - 把新字段映射到数据库 insert payload
- `src/lib/passes.ts`
  - 保持创建、查询、内存存储与新字段兼容
- `src/components/pass-form.tsx`
  - 后台建卡表单新增身份证号、项目编号、团队成员输入
- `src/actions/pass-actions.ts`
  - 读取并校验新增字段
- `src/app/admin/pass/[id]/page.tsx`
  - 后台详情展示身份证号、项目编号与团队成员信息
- `src/app/pass/[id]/page.tsx`
  - 确认公开页不渲染身份证号或成员身份证
- `README.md`
  - 如有必要，同步后台建卡字段说明

**Create**
- `tests/unit/pass-validation-identity.test.ts`
  - 身份证与团队成员校验单测
- `tests/unit/passes-identity-uniqueness.test.ts`
  - 个人身份证唯一绑定与团队成员存储单测
- `tests/e2e/admin-identity-flow.spec.ts`
  - 覆盖后台创建含身份证信息的个人/团队直通卡

**Potential migration command**
- `pnpm db:push`
  - 将 schema 变更推送到远程 Neon 数据库

## Task 1: 扩展数据库 schema 与类型

**Files:**
- Modify: `src/lib/db/schema.ts`
- Test: `tests/unit/pass-schema-smoke.test.ts`

- [ ] **Step 1: 写/更新 schema 失败测试**

```ts
it("exposes identityNumber, projectCode, and members fields on pass rows", async () => {
  const { passes } = await import("@/lib/db/schema");

  expect(passes.identityNumber).toBeDefined();
  expect(passes.projectCode).toBeDefined();
  expect(passes.members).toBeDefined();
});
```

- [ ] **Step 2: 运行单测，确认当前 schema 不满足**

Run: `pnpm test:unit tests/unit/pass-schema-smoke.test.ts`
Expected: FAIL because new fields do not exist yet

- [ ] **Step 3: 最小实现 schema 变更**

Implementation notes:
- `identityNumber`: nullable text/varchar, unique index
- `projectCode`: nullable text/varchar
- `members`: JSON/JSONB，默认 `null`
- 保持旧记录兼容，新增字段允许为空

- [ ] **Step 4: 重新运行 schema 单测**

Run: `pnpm test:unit tests/unit/pass-schema-smoke.test.ts`
Expected: PASS

- [ ] **Step 5: 将 schema 推送到数据库**

Run: `pnpm db:push`
Expected: `[✓] Changes applied`

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/schema.ts tests/unit/pass-schema-smoke.test.ts
git commit -m "feat: extend pass schema for identity binding"
```

## Task 2: 扩展验证规则

**Files:**
- Modify: `src/lib/validation/pass.ts`
- Create: `tests/unit/pass-validation-identity.test.ts`

- [ ] **Step 1: 写身份证与团队成员校验失败测试**

```ts
it("rejects an individual pass without identity number", async () => {
  const { createPassSchema } = await import("@/lib/validation/pass");

  expect(() =>
    createPassSchema.parse({
      type: "individual",
      name: "Ada",
      contactInfo: "ada@example.com",
      projectName: "Solo",
      role: "Builder",
      projectSummary: "AI helper",
    })
  ).toThrow();
});

it("rejects a team pass with fewer than 2 members", async () => {
  const { createPassSchema } = await import("@/lib/validation/pass");

  expect(() =>
    createPassSchema.parse({
      type: "team",
      teamName: "Flux",
      contactName: "Lin",
      contactInfo: "lin@example.com",
      teamSize: 2,
      projectCode: "PRJ-001",
      projectName: "Console",
      role: "Founder",
      projectSummary: "Ops dashboard",
      members: [{ name: "Lin", identityNumber: "110101199001011234" }],
    })
  ).toThrow();
});
```

- [ ] **Step 2: 运行校验单测，确认失败**

Run: `pnpm test:unit tests/unit/pass-validation-identity.test.ts`
Expected: FAIL because schema does not know these fields/rules yet

- [ ] **Step 3: 实现最小校验逻辑**

Implementation notes:
- 新增身份证号码基础格式校验函数/regex
- 个人卡：
  - `identityNumber` 必填
- 团队卡：
  - `projectCode` 必填
  - `members` 为 2～5 人数组
  - 每位成员 `name` + `identityNumber`
  - 团队成员身份证号去重
  - `teamSize` 与 `members.length` 一致

- [ ] **Step 4: 重新运行校验单测**

Run: `pnpm test:unit tests/unit/pass-validation-identity.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/validation/pass.ts tests/unit/pass-validation-identity.test.ts
git commit -m "feat: validate identity binding and team members"
```

## Task 3: 扩展 mapper 与存储逻辑

**Files:**
- Modify: `src/lib/pass-mappers.ts`
- Modify: `src/lib/passes.ts`
- Create: `tests/unit/passes-identity-uniqueness.test.ts`

- [ ] **Step 1: 写存储失败测试**

```ts
it("stores identity number for individual passes and blocks duplicate identity numbers", async () => {
  process.env.DATABASE_URL = "memory://local";
  // setup env...
  const { createPass } = await import("@/lib/passes");

  await createPass({
    type: "individual",
    name: "Ada",
    contactInfo: "ada@example.com",
    identityNumber: "110101199001011234",
    projectName: "Solo",
    role: "Builder",
    projectSummary: "AI helper",
  } as never);

  await expect(
    createPass({
      type: "individual",
      name: "Ada 2",
      contactInfo: "ada2@example.com",
      identityNumber: "110101199001011234",
      projectName: "Solo 2",
      role: "Builder",
      projectSummary: "AI helper 2",
    } as never)
  ).rejects.toThrow();
});
```

- [ ] **Step 2: 运行单测，确认失败**

Run: `pnpm test:unit tests/unit/passes-identity-uniqueness.test.ts`
Expected: FAIL because mapper/storage do not support new fields yet

- [ ] **Step 3: 实现最小存储逻辑**

Implementation notes:
- `src/lib/pass-mappers.ts`
  - 个人卡映射 `identityNumber`
  - 团队卡映射 `projectCode` 和 `members`
- `src/lib/passes.ts`
  - memory store 里保留新字段
  - memory mode 下手动检查个人身份证唯一性
  - db mode 下依赖唯一约束，但要把唯一冲突转成可读错误

- [ ] **Step 4: 重新运行单测**

Run: `pnpm test:unit tests/unit/passes-identity-uniqueness.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/pass-mappers.ts src/lib/passes.ts tests/unit/passes-identity-uniqueness.test.ts
git commit -m "feat: persist identity binding fields"
```

## Task 4: 扩展后台建卡表单与 action

**Files:**
- Modify: `src/components/pass-form.tsx`
- Modify: `src/actions/pass-actions.ts`
- Test: `tests/e2e/admin-identity-flow.spec.ts`

- [ ] **Step 1: 写后台建卡 e2e 失败测试**

```ts
test("admins can create an individual pass with a bound identity number", async ({
  page,
}) => {
  await page.goto("/admin/login");
  await page.getByLabel(/密码/i).fill("test-admin");
  await page.getByRole("button", { name: /登录后台/i }).click();
  await page.getByRole("link", { name: /新建直通卡/i }).click();

  await page.getByLabel(/姓名/i).fill("Ada");
  await page.getByLabel(/联系方式/i).fill("ada@example.com");
  await page.getByLabel(/身份证号码/i).fill("110101199001011234");
  await page.getByLabel(/项目名称/i).fill("Identity Solo");
  await page.getByLabel(/角色/i).fill("Builder");
  await page.getByLabel(/项目一句话介绍/i).fill("AI helper");
  await page.getByRole("button", { name: /生成直通卡/i }).click();

  await expect(page).toHaveURL(/\/admin\/pass\//, { timeout: 15000 });
});
```

- [ ] **Step 2: 运行 e2e，确认失败**

Run: `CI=1 pnpm test:e2e tests/e2e/admin-identity-flow.spec.ts`
Expected: FAIL because fields and action parsing are missing

- [ ] **Step 3: 实现最小表单与 action**

Implementation notes:
- 个人模式新增 `身份证号码`
- 团队模式新增 `项目编号`
- 团队模式新增 2～5 组成员输入区
- action 读取：
  - `identityNumber`
  - `projectCode`
  - `memberName[]` / `memberIdentityNumber[]` 或固定命名后组装成数组
- 保持 admin 模式跳转到 `/admin/pass/[id]`

- [ ] **Step 4: 重新运行后台建卡 e2e**

Run: `CI=1 pnpm test:e2e tests/e2e/admin-identity-flow.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/pass-form.tsx src/actions/pass-actions.ts tests/e2e/admin-identity-flow.spec.ts
git commit -m "feat: collect identity numbers in admin pass form"
```

## Task 5: 扩展后台详情并确认公开页不泄露

**Files:**
- Modify: `src/app/admin/pass/[id]/page.tsx`
- Modify: `src/app/pass/[id]/page.tsx`
- Modify: `tests/e2e/pass-flow.spec.ts`

- [ ] **Step 1: 写展示边界测试**

```ts
test("public pass page does not expose identity numbers", async ({ page }) => {
  // setup a pass through admin flow
  await page.goto(`/pass/${id}`);
  await expect(page.getByText(/110101199001011234/)).toHaveCount(0);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts tests/e2e/admin-identity-flow.spec.ts`
Expected: FAIL because admin/public pages do not yet reflect the new data model correctly

- [ ] **Step 3: 实现最小展示改动**

Implementation notes:
- 后台详情页：
  - 个人卡显示身份证号码
  - 团队卡显示项目编号、成员列表和成员身份证号
- 公开页：
  - 不渲染 `identityNumber`
  - 不渲染团队成员身份证号
  - 可继续显示 `teamSize`

- [ ] **Step 4: 跑相关 e2e**

Run: `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts tests/e2e/admin-identity-flow.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/pass/[id]/page.tsx src/app/pass/[id]/page.tsx tests/e2e/pass-flow.spec.ts
git commit -m "feat: display identity data only in admin"
```

## Task 6: 全量回归与文档同步

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 更新必要文档**

Documentation notes:
- 后台个人卡新增身份证号
- 团队卡新增项目编号与成员身份证采集
- 公开页不显示身份证号

- [ ] **Step 2: 运行全量验证**

Run:
- `pnpm test:unit`
- `CI=1 pnpm test:e2e tests/e2e/pass-flow.spec.ts tests/e2e/admin-flow.spec.ts tests/e2e/admin-create-pass.spec.ts tests/e2e/admin-delete.spec.ts tests/e2e/admin-identity-flow.spec.ts`
- `pnpm build`

Expected:
- 全部 PASS
- 无公开页身份证泄露

- [ ] **Step 3: Commit**

```bash
git add README.md tests/e2e/admin-identity-flow.spec.ts tests/e2e/pass-flow.spec.ts
git commit -m "docs: describe identity binding pass workflow"
```
