# LumaYard 后台管理系统设计

> 状态：设计稿
> 日期：2026-08-27
> 目标：在现有 Next.js 架构内建设一个适合非技术人员使用、可维护、可备份的品牌内容与产品后台。

## 1. 结论

正式后台应采用：

- **PostgreSQL**：保存产品、分类、媒体元数据、询盘、管理员、站点设置和操作记录。
- **Cloudflare R2 或兼容 S3 的对象存储**：保存图片、PDF 规格书、安装手册等文件。
- **Next.js App Router**：继续承载前台、`/admin` 后台和 API。
- **数据库迁移工具**：建议 Prisma；负责类型、Schema 和迁移。
- **图片处理**：上传时校验并生成 WebP/AVIF 缩略图，原图保留或按配置归档。

不建议继续将正式产品写入 `data/products.json`，也不建议把图片/PDF 二进制写入 PostgreSQL。

当前 JSON 后台可以继续作为过渡版本，但数据库后台上线后应停止写入 JSON。

## 2. 为什么需要数据库

只有三个静态产品时，JSON 足够简单。加入以下需求后，数据库更可靠：

- 一个产品有多张图片、多个文档和可排序关系。
- 产品需要草稿、发布、下架状态。
- 修改 handle 时仍需准确找到原产品。
- 分类、场景、卖点和推荐产品需要建立关联。
- 多个后台请求不能同时覆盖同一个 JSON 文件。
- 需要记录谁在什么时候修改了什么。
- 需要查询、筛选、分页和批量操作。
- 后续会加入询盘、Planner、内容文章和多个管理员。

PostgreSQL 只存文件地址、尺寸、类型等元数据。实际文件放对象存储，可以避免数据库膨胀，并支持 CDN、缓存和独立备份。

## 3. 使用者与权限

第一阶段提供两个角色：

| 角色 | 权限 |
| --- | --- |
| Owner | 全部权限，包括管理员、站点设置和删除操作 |
| Editor | 管理产品、媒体、文档和内容，不能管理管理员 |

后续如有客服团队，可增加只读 `Support` 角色。

登录要求：

- 管理员使用邮箱和密码登录。
- 密码使用 Argon2id 或 bcrypt 哈希保存，绝不明文保存。
- 使用数据库会话，Cookie 设置 `HttpOnly`、`Secure`、`SameSite=Lax`。
- 登录失败限流，连续失败后短时锁定。
- 支持退出所有设备和会话过期。
- 第二阶段增加 TOTP 双因素认证和密码重置邮件。

## 4. 后台信息架构

```text
/admin
├── Overview          运营概览、待完善产品、最近询盘
├── Products          产品列表、新增、编辑、预览、发布
├── Media             图片和文档媒体库
├── Collections       产品分类
├── Spaces            Backyard / Garden / Patio / Deck
├── Inquiries         联系表单和项目询盘
├── Content           Ideas、政策页面、首页内容（第二阶段）
├── Settings          品牌、联系信息、Stripe、SEO
├── Users             管理员与角色
└── Audit log         操作记录
```

后台桌面端采用左侧导航；移动端采用抽屉导航。重要操作使用明确的保存、发布、下架、删除按钮，不依赖隐藏图标。

## 5. 产品管理功能

### 5.1 产品列表

- 按名称、SKU、handle 搜索。
- 按状态、分类、场景筛选。
- 按更新时间、价格、名称排序。
- 显示主图、名称、价格、状态、更新时间。
- 批量发布、下架和归档。
- 复制产品，方便创建相似规格。

### 5.2 产品编辑

基础信息：

- 产品名称
- URL handle（自动生成，可手动修改）
- SKU
- 简短摘要
- 详细描述
- 状态：Draft、Published、Archived

销售信息：

- 价格和币种
- Stripe Payment Link
- 是否显示 WhatsApp 询价
- 询价按钮文案

分类信息：

- Collection
- 适用空间
- 标签
- Complete the Look 推荐产品

规格信息：

- 材质
- 尺寸和重量
- 颜色
- 防水等级
- 供电方式
- 安装方式
- 保修说明
- 可扩展的键值规格表

媒体信息：

- 多图上传、拖动排序、设置主图
- 每张图填写 alt 文本
- PDF 规格书
- PDF 安装手册
- 保修/认证文件

SEO：

- SEO title
- Meta description
- Open Graph 图片
- 搜索预览

发布体验：

- 自动保存草稿，顶部显示保存状态。
- 发布前校验必填字段、主图、价格和描述。
- 支持“预览草稿”，预览链接短时有效且不被搜索引擎收录。
- 修改已发布产品后可直接发布；后续可增加定时发布和版本回滚。

## 6. 文件上传与媒体库

### 6.1 支持格式

| 类型 | 格式 | 单文件上限 | 用途 |
| --- | --- | ---: | --- |
| 图片 | JPEG、PNG、WebP、AVIF | 15 MB | 产品图、场景图、文章图 |
| 文档 | PDF | 25 MB | 规格书、安装手册、认证文件 |

第一阶段不接受 SVG、Office 文件、压缩包和视频。SVG 可能包含脚本；视频应后续使用专门的视频托管。

### 6.2 上传流程

```text
管理员选择文件
    ↓
服务端校验登录、扩展名、MIME、文件头和大小
    ↓
生成不可预测的对象 key
    ↓
图片去除 EXIF，生成展示尺寸和缩略图
    ↓
上传到 R2/S3
    ↓
数据库写入 MediaAsset 元数据
    ↓
管理员将媒体关联到产品并排序
```

建议对象 key：

```text
products/2026/08/<uuid>/original.webp
products/2026/08/<uuid>/large.webp
products/2026/08/<uuid>/thumb.webp
documents/2026/08/<uuid>.pdf
```

不要使用用户原始文件名作为真实路径。原始文件名只作为元数据保存。

### 6.3 存储策略

推荐生产环境使用 Cloudflare R2：

- 文件与应用服务器分离，重新部署不会丢失上传内容。
- 支持 CDN 和自定义媒体域名，如 `media.lumayard.com`。
- 备份和迁移比 VPS 本地目录简单。

开发环境可使用本地 `storage/` 目录模拟，但该目录必须加入 `.gitignore`。

删除媒体时先检查引用。仍被产品或文章使用的文件不能直接删除；无引用文件进入回收站，30 天后再物理删除。

## 7. 数据模型

核心表如下：

### User

```text
id, email, name, passwordHash, role, status,
lastLoginAt, createdAt, updatedAt
```

### Session

```text
id, userId, tokenHash, expiresAt, ipAddress,
userAgent, createdAt
```

### Product

```text
id, handle, sku, title, summary, description,
status, price, currency, stripePaymentLink,
whatsappInquiry, material, dimensions, weight,
installation, warranty, seoTitle, seoDescription,
publishedAt, createdAt, updatedAt
```

### ProductSpecification

```text
id, productId, label, value, sortOrder
```

### MediaAsset

```text
id, kind, storageKey, publicUrl, originalName,
mimeType, byteSize, width, height, altText,
checksum, status, createdBy, createdAt
```

### ProductMedia

```text
productId, mediaId, role, sortOrder
```

`role` 可为 `gallery`、`hero`、`spec_sheet`、`manual`、`certificate`。

### Collection / Space / Tag

独立表保存名称、handle、描述和排序；通过关联表连接产品，避免自由文本造成重复值。

### ProductRelation

```text
sourceProductId, targetProductId, relationType, sortOrder
```

用于 Complete the Look 和相关推荐。

### Inquiry

```text
id, name, email, phone, message, productId,
source, status, assignedTo, notes, createdAt, updatedAt
```

### SiteSetting

```text
key, valueJson, updatedBy, updatedAt
```

只存适合后台编辑的公开设置。API Key、数据库密码等秘密仍放环境变量，不进入此表。

### AuditLog

```text
id, userId, action, entityType, entityId,
beforeJson, afterJson, ipAddress, createdAt
```

## 8. API 设计

后台 API 均位于 `/api/admin`，必须验证会话和角色。

```text
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/session

GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/:id/publish
POST   /api/admin/products/:id/archive

POST   /api/admin/uploads/presign
POST   /api/admin/uploads/complete
GET    /api/admin/media
PATCH  /api/admin/media/:id
DELETE /api/admin/media/:id

GET    /api/admin/inquiries
PATCH  /api/admin/inquiries/:id
```

生产上传推荐使用短时效 presigned URL，让浏览器直传 R2，避免大文件经过 Next.js 进程。完成上传后，服务端再次验证对象信息并写入数据库。

所有写操作需要：

- 输入 Schema 校验（建议 Zod）。
- CSRF/Origin 检查。
- 权限检查。
- 速率限制。
- AuditLog。

## 9. 前台读取与缓存

- `/shop` 和产品页从 PostgreSQL 读取已发布产品。
- 草稿和归档产品不出现在前台、sitemap 或结构化数据中。
- 产品更新后调用 Next.js `revalidatePath`/`revalidateTag`，无需重新构建或重启 PM2。
- 前台图片继续使用 `next/image`，R2 媒体域名加入 `remotePatterns`。
- 产品 handle 改动时记录旧 handle，并提供 301 重定向，避免 SEO 链接失效。

## 10. 安全要求

- 后台只通过 HTTPS 访问。
- Nginx 对 `/admin` 和后台 API 添加严格安全响应头。
- 登录与密码重置接口限流。
- 上传同时验证扩展名、MIME 和文件头，不能只相信浏览器声明。
- PDF 以 `Content-Disposition: attachment` 或安全内联策略提供。
- 文件名和文案输出统一转义，禁止注入 HTML。
- 数据库账号只授予应用所需权限。
- 生产环境秘密由 `.env` 或 secret manager 管理。
- 管理操作保存审计日志；日志中不记录密码、Cookie、API Key。
- 删除产品默认归档，物理删除只允许 Owner 二次确认执行。

## 11. 备份与恢复

最低要求：

- PostgreSQL 每日自动备份，保留 30 天。
- R2 开启对象版本控制或每日增量同步。
- 每周把一份数据库备份复制到不同服务商或不同机器。
- 每季度实际执行一次恢复演练。

恢复顺序：数据库、对象存储、环境变量、应用版本。备份只有经过恢复验证才算有效。

## 12. 从现有 JSON 迁移

1. 建立 PostgreSQL、Prisma Schema 和首个管理员。
2. 建立 R2 bucket 和媒体域名。
3. 编写一次性导入脚本，将 `data/products.json` 导入数据库。
4. 下载现有远程图片并上传 R2，更新 MediaAsset 引用。
5. 前台切换为数据库读取，并保留 JSON 只读回退一个版本周期。
6. 验证产品数量、URL、价格、图片和 Stripe 链接。
7. 停止 JSON 写入，确认备份后移除旧后台 API。

迁移脚本必须可重复执行，并通过 handle/SKU 去重。

## 13. 分阶段实施

### Phase A：可靠产品后台（优先）

- PostgreSQL + Prisma
- 管理员登录和角色
- 产品 CRUD、草稿/发布/归档
- 多图与 PDF 上传到 R2
- 媒体库、排序、alt 文本
- 前台动态读取和缓存失效
- 操作日志和基本备份

### Phase B：日常运营

- Collection、Space、Tag 管理
- 询盘列表、状态和内部备注
- Complete the Look 关联
- 批量操作和 CSV 导入/导出
- 站点设置和 SEO 管理
- 两步验证和密码重置

### Phase C：内容与自动化

- Ideas 文章编辑器
- 首页区块管理
- 定时发布和版本历史
- 图片焦点裁切
- 邮件订阅和分析面板
- Planner 数据与推荐规则管理

## 14. Phase A 验收标准

- 管理员能够在手机和桌面端登录、退出。
- 错误密码有清晰提示并受到限流保护。
- 可以新增产品、保存草稿、预览和发布。
- 可以上传、排序、替换多张产品图。
- 可以上传并下载 PDF 规格书和安装手册。
- 非图片伪装文件、超限文件和未登录上传均被拒绝。
- 发布后前台在一分钟内显示新内容，无需重新构建。
- 下架后产品从商店、sitemap 和直接访问中正确移除。
- 产品 handle 修改后旧地址 301 到新地址。
- 两个并发编辑不会静默覆盖数据；至少提示版本冲突。
- 数据库和媒体文件可从备份恢复。
- 所有新增、修改、发布和删除动作可在 AuditLog 查到。

## 15. 当前版本与目标版本差异

| 能力 | 当前版本 | 目标 Phase A |
| --- | --- | --- |
| 登录 | 单个环境变量密码 | 数据库用户、哈希密码、角色、会话 |
| 产品存储 | `products.json` | PostgreSQL |
| 图片 | 手工填写 URL | 本地选择上传到 R2、多图排序 |
| 文档 | 不支持 | PDF 规格书、手册、认证文件 |
| 发布流程 | 保存即上线 | 草稿、预览、发布、归档 |
| 操作记录 | 无 | AuditLog |
| 并发修改 | 可能覆盖 | 版本检查与冲突提示 |
| 备份 | 手工复制 JSON | 数据库和对象存储自动备份 |

## 16. 不纳入当前后台的范围

本阶段仍不自建：

- 购物车和结账。
- 信用卡数据处理。
- 订单履约和库存系统。
- ERP/仓库系统。

支付继续使用 Stripe Payment Links。未来实际出现库存和订单管理需求时，再评估接入 Shopify、Stripe Checkout + Webhook 或专门的订单系统。

## 17. 已实现的基础设施

当前代码库已完成 Phase A 的数据库和文件存储基础：Prisma 数据模型、管理员创建脚本、旧产品 JSON 的导入脚本、R2/S3 预签名上传 API，以及后台产品编辑器中的图片和 PDF 文件选择器。

在尚未配置 `DATABASE_URL` 时，既有产品后台继续使用 `data/products.json`，避免已有站点无法登录或编辑产品。启用数据库和对象存储后，文件会进入媒体库表；图片上传完成后会自动填入当前产品的主图片地址。

### 数据库初始化

服务器安装 PostgreSQL 后创建独立账户和数据库：

```bash
sudo -u postgres psql
CREATE USER lumayard WITH PASSWORD 'replace-with-a-long-random-password';
CREATE DATABASE lumayard OWNER lumayard;
\\q
```

在 `.env` 设置 `DATABASE_URL` 后执行：

```bash
npm run prisma:push
npm run admin:create -- owner@example.com 'a-long-unique-admin-password' 'Site Owner'
npm run products:import
```

当前首次部署使用 `prisma db push` 创建基线表；后续引入已提交的 Prisma 迁移后，生产服务器执行：

```bash
npx prisma migrate deploy
```

### R2/S3 配置

创建私有 bucket，创建仅限该 bucket 的读写 API token，并设置一个用于公开读取媒体文件的域名，例如 `https://media.example.com`。把该域名和对象存储的 endpoint、bucket、access key、secret key 填入 `.env.example` 中对应的 `S3_` 变量。不要把 API token、数据库密码或 `.env` 提交到 Git。

对象存储 CORS 至少允许站点域名对 `PUT`、`GET` 的访问，并允许 `Content-Type` 请求头。开发时也要加入 `http://localhost:3000`。

## 18. 产品分类

产品目录面向园林与户外场景，当前支持：太阳能灯、便携灯、隐私与结构、围栏与栅栏、庭院照明、园林机器人、用户储能、园林工具和其他园林产品。新增产品时应选择最贴近主要用途的分类，具体型号、材质和功能写入产品描述与规格字段。
