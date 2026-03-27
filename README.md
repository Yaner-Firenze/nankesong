# 南客松 S2 直通卡系统

一个基于 `Next.js + Vercel + Neon Postgres` 的轻量 MVP，用于：

- 录入个人或团队直通卡信息
- 在提交后生成唯一二维码
- 通过公开详情页辅助人工审核
- 在 admin 页面补充内部备注

## 本地开发

安装依赖：

```bash
pnpm install
```

复制环境变量：

```bash
cp .env.example .env.local
```

启动开发服务器：

```bash
pnpm dev
```

默认访问地址：

- 公开入口：[http://localhost:3000](http://localhost:3000)
- 管理后台：`/admin`

## 环境变量

- `DATABASE_URL`
  Neon Postgres 连接串。生产和正常开发都应指向你的 Neon 数据库。
- `APP_URL`
  二维码和公开详情页使用的站点地址，例如 `https://your-app.vercel.app`
- `ADMIN_PASSWORD`
  admin 登录共用密码
- `ADMIN_COOKIE_SECRET`
  用于签名 admin session cookie 的随机字符串

## 数据库

项目使用 `Drizzle ORM` 管理表结构，schema 位于：

- `src/lib/db/schema.ts`

常用命令：

```bash
pnpm db:generate
pnpm db:push
```

说明：

- `db:generate` 根据 schema 生成 Drizzle 迁移文件
- `db:push` 将当前 schema 直接推送到数据库

MVP 阶段建议直接使用 `pnpm db:push` 初始化 Neon 数据库。

## 测试

单元测试：

```bash
pnpm test:unit
```

端到端测试：

```bash
pnpm test:e2e
```

说明：

- Playwright 测试默认使用 `memory://local` 作为测试存储，以便在没有真实 Neon 数据库的情况下跑完整流程
- 生产环境和正常部署仍然使用 `DATABASE_URL` 指向的 Neon Postgres

## 部署到 Vercel

1. 在 Neon 创建一个 Postgres 数据库
2. 获取连接串并配置到 Vercel 的 `DATABASE_URL`
3. 在 Vercel 配置：
   - `APP_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_COOKIE_SECRET`
4. 首次部署前，本地执行一次：

```bash
pnpm db:push
```

5. 将仓库导入 Vercel 并部署

部署完成后：

- 第一个二维码应指向首页 `/`
- 第二个二维码会自动指向 `/pass/[id]`
