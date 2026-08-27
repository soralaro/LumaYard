# LumaYard 当前进度与待办

> 更新时间：2026-08-25
> 当前阶段：Phase 1 MVP 前端基础版本
> 当前分支：`main`

## 一、当前完成情况

### 1. 项目基础

- [x] 初始化 Next.js App Router 项目
- [x] 配置 TypeScript、Tailwind CSS、ESLint
- [x] 配置 DM Sans + Playfair Display 品牌字体
- [x] 设置 LumaYard 品牌色彩和基础全局样式
- [x] 安装 `resend` 和 `@radix-ui/react-slider`，为后续功能预留依赖
- [x] 保留自有 VPS + Nginx + PM2 的部署方向

### 2. 首页 MVP

首页已完成第一版高保真品牌页面，包含：

- [x] 顶部公告栏
- [x] 响应式导航和移动端菜单
- [x] Hero 庭院场景图、品牌文案和主要 CTA
- [x] Shop by Space：Backyard、Garden、Patio、Deck
- [x] Featured Collections：Solar lighting、Portable light、Privacy & structure
- [x] 品牌故事区块
- [x] Shop the Look 场景热点展示
- [x] Outdoor Planner 入口和空间选择交互
- [x] 品牌卖点区：Solar、USB-C、Weatherproof、Durability
- [x] Ideas / Journal 内容卡片
- [x] 项目咨询 CTA
- [x] 页脚导航和邮件订阅视觉入口

### 3. 单品购买和咨询路径

- [x] `/shop` 产品列表页
- [x] `/products/[handle]` 产品详情页
- [x] 静态产品数据类型和示例数据
- [x] Stripe Payment Link 按钮占位
- [x] WhatsApp 项目咨询链接
- [x] `/contact` 联系表单页面
- [x] `/api/contact` 联系表单 API 路由
- [x] Resend 邮件发送逻辑（配置 API Key 后启用）
- [x] 没有引入自建购物车、订单库和库存系统，符合当前业务模式

### 4. 当前验证结果

- [x] `npm run build` 通过
- [x] TypeScript 检查通过
- [x] 静态页面生成通过
- [x] 产品详情页生成 3 个示例产品路由
- [x] `npm run lint` 无错误
- [x] 首页、商品列表和商品详情图片已迁移到 `next/image`，并配置 Unsplash 远程图片域名
- [x] 增加加载中、错误、404、sitemap、robots、Open Graph 和 Product 结构化数据
- [x] 联系表单增加客户端状态、服务端字段校验、蜜罐字段和基础限流
- [x] 补充 About、Shipping、Returns、Privacy、Terms 页面及 `.env.example`
- [x] 增加 `/admin` 密码登录、产品新增/编辑/删除和 JSON 产品存储
- [x] 使用 Node.js 20.20.2 + `next build --webpack` 完成生产构建验证；受限环境下 Turbopack 仍会触发端口权限错误

当前构建路由：

```text
/                         首页
/shop                     产品列表
/products/[handle]        产品详情
/contact                  联系页面
/api/contact              联系表单接口
```

## 二、尚未完成的工作

### A. Phase 1 MVP 必须补齐

- [ ] 将示例图片替换为正式品牌图片，并统一图片授权和存储策略
- [ ] 将示例 Stripe URL 替换为真实 Payment Links
- [ ] 配置真实的 `WHATSAPP_NUMBER`
- [ ] 配置 Resend 域名、发件地址、收件地址和 API Key
- [ ] 补充 `.env.example` 和生产环境变量说明
- [ ] 联系表单成功页、失败页和提交中状态
- [ ] 增加服务端表单限流、基础防垃圾提交和字段校验
- [ ] 增加 `loading.tsx`、`error.tsx` 和 404 页面体验
- [ ] 补充 About、Shipping、Returns、Privacy、Terms 页面
- [ ] 把产品数据从当前 TypeScript 示例数据扩展为正式 JSON 数据
- [ ] 为正式产品补充规格、尺寸、材质、安装方式和询价信息
- [ ] 增加 Open Graph 图片、favicon/品牌图标和基础结构化数据
- [ ] 增加 `sitemap.ts` 和 `robots.ts`
- [ ] 把远程图片迁移到 VPS 或 Cloudflare R2，并配置 `next.config.ts` 图片域名
- [ ] 使用 `next/image` 优化首屏和产品图片
- [ ] 在桌面端和移动端完成真实浏览器视觉验收

### B. Phase 2 品牌特色功能

- [ ] 独立的 Shop by Space 页面和空间筛选逻辑
- [ ] 独立的 Shop the Look 页面
- [ ] 真实热点点击、产品弹层和咨询跳转
- [ ] Day / Night 图片对比滑块
- [ ] Ideas 博客列表和文章详情页
- [ ] MDX 内容加载和文章 SEO 元数据
- [ ] 邮件订阅真正接入 Resend Audiences
- [ ] 产品页 Complete the Look 推荐逻辑
- [ ] Umami 或 Google Analytics 事件埋点

### C. Phase 3 Planner 和 AI

- [ ] 完整 Planner 多步骤问卷
- [ ] `/api/planner` 规则引擎
- [ ] 根据空间、面积和目标输出产品组合
- [ ] 将完整方案生成 WhatsApp 消息或邮件
- [ ] 图片上传接口和文件大小/类型限制
- [ ] Claude Vision 图片分析
- [ ] 从图片分析结果回填 Planner
- [ ] Outdoor Plan PDF 输出
- [ ] API Key、费用、超时和错误兜底策略

### D. 上线与运营

- [ ] VPS 安装 Node.js 20、PM2、Nginx
- [ ] 配置域名 DNS 和 HTTPS / Certbot
- [ ] 配置生产环境变量
- [ ] 配置 PM2 启动、日志和自动重启
- [ ] 添加 GitHub Actions SSH 部署流程
- [ ] 增加备份和回滚流程
- [ ] 增加安全响应头、CSP 和请求日志策略
- [ ] 完成 Stripe、Resend、WhatsApp 真实链路测试
- [ ] 完成移动端、桌面端和主要浏览器验收
- [ ] 上线前补充隐私、退款、运输和咨询服务条款

## 三、当前实现边界

这一阶段的代码是可运行的品牌 MVP 前端，不是完整电商系统：

- 产品数据目前是少量演示数据。
- 支付按钮需要替换成真实 Stripe Payment Links 才能收款。
- 联系邮件只有在配置 Resend 环境变量后才会真正发出；未配置时接口仍可完成开发环境提交响应。
- 远程 Unsplash 图片用于原型展示，不能直接视为最终商业素材。
- 目前没有数据库、账号系统、购物车、订单管理或库存管理。
- `next` 当前使用脚手架安装的 16.x 版本；正式部署前应根据项目目标确认 Next.js 版本并锁定升级策略。

## 四、建议的下一阶段顺序

1. 准备正式品牌图片、产品资料和真实 Stripe Payment Links。
2. 配置 Resend、WhatsApp 和生产环境变量，完成咨询/邮件链路测试。
3. 补齐 SEO、法律页面和基础安全配置。
4. 完成 Shop by Space、Shop the Look、Day/Night 和 Ideas 页面。
5. VPS 部署并做真实设备验收，再开始 Planner 规则引擎。
