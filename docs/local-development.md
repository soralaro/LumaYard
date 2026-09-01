# LumaYard 本地调试环境

## 快速开始

需要 Node.js `20.9+`。如果只调试前台或旧 JSON 后台，不需要数据库：

```bash
npm install
cp .env.example .env.local
npm run dev
```

本地上传默认使用项目目录下的 `public/uploads`，并通过 `/uploads/...` 显示，不需要数据库或 R2。该目录已加入 Git 忽略。

打开 http://localhost:3000，后台地址是 http://localhost:3000/admin。JSON 模式后台密码读取 `.env.local` 的 `ADMIN_PASSWORD`。

## 启用本地 PostgreSQL

需要先安装 Docker Desktop 或 Docker Engine，然后在项目根目录执行：

```bash
npm run db:up
cp .env.example .env.local
```

确认 `.env.local` 中存在：

```env
DATABASE_URL=postgresql://lumayard:lumayard_dev@127.0.0.1:5432/lumayard?schema=public
```

初始化数据库、管理员和产品：

```bash
npm run dev:setup
npm run admin:create -- owner@example.com 'local-admin-password-12' 'Local Owner'
npm run dev
```

首次执行 `dev:setup` 会创建 Prisma 表并把 `data/products.json` 导入数据库。数据库模式登录需要输入创建脚本中的邮箱和密码。

## 常用命令

```bash
npm run db:logs       # 查看 PostgreSQL 日志
npm run db:down       # 停止数据库，数据仍保留在 Docker volume
npm run prisma:push  # schema 修改后同步本地表结构
npm run products:import
```

本地上传图片/PDF 还需要配置兼容 S3 的对象存储变量（推荐使用 Cloudflare R2 测试 bucket）：`S3_ENDPOINT`、`S3_BUCKET`、`S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY`、`S3_PUBLIC_URL`。未配置时上传接口会明确返回未配置错误，产品 JSON 编辑仍可正常使用。

## 关闭开发服务

运行 `npm run dev` 的终端按 `Ctrl+C`。数据库容器与开发服务相互独立；停止数据库使用 `npm run db:down`。
