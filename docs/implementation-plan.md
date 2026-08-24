# LumaYard 实现方案

> 技术栈：Next.js 15 (App Router) + PostgreSQL + Stripe，部署在自有 VPS
> 目标：上线一个高端户外庭院品牌独立站，主要转化路径是咨询/邮件/WhatsApp，支持单品购买（Stripe 支付码），具备 AI Planner 扩展能力

---

## 业务模式说明

这个网站**不是传统电商商城**，而是：

- **主要转化**：访客 → 通过 WhatsApp / 邮件联系 → 定制报价 → 成交
- **次要转化**：单个小件产品（灯具套装）→ Stripe 支付链接直接购买
- **无需**：自建购物车系统、订单数据库、库存管理

这样零平台费用，维护极简，技术重心放在品牌展示和 AI Planner 上。

---

## 总体架构

```text
Browser
   ↓
Next.js 15 on VPS (Nginx 反代)
   ├── React Server Components (SEO + 快速首屏)
   ├── Client Components (Day/Night 滑块, Planner Wizard)
   └── API Routes
         ├── /api/contact     → 发送邮件 (Resend / Nodemailer)
         ├── /api/planner     → AI 推荐规则引擎
         └── /api/vision      → Claude Vision 图片分析 (Phase 3)
   ↓
外部服务（无自建后端数据库）
   ├── Stripe Payment Links  → 单品购买（不需要自建结账）
   ├── Resend / SendGrid     → 邮件通知
   └── WhatsApp Business API → 咨询跳转
```

## 技术栈

| 层         | 技术                                        |
| ---------- | ------------------------------------------- |
| 前端框架   | Next.js 15 (App Router)                     |
| 样式       | Tailwind CSS                                |
| 部署       | 自有 VPS + Nginx + PM2                      |
| 单品支付   | Stripe Payment Links（无需自建结账页）      |
| 联系/咨询  | WhatsApp Business 跳转链接 + 邮件表单       |
| 邮件发送   | Resend（免费 3000封/月）                    |
| 图片托管   | VPS 本地 或 Cloudflare R2（免费 10GB）      |
| AI Planner | Claude API (claude-opus-5)                  |
| 分析       | Umami（自托管，免费）或 Google Analytics    |

---

## Phase 0：品牌 & 环境准备（第 1～2 周）

### 0.1 品牌资产

- [ ] 确定品牌名 **LUMAYARD**，注册 lumayard.com
- [ ] 设计 Logo（SVG，深绿色 #1F3A32 版本 + 白色版本）
- [ ] 确认配色 Token：
  ```
  --color-primary:    #1F3A32  (Deep Forest Green)
  --color-bg:         #F7F5F0  (Warm White)
  --color-text:       #222222
  --color-accent:     #C89B5B  (Warm Gold)
  ```
- [ ] 字体：Playfair Display（标题）+ Inter（正文），通过 `next/font` 引入

### 0.2 VPS 环境配置

```bash
# 在 VPS 上安装 Node.js 20 + PM2 + Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
sudo apt-get install -y nginx
```

Nginx 反代配置 `/etc/nginx/sites-available/lumayard`:
```nginx
server {
    listen 80;
    server_name lumayard.com www.lumayard.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

SSL: `sudo certbot --nginx -d lumayard.com -d www.lumayard.com`

### 0.3 Stripe 配置（仅 Payment Links，无需自建结账）

- [ ] 注册 Stripe 账号
- [ ] 为每个单品创建 Payment Link（Dashboard → Products → Payment Links）
- [ ] Payment Link URL 直接放在产品页按钮上，用户点击跳转 Stripe 托管结账
- [ ] 在 Stripe Dashboard 配置成功/失败跳转回 lumayard.com

### 0.4 开发环境

```bash
npx create-next-app@latest lumayard --typescript --tailwind --app
cd lumayard
npm install @radix-ui/react-slider resend
npm install sharp  # 图片优化
```

`.env.local`:
```
RESEND_API_KEY=re_xxx
WHATSAPP_NUMBER=+1xxxxxxxxxx
CLAUDE_API_KEY=sk-ant-xxx   # Phase 3
NEXT_PUBLIC_SITE_URL=https://lumayard.com
```

产品数据存静态 JSON，不需要数据库：

```
/data/products.json    → 产品列表（含 stripe_payment_link 字段）
/data/looks.json       → Shop the Look 热点配置
/data/spaces.json      → Shop by Space 场景配置
```

---

## Phase 1：MVP 网站（第 3～6 周）

### 1.1 项目结构

```text
app/
├── page.tsx                      → 首页
├── shop/page.tsx                 → 全部产品
├── products/[handle]/page.tsx    → 产品详情 + Stripe 支付按钮
├── spaces/[space]/page.tsx       → Shop by Space
├── looks/page.tsx                → Shop the Look
├── ideas/page.tsx                → Blog 文章列表
├── ideas/[slug]/page.tsx         → 单篇文章（MDX）
├── plan/page.tsx                 → AI Planner
├── contact/page.tsx              → 联系表单
└── api/
    ├── contact/route.ts          → Resend 发邮件
    └── planner/route.ts          → 推荐规则引擎

components/
├── layout/   Navbar, Footer, AnnouncementBar
├── home/     HeroSection, ShopBySpace, FeaturedCollections,
│             DayNightSlider, ShopTheLook, WhyLumaYard, OutdoorIdeas
├── product/  ProductCard, ProductGallery, BuyButton (→ Stripe link)
└── planner/  PlannerWizard, PlannerResult

data/
├── products.json   ← 产品数据 + stripe_payment_link
├── looks.json      ← Shop the Look 热点
└── spaces.json     ← 场景页数据
```

### 1.2 产品数据格式（静态 JSON）

```json
{
  "handle": "solar-fence-light-8pack",
  "title": "Solar Fence Light — 8 Pack",
  "price": 69.99,
  "images": ["/products/solar-fence-8pack-1.jpg"],
  "features": ["solar", "usb-c", "waterproof", "auto-night"],
  "space_tags": ["backyard", "fence"],
  "stripe_payment_link": "https://buy.stripe.com/xxx",
  "whatsapp_inquiry": true
}
```

### 1.3 购买按钮逻辑

产品页有两个 CTA，按产品类型显示：

```typescript
// 单品（有 stripe_payment_link）
<a href={product.stripe_payment_link} target="_blank">
  Buy Now — ${product.price}
</a>

// 定制项目 / 大件
<a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in ${product.title}`}>
  Get a Quote on WhatsApp
</a>
<a href="/contact">Send Inquiry by Email</a>
```

### 1.4 联系表单 API

`app/api/contact/route.ts` — 收到表单后用 Resend 发邮件到你的邮箱：

```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// POST: { name, email, message, product? }
// → 发送到你的业务邮箱
// → 自动回复客户确认邮件
```

---

## Phase 2：品牌特色功能（第 7～10 周）

同前，重点：
- Day/Night 交互滑块（`clip-path` + Radix Slider）
- Shop the Look 热点（读 `data/looks.json`，点击热点 → 弹窗产品 + WhatsApp 跳转）
- Ideas 博客（MDX 文件，`next-mdx-remote`，SEO 文章）
- 邮件订阅（Resend Audiences）

---

## Phase 3：AI Planner（第 11～16 周）

问卷 Wizard → 规则引擎推荐产品列表 → 用户选择后：
- 有 Stripe 链接的产品 → 直接 Buy Now
- 定制项目 → 一键发 WhatsApp 完整 plan 给你

图片分析升级：上传院子照片 → Claude Vision → 自动填写 Planner → 输出推荐。

---

## VPS 部署流程

```bash
# 1. clone 项目
git clone git@github.com:xxx/lumayard.git
cd lumayard && npm install && npm run build

# 2. PM2 启动
pm2 start npm --name lumayard -- start
pm2 save && pm2 startup

# 3. Nginx + certbot（见 Phase 0）
```

CI/CD：GitHub Actions 在 push main 时 SSH 到 VPS 执行 `git pull && npm run build && pm2 restart lumayard`。

---

## 里程碑 checklist

| 里程碑               | 目标    | 标志                                     |
| -------------------- | ------- | ---------------------------------------- |
| Phase 0              | Week 2  | VPS 配置好，域名解析，Stripe 账号就绪     |
| Phase 1 MVP 上线     | Week 6  | 首页 + 产品页 + 联系/WhatsApp 流程跑通   |
| Phase 2 品牌功能     | Week 10 | Day/Night 滑块 + Shop the Look + 5篇博客 |
| Phase 3 Planner      | Week 16 | AI Planner 问卷上线                      |
| AI Vision beta       | Week 18 | 图片上传分析内测                         |
