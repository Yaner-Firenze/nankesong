# 南客松 S2 直通卡系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可部署到 Vercel 的 MVP，支持个人/团队直通卡登记、二维码生成、公开详情展示，以及带简单密码登录的 admin 备注后台。

**Architecture:** 使用 `Next.js App Router` 提供公开页面、表单提交流程和 admin 页面；使用 `Neon Postgres + Drizzle ORM` 存储直通卡记录；二维码在服务端根据公开详情页 URL 生成并在成功页展示。admin 认证采用单密码 + signed cookie 的最小实现。

**Tech Stack:** Next.js, TypeScript, React, Drizzle ORM, Neon Postgres, Zod, QRCode, Vitest, Testing Library, Playwright

---

## File Structure

- `package.json`
  项目依赖、脚本和包管理入口
- `next.config.ts`
  Next.js 配置
- `tsconfig.json`
  TypeScript 配置
- `src/app/layout.tsx`
  全站布局
- `src/app/page.tsx`
  首页，用户选择个人或团队
- `src/app/apply/page.tsx`
  表单页，根据类型渲染不同表单
- `src/app/pass/[id]/created/page.tsx`
  提交成功页，展示二维码和详情链接
- `src/app/pass/[id]/page.tsx`
  公开详情页
- `src/app/admin/login/page.tsx`
  admin 登录页
- `src/app/admin/page.tsx`
  admin 列表页
- `src/app/admin/pass/[id]/page.tsx`
  admin 详情和备注编辑页
- `src/app/globals.css`
  全局样式
- `src/components/pass-type-picker.tsx`
  首页类型选择组件
- `src/components/pass-form.tsx`
  通用表单组件，根据类型显示字段
- `src/components/pass-success-card.tsx`
  成功页展示组件
- `src/components/admin-login-form.tsx`
  admin 登录表单
- `src/components/admin-pass-list.tsx`
  admin 列表组件
- `src/components/admin-note-form.tsx`
  admin 备注编辑组件
- `src/lib/db/schema.ts`
  Drizzle schema，定义 `passes` 表
- `src/lib/db/client.ts`
  数据库连接
- `src/lib/passes.ts`
  直通卡读写逻辑
- `src/lib/pass-mappers.ts`
  个人/团队表单与数据库记录之间的映射
- `src/lib/admin-auth.ts`
  admin cookie 签发、校验、登出
- `src/lib/validation/pass.ts`
  Zod 表单校验
- `src/lib/qr.ts`
  二维码生成逻辑
- `src/lib/env.ts`
  环境变量校验
- `src/actions/pass-actions.ts`
  创建直通卡的 server action
- `src/actions/admin-actions.ts`
  admin 登录和备注更新 action
- `drizzle.config.ts`
  Drizzle 配置
- `.env.example`
  本地环境变量示例
- `tests/unit/pass-validation.test.ts`
  表单校验测试
- `tests/unit/pass-mappers.test.ts`
  表单映射测试
- `tests/unit/admin-auth.test.ts`
  admin 认证测试
- `tests/unit/qr.test.ts`
  二维码 URL 生成测试
- `tests/e2e/pass-flow.spec.ts`
  公开提交流程 e2e
- `tests/e2e/admin-flow.spec.ts`
  admin 流程 e2e
- `playwright.config.ts`
  Playwright 配置
- `vitest.config.ts`
  Vitest 配置
- `README.md`
  运行、部署和环境变量说明

## Task 1: Scaffold the app and toolchain

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Scaffold a Next.js TypeScript app**

Run: `pnpm create next-app@latest . --ts --app --eslint --src-dir --use-pnpm --import-alias "@/*"`
Expected: Next.js app files created in the worktree without prompts that conflict with the chosen flags.

- [ ] **Step 2: Add testing and app dependencies**

Run: `pnpm add drizzle-orm @neondatabase/serverless zod qrcode`
Run: `pnpm add -D drizzle-kit vitest @testing-library/react @testing-library/jest-dom jsdom playwright @playwright/test`
Expected: dependencies installed successfully and saved to `package.json`.

- [ ] **Step 3: Normalize generated app shell**

Replace the default landing page in `src/app/page.tsx` with a minimal placeholder that mentions the direct-pass flow.
Expected: generated demo content removed so future tests target project-specific UI.

- [ ] **Step 4: Add test scripts**

Update `package.json` scripts to include:

```json
{
  "test:unit": "vitest run",
  "test:e2e": "playwright test",
  "test": "pnpm test:unit"
}
```

Expected: repository has stable commands for unit and e2e verification.

- [ ] **Step 5: Run baseline checks**

Run: `pnpm test:unit`
Expected: command succeeds even if there are zero tests at this point.

- [ ] **Step 6: Commit scaffold**

```bash
git add .
git commit -m "chore: scaffold next app"
```

## Task 2: Add environment handling and database foundation

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/db/client.ts`
- Create: `src/lib/db/schema.ts`
- Modify: `.env.example`
- Modify: `README.md`
- Test: `tests/unit/pass-schema-smoke.test.ts`

- [ ] **Step 1: Write the failing environment test**

Create `tests/unit/pass-schema-smoke.test.ts` with a minimal assertion that `getEnv` throws when required vars are missing.

```ts
import { describe, expect, it } from "vitest";

describe("getEnv", () => {
  it("throws when required environment variables are missing", async () => {
    const { getEnv } = await import("@/lib/env");
    expect(() => getEnv()).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/pass-schema-smoke.test.ts`
Expected: FAIL because `src/lib/env.ts` does not exist yet.

- [ ] **Step 3: Implement minimal environment and schema setup**

Create:
- `src/lib/env.ts` with Zod-validated env access for `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_COOKIE_SECRET`, `APP_URL`
- `src/lib/db/client.ts` with shared Neon/Drizzle client
- `src/lib/db/schema.ts` with `passes` table
- `drizzle.config.ts` pointing to schema and migrations directory

Include `passes` columns:
- `id`
- `type`
- `status`
- `name`
- `teamName`
- `contactName`
- `contactInfo`
- `role`
- `projectName`
- `projectSummary`
- `teamSize`
- `userNote`
- `internalNote`
- `createdAt`
- `updatedAt`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:unit tests/unit/pass-schema-smoke.test.ts`
Expected: PASS.

- [ ] **Step 5: Add environment documentation**

Update `.env.example` and `README.md` with required variables and local setup steps.

- [ ] **Step 6: Commit database foundation**

```bash
git add .
git commit -m "feat: add env and db foundation"
```

## Task 3: Build validation and record creation logic

**Files:**
- Create: `src/lib/validation/pass.ts`
- Create: `src/lib/pass-mappers.ts`
- Create: `src/lib/passes.ts`
- Create: `src/actions/pass-actions.ts`
- Test: `tests/unit/pass-validation.test.ts`
- Test: `tests/unit/pass-mappers.test.ts`

- [ ] **Step 1: Write the failing validation tests**

Add `tests/unit/pass-validation.test.ts` to cover:
- individual payload requires `name`, `contactInfo`, `projectName`, `role`, `projectSummary`
- team payload requires `teamName`, `contactName`, `contactInfo`, `teamSize`, `projectName`, `role`, `projectSummary`
- invalid `type` is rejected

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:unit tests/unit/pass-validation.test.ts`
Expected: FAIL because validation module does not exist yet.

- [ ] **Step 3: Implement Zod schemas**

Create `src/lib/validation/pass.ts` with:
- `individualPassSchema`
- `teamPassSchema`
- `createPassSchema`

Use a discriminated union on `type`.

- [ ] **Step 4: Write the failing mapper tests**

Add `tests/unit/pass-mappers.test.ts` to assert:
- individual payload maps `name` into both `name` and `contactName`
- team payload keeps `teamName` and `contactName` distinct
- `status` defaults to `active`

- [ ] **Step 5: Run mapper tests to verify they fail**

Run: `pnpm test:unit tests/unit/pass-mappers.test.ts`
Expected: FAIL because mapper logic does not exist.

- [ ] **Step 6: Implement minimal creation logic**

Create:
- `src/lib/pass-mappers.ts` for DB insert mapping
- `src/lib/passes.ts` for `createPass`, `getPassById`, `searchPasses`, `updateInternalNote`
- `src/actions/pass-actions.ts` for server action submission flow

Generate record IDs with a non-predictable identifier.

- [ ] **Step 7: Run focused unit tests**

Run: `pnpm test:unit tests/unit/pass-validation.test.ts tests/unit/pass-mappers.test.ts`
Expected: PASS.

- [ ] **Step 8: Commit creation logic**

```bash
git add .
git commit -m "feat: add pass validation and creation logic"
```

## Task 4: Build the public entry and apply flow

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/apply/page.tsx`
- Create: `src/components/pass-type-picker.tsx`
- Create: `src/components/pass-form.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/pass-flow.spec.ts`

- [ ] **Step 1: Write the failing e2e test for the public flow start**

Create `tests/e2e/pass-flow.spec.ts` covering:
- homepage shows individual/team choices
- choosing a type opens `/apply?type=...`
- submitting the form reaches a success state

- [ ] **Step 2: Run the e2e test to verify it fails**

Run: `pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: FAIL because the pages and form are not built yet.

- [ ] **Step 3: Implement the entry page**

Create `src/components/pass-type-picker.tsx` and render it from `src/app/page.tsx`.

- [ ] **Step 4: Implement the apply page and form**

Create `src/components/pass-form.tsx` and `src/app/apply/page.tsx` with:
- type-aware headings
- all approved fields
- submit button wired to the pass creation action
- redirect back to `/` when `type` is absent or invalid

- [ ] **Step 5: Re-run the e2e test**

Run: `pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: still FAIL, but now on the missing success page behavior instead of missing routes.

- [ ] **Step 6: Commit public flow UI**

```bash
git add .
git commit -m "feat: add public apply flow"
```

## Task 5: Build success page, QR generation, and public pass detail

**Files:**
- Create: `src/lib/qr.ts`
- Create: `src/app/pass/[id]/created/page.tsx`
- Create: `src/app/pass/[id]/page.tsx`
- Create: `src/components/pass-success-card.tsx`
- Test: `tests/unit/qr.test.ts`
- Modify: `tests/e2e/pass-flow.spec.ts`

- [ ] **Step 1: Write the failing QR utility test**

Add `tests/unit/qr.test.ts` to assert that the QR utility builds a URL based on `APP_URL` and pass ID.

- [ ] **Step 2: Run the QR utility test to verify it fails**

Run: `pnpm test:unit tests/unit/qr.test.ts`
Expected: FAIL because QR utility does not exist.

- [ ] **Step 3: Implement QR URL and image generation helpers**

Create `src/lib/qr.ts` with:
- `buildPassUrl(id: string): string`
- `buildPassQrDataUrl(id: string): Promise<string>`

- [ ] **Step 4: Implement the success page**

Create `src/app/pass/[id]/created/page.tsx` and `src/components/pass-success-card.tsx` to show:
- success message
- unique ID
- QR code image
- public detail URL

- [ ] **Step 5: Implement the public detail page**

Create `src/app/pass/[id]/page.tsx` to load the record and render approved public fields only.

- [ ] **Step 6: Re-run public flow tests**

Run: `pnpm test:unit tests/unit/qr.test.ts`
Run: `pnpm test:e2e tests/e2e/pass-flow.spec.ts`
Expected: PASS for both commands.

- [ ] **Step 7: Commit QR and public detail flow**

```bash
git add .
git commit -m "feat: add pass qr and public detail pages"
```

## Task 6: Build admin authentication and note editing

**Files:**
- Create: `src/lib/admin-auth.ts`
- Create: `src/actions/admin-actions.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/pass/[id]/page.tsx`
- Create: `src/components/admin-login-form.tsx`
- Create: `src/components/admin-pass-list.tsx`
- Create: `src/components/admin-note-form.tsx`
- Test: `tests/unit/admin-auth.test.ts`
- Test: `tests/e2e/admin-flow.spec.ts`

- [ ] **Step 1: Write the failing admin auth test**

Create `tests/unit/admin-auth.test.ts` covering:
- valid password produces a signed session token
- invalid password is rejected
- invalid cookie does not authenticate

- [ ] **Step 2: Run the auth test to verify it fails**

Run: `pnpm test:unit tests/unit/admin-auth.test.ts`
Expected: FAIL because auth module does not exist.

- [ ] **Step 3: Implement minimal admin auth**

Create `src/lib/admin-auth.ts` and `src/actions/admin-actions.ts` with:
- password check against env
- cookie issue/read helpers
- logout helper

- [ ] **Step 4: Write the failing admin e2e test**

Create `tests/e2e/admin-flow.spec.ts` covering:
- unauthenticated user gets redirected to login
- valid login reaches admin list
- admin can open a record and save `internalNote`

- [ ] **Step 5: Run the admin e2e test to verify it fails**

Run: `pnpm test:e2e tests/e2e/admin-flow.spec.ts`
Expected: FAIL because admin pages do not exist yet.

- [ ] **Step 6: Implement admin pages**

Create:
- login page and form
- pass list page with search
- pass detail page with note edit form

Guard `/admin` routes with cookie verification.

- [ ] **Step 7: Re-run auth and admin tests**

Run: `pnpm test:unit tests/unit/admin-auth.test.ts`
Run: `pnpm test:e2e tests/e2e/admin-flow.spec.ts`
Expected: PASS for both commands.

- [ ] **Step 8: Commit admin MVP**

```bash
git add .
git commit -m "feat: add admin auth and internal notes"
```

## Task 7: Final verification and deployment readiness

**Files:**
- Modify: `README.md`
- Modify: `.env.example`
- Modify: any test/config files needed for final cleanup

- [ ] **Step 1: Add final setup and deploy instructions**

Update `README.md` with:
- local install
- environment variables
- Drizzle migration/generation commands
- Neon setup notes
- Vercel deployment notes

- [ ] **Step 2: Run full unit test suite**

Run: `pnpm test:unit`
Expected: PASS with `0` failures.

- [ ] **Step 3: Run full e2e suite**

Run: `pnpm test:e2e`
Expected: PASS with `0` failures.

- [ ] **Step 4: Run production build**

Run: `pnpm build`
Expected: PASS and Next.js production build completes without errors.

- [ ] **Step 5: Review implementation against the spec**

Check the completed app against:
- `docs/superpowers/specs/2026-03-27-nankesong-s2-direct-pass-design.md`

Confirm all MVP acceptance criteria are covered before making completion claims.

- [ ] **Step 6: Commit final polish**

```bash
git add .
git commit -m "chore: finalize direct pass mvp"
```
