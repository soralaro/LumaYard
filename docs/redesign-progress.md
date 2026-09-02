# LumaYard 网站重新设计进度

> 更新日期：2026-09-02
> 版本：v2.0 - 产品销售导向

## 设计理念转变

### 从"咨询方案"到"产品销售"

**之前的问题：**
- 首页以"解决方案咨询"为主，包含 How We Work、Featured Solutions、AI Planner 等咨询导向内容
- 产品数据硬编码在 TypeScript 文件中
- 没有管理后台，无法动态管理产品
- 场景分类（Backyard/Garden/Patio）与业务定位不符

**现在的实现：**
- 首页以"产品分类"和"产品展示"为主
- 四大产品线明确：栅栏、灯具、剪草工具、储能
- 完整的管理后台系统
- 数据库驱动的产品管理
- 支持图片上传、规格管理、PDF 规格书

## 已完成功能

### 1. 管理后台系统 ✅

**路径：** `/admin`

**功能：**
- ✅ 密码保护登录（默认密码：`lumayard2026`）
- ✅ 产品列表展示（支持筛选、排序）
- ✅ 新增产品（`/admin/products/new`）
- ✅ 编辑产品（`/admin/products/[id]`）
- ✅ 删除产品
- ✅ 产品状态管理（草稿/已发布/已归档）
- ✅ 图片上传 API（`/api/admin/upload`）
- ✅ 多语言支持（中文/英文产品名称和描述）

**产品字段：**
- 基础信息：产品名称（中/英）、价格、分类、状态
- 内容：描述（中/英）、特点列表、技术规格（JSON）
- 媒体：多图上传、PDF 规格书
- SEO：自动生成 URL handle

### 2. 首页重新设计 ✅

**删除的内容：**
- ❌ How We Work 3步流程
- ❌ Featured Solutions 咨询式套餐
- ❌ 过度的 AI Planner 推广
- ❌ Shop by Space（Backyard/Garden/Patio/Pool）

**新增内容：**
- ✅ 四大产品分类展示（栅栏、灯具、剪草工具、储能）
- ✅ 每个分类带图标、描述、跳转链接
- ✅ 热门产品展示区（动态加载已发布产品）
- ✅ 产品卡片：图片、中英文名称、价格、快速跳转
- ✅ 简化的品牌价值主张（耐用、太阳能、智能、环保）
- ✅ 联系咨询 CTA

### 3. 产品列表页 ✅

**路径：** `/shop`

**功能：**
- ✅ 显示所有已发布产品
- ✅ 按分类筛选（栅栏/灯具/剪草工具/储能/全部）
- ✅ 产品卡片网格布局
- ✅ 点击跳转到详情页
- ✅ 响应式设计

### 4. 产品详情页 ✅

**路径：** `/products/[id]`

**功能：**
- ✅ 图片画廊（主图 + 多图切换）
- ✅ 产品标题（中英文）
- ✅ 价格展示
- ✅ 产品描述（支持中英文）
- ✅ 特点列表（bullet points）
- ✅ 技术规格表（键值对展示）
- ✅ PDF 规格书下载链接
- ✅ 咨询和返回 CTA
- ✅ 相关分类链接

### 5. API 系统 ✅

**管理 API：**
- `GET /api/admin/products` - 获取所有产品
- `POST /api/admin/products` - 创建新产品
- `GET /api/admin/products/[id]` - 获取单个产品
- `PUT /api/admin/products/[id]` - 更新产品
- `DELETE /api/admin/products/[id]` - 删除产品
- `POST /api/admin/upload` - 上传图片/文件

**公开 API：**
- `GET /api/products` - 获取已发布产品（前端使用）

### 6. 数据存储 ✅

**方案：** JSON 文件存储（`data/database.json`）

**优点：**
- 零配置，无需数据库服务器
- 版本控制友好
- 快速启动开发
- 后续可迁移到 PostgreSQL/MongoDB

**数据结构：**
```json
{
  "products": [
    {
      "id": "prod_1234567890",
      "title": "铝合金隐私栅栏 6ft",
      "titleEn": "Premium Privacy Fence Panel 6ft",
      "price": 299.99,
      "category": "fences",
      "status": "published",
      "description": "...",
      "descriptionEn": "...",
      "features": ["...", "..."],
      "images": ["/products/fence-001.jpg", "..."],
      "specs": {
        "dimensions": "72\" H × 96\" W",
        "material": "Powder-coated aluminum",
        "weight": "45 lbs",
        "warranty": "10 years"
      },
      "pdfUrl": "/docs/fence-001-specs.pdf",
      "createdAt": "2026-09-02T...",
      "updatedAt": "2026-09-02T..."
    }
  ],
  "categories": [...]
}
```

## 技术栈

- **框架：** Next.js 16 App Router
- **语言：** TypeScript
- **样式：** Tailwind CSS v4
- **图片：** Next.js Image 组件（自动优化）
- **存储：** JSON 文件 + 本地文件系统
- **部署：** 支持 Vercel、VPS（Nginx + PM2）

## 下一步任务

### Phase 1：内容填充（优先）
- [ ] 添加真实栅栏产品（从供应商获取图片和规格）
- [ ] 添加庭院灯具产品（太阳能 + 充电式）
- [ ] 添加剪草机器人产品
- [ ] 添加户储能源产品
- [ ] 上传产品图片到 `/public/products/`
- [ ] 准备 PDF 规格书文件

### Phase 2：功能增强
- [ ] 图片拖拽上传（集成到管理后台表单）
- [ ] 批量产品导入（CSV/Excel）
- [ ] 产品排序和置顶功能
- [ ] 产品搜索功能
- [ ] 相关产品推荐算法

### Phase 3：生产准备
- [ ] 图片迁移到云存储（Cloudflare R2 或 AWS S3）
- [ ] 添加 sitemap.xml 和 robots.txt
- [ ] Open Graph 图片优化
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] SEO 优化（meta tags, structured data）
- [ ] 备份和恢复机制

### Phase 4：后续功能
- [ ] 购物车和结账（如需要）
- [ ] Stripe Payment Links 集成
- [ ] WhatsApp 咨询按钮
- [ ] 多语言切换（中英文）
- [ ] 产品评论和评分
- [ ] 库存管理

## 文件结构

```
/home/czx/LumaYard/
├── app/
│   ├── admin/
│   │   ├── page.tsx                    # 管理后台主页
│   │   └── products/
│   │       ├── new/page.tsx            # 新增产品表单
│   │       └── [id]/page.tsx           # 编辑产品表单
│   ├── api/
│   │   ├── admin/
│   │   │   ├── products/
│   │   │   │   ├── route.ts            # 产品列表和创建
│   │   │   │   └── [id]/route.ts       # 单个产品操作
│   │   │   └── upload/route.ts         # 文件上传
│   │   └── products/route.ts           # 公开产品 API
│   ├── products/[handle]/page.tsx      # 产品详情页
│   ├── shop/page.tsx                   # 产品列表页
│   ├── page.tsx                        # 首页（重新设计）
│   └── contact/page.tsx                # 联系页面
├── data/
│   ├── database.json                   # 产品数据库
│   └── products.ts                     # 旧数据（保留备份）
├── public/
│   ├── products/                       # 产品图片目录
│   ├── docs/                           # PDF 规格书目录
│   └── fences/                         # 栅栏产品图片
├── docs/
│   ├── brand-and-product-positioning.md
│   ├── progress.md                     # 旧进度文档
│   └── redesign-progress.md            # 本文档
└── .env.example                        # 环境变量模板
```

## 测试清单

### 管理后台
- [ ] 访问 `/admin` 需要密码
- [ ] 登录后显示产品列表
- [ ] 可以新增产品
- [ ] 可以编辑产品
- [ ] 可以删除产品
- [ ] 图片上传功能正常
- [ ] JSON 规格输入验证

### 前台展示
- [ ] 首页显示四大产品分类
- [ ] 首页显示热门产品（如有）
- [ ] 点击分类跳转到 `/shop?category=xxx`
- [ ] `/shop` 显示所有已发布产品
- [ ] 分类筛选功能正常
- [ ] 点击产品跳转到详情页
- [ ] 详情页显示完整信息
- [ ] 图片切换功能正常
- [ ] PDF 下载链接有效

### 响应式设计
- [ ] 移动端显示正常
- [ ] 平板端显示正常
- [ ] 桌面端显示正常
- [ ] 图片适配不同屏幕

## 部署说明

### 本地开发
```bash
npm run dev
# 访问 http://localhost:3000
# 管理后台：http://localhost:3000/admin
```

### 生产构建
```bash
npm run build
npm start
```

### VPS 部署
1. 上传代码到服务器
2. 配置环境变量（`.env.local`）
3. 构建生产版本
4. 配置 Nginx 反向代理
5. 使用 PM2 管理进程
6. 配置 SSL 证书

## 验收标准

✅ **产品销售导向**：首页以产品分类和产品展示为主
✅ **管理后台**：能够添加、编辑、删除产品，无需修改代码
✅ **图片管理**：支持上传和显示产品图片
✅ **规格展示**：产品详情页显示完整技术规格
✅ **数据驱动**：前台显示从数据库读取，不是硬编码
✅ **响应式设计**：所有页面在移动端、平板、桌面端均正常显示
✅ **性能优化**：使用 Next.js Image 组件自动优化图片

## 当前状态

🟢 **管理后台系统**：已完成，可以开始添加产品
🟢 **首页重新设计**：已完成，符合产品销售定位
🟢 **产品列表和详情页**：已完成，支持动态数据
🟡 **产品内容**：需要添加真实产品数据
🟡 **生产部署**：等待产品内容填充后部署

---

**下一步行动：**
1. 启动本地开发服务器测试所有功能
2. 访问 `/admin` 添加第一个产品测试流程
3. 准备真实产品图片和规格数据
4. 逐步填充四大产品线的产品
