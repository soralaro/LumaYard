# LumaYard 通用内容资源库方案

> 更新时间：2026-09-14  
> 状态：规划文档，适用于 `Images-of-garden-lights.pdf` 及后续所有非商品内容

## 一、目标

产品页之外，网站需要一个可以持续增加内容的资源库，用来展示庭院灵感、选购指南和项目案例。内容不应绑定某个商品，也不应把 PDF 直接作为首页的一张商品图。

推荐的内容入口：

- `/ideas`：全部内容，支持按主题筛选
- 首页 `Featured ideas`：精选 3-6 条内容
- 导航中的 `Ideas` 或 `Inspiration`：进入内容库
- `/ideas/[slug]`：独立内容详情页

## 二、内容类型

所有内容共用一套 `ContentItem` 模型，通过 `type` 区分展示方式。

| 类型 | 用途 | 主要展示 |
| --- | --- | --- |
| `guide` | 选购、安装、维护指南 | 文章正文 + 图片/PDF 下载 |
| `inspiration` | 庭院和灯光灵感 | 大图画廊 + 简短说明 |
| `journal` | 品牌动态、季节性文章 | 文章正文 |
| `case_study` | 项目案例、改造前后 | 项目图片 + 方案说明 + 关联商品 |
| `lookbook` | 一组风格化图片 | 网格画廊 + 图片查看器 |
| `download` | PDF、规格表、安装手册 | 封面 + 在线预览 + 下载 |

首个资源 `Images-of-garden-lights.pdf` 建议建立为：

```text
type: download
category: Garden lighting
title: Images of garden lights
slug: images-of-garden-lights
```

如果 PDF 中有足够的说明文字，可额外建立一篇 `guide`，正文引用该下载资源，而不是复制维护两份文件。

## 三、后台内容字段

后台增加 `Content library` 页面，支持新建、编辑、预览、发布、下线和删除（删除前需确认）。建议字段如下：

### 基本信息

- `title`：标题
- `slug`：URL 标识，必须唯一
- `type`：内容类型
- `category`：如 Garden lighting、Privacy、Outdoor living
- `excerpt`：列表页摘要
- `body`：富文本或 Markdown 正文
- `status`：`draft`、`published`、`archived`
- `publishedAt`：发布时间
- `author`：作者或品牌名
- `seoTitle`、`seoDescription`、`ogImage`

### 媒体信息

- `coverAsset`：列表页和详情页封面
- `assets`：图片、视频、PDF 等资源列表
- `alt`：每个图片的无障碍描述
- `caption`：图片说明
- `sortOrder`：画廊顺序
- `downloadEnabled`：是否显示下载按钮

### 关联和运营

- `relatedProducts`：关联的商品 ID，可为空
- `relatedContent`：相关内容 ID
- `featured`：是否进入首页精选
- `tags`：用于筛选和推荐
- `locale`：语言，预留多语言支持

## 四、文件处理流程

### PDF

上传 PDF 后后台自动执行：

1. 校验格式、大小和页数。
2. 保存原始 PDF，保留原文件名和 MIME 类型。
3. 用 PDF 渲染器生成第一页封面图。
4. 按页生成 WebP 预览图（大图和缩略图两种尺寸）。
5. 在详情页显示页缩略图、当前页大图、上一页/下一页和下载原 PDF。
6. 记录 `pdf_view`、`pdf_download` 和单页 `asset_view` 事件。

文件较大时采用异步处理：先显示“处理中”，后台任务完成后再发布；转换失败时保留原 PDF并显示错误状态。

### 图片

- 保留原图作为归档文件。
- 自动生成 `thumb`、`card`、`detail` 三种 WebP/AVIF 变体。
- 使用响应式 `srcset`，避免列表页加载原图。
- 上传时要求填写 `alt`，缺失时后台标记为待完善。

### 视频和其他文件

- 视频建议保存封面图，正文使用兼容的在线播放 URL。
- 安装手册、规格表等文件沿用 `download` 类型。
- 不支持的格式只允许归档，不在前台展示。

## 五、Cloudflare R2 存储结构

R2 bucket：`lumayard`

```text
content/
  {content-id}/
    original/                 # 原始 PDF、图片或其他文件
    cover/                    # 内容封面
    pages/                    # PDF 每页预览图
    variants/
      thumb/
      card/
      detail/
```

数据库只保存对象 key、尺寸、MIME、文件大小、校验值和公开 URL；前台通过 R2 的公开域名或 Cloudflare CDN 读取。上传使用临时签名 URL，避免文件经过 Next.js 服务器中转。

## 六、前台页面设计

### `/ideas` 列表页

- 顶部使用简洁标题和一句定位文案。
- 以大留白的杂志式网格展示封面，卡片高度统一。
- 每项显示类型、标题、摘要和阅读/下载入口。
- 支持主题筛选、类型筛选和分页；草稿、归档不出现在公开列表。

### `/ideas/[slug]` 详情页

- 顶部显示内容类型、标题、摘要和发布日期。
- `guide`、`journal`、`case_study` 使用窄正文列，图片可穿插全宽展示。
- `lookbook` 使用宽画廊和灯箱查看器。
- `download` 显示封面、页数、文件大小、在线预览和下载按钮。
- 底部显示关联商品、相关内容和联系入口。

### 首页精选

后台勾选 `featured` 的内容进入首页；建议最多 6 项，并支持手动排序。没有精选内容时，该区块自动隐藏，不留下空白。

## 七、商品关联规则

内容与商品是多对多关系：一篇灯光指南可以关联多个灯具，一个商品也可以出现在多个指南或案例中。详情页只显示已发布商品；商品下架后保留内容，但隐藏失效商品卡片并在后台提示。

## 八、访问统计

资源库统计应记录所有访客，不要求登录。建议事件：

- `page_view`：内容详情页访问
- `asset_view`：图片或 PDF 页查看
- `pdf_download`：原始 PDF 下载
- `outbound_click`：跳转商品、邮件、WhatsApp 或社交平台
- `product_view_from_content`：从内容进入商品页

每条事件关联匿名 `visitorId`、时间、路径、来源页、UTM 参数、设备/浏览器、IP 哈希或受限原始 IP 字段和地理区域（国家/城市级别）。后台提供按内容、日期、来源地区、设备及关联商品的汇总，原始 IP 访问权限仅限管理员，并设置保留期限。

## 九、发布流程

```text
创建草稿 -> 上传媒体 -> 自动生成封面/预览 -> 预览
        -> 填写 SEO、alt、关联商品 -> 发布 -> 统计访问和下载
```

发布前检查：标题和 slug 唯一、封面存在、图片有 alt、PDF 可打开、移动端预览正常、下载权限符合设置。编辑已发布内容时保留更新时间；重要内容可增加版本号和修订记录。

## 十、推荐数据模型

```text
ContentItem
  id, slug, title, type, category, excerpt, body
  status, featured, publishedAt, author
  coverAssetId, seoTitle, seoDescription, createdAt, updatedAt

ContentAsset
  id, contentId, kind, objectKey, mimeType
  width, height, pageNumber, fileSize, alt, caption

ContentProduct
  contentId, productId, sortOrder

ContentEvent
  id, contentId, assetId, eventType, visitorId
  path, referrer, country, city, userAgent, ipHash, createdAt
```

## 十一、分阶段实施

### Phase 1：资源库基础

- [ ] 增加 `ContentItem`、`ContentAsset`、关联商品和事件表
- [ ] 后台支持草稿、封面上传、发布和排序
- [ ] 完成 `/ideas` 和详情页
- [ ] 先接入图片和普通 PDF 下载

### Phase 2：PDF 和 R2

- [ ] 配置 R2 bucket、公开域名和签名上传
- [ ] 增加 PDF 封面及逐页 WebP 生成
- [ ] 完成在线预览、下载和失败重试
- [ ] 迁移 `Images-of-garden-lights.pdf` 及其图片

### Phase 3：运营能力

- [ ] 首页精选和相关内容推荐
- [ ] 内容搜索、标签筛选和分页
- [ ] 访问、下载、商品点击统计报表
- [ ] SEO、Open Graph、站点地图和多语言字段

## 十二、验收标准

- 新增一种内容不需要修改首页布局代码。
- 管理员可在后台上传、预览、发布和下线内容。
- PDF 在桌面和手机上均可翻页，并能下载原文件。
- 前台不加载原图或原始 PDF 作为缩略图。
- 未发布内容不会被公开 URL 访问。
- 所有内容访问和下载都能在后台按时间、来源和内容查看。
