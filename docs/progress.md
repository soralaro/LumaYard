# LumaYard 当前进度与待办

> 更新时间：2026-09-02  
> 当前阶段：Phase 1 MVP 方案咨询型首页  
> 当前分支：`main`

## 一、当前完成情况

### 1. 项目基础

- [x] Next.js 16 + App Router + TypeScript + Tailwind CSS v4
- [x] DM Sans + Playfair Display 品牌字体
- [x] LumaYard 品牌色彩系统（森林绿、金色、奶油色）
- [x] 安装 `resend` 和 `@radix-ui/react-slider`
- [x] 保留自有 VPS + Nginx + PM2 的部署方向

### 2. 首页架构（2026-09-02 重构）

**核心调整：从"产品陈列型"重构为"方案咨询型"**

- [x] Hero：强调"Transform Your Outdoor Space"和完整解决方案
- [x] How We Work：3步流程可视化（Listen → Design → Deliver）
- [x] **Featured Solutions**：3个完整场景方案，展示围栏+灯光+工具组合和总价
- [x] Shop by Space：Backyard、Garden、Patio、Deck
- [x] **Product Lines**：4条产品线完整展示（Fences为核心）
  - Fences & Privacy（核心产品线）
  - Garden Lighting（太阳能和便携式）
  - Garden Robotics（智能割草机）
  - Home Energy（太阳能+储能系统）
- [x] Shop the Look：真实场景组合案例
- [x] **AI Planner CTA**：视觉放大，强化咨询转化
- [x] Why LumaYard：4个品牌价值点
- [x] Ideas / Journal 内容卡片
- [x] 项目咨询 CTA
- [x] 页脚导航和邮件订阅

### 3. 产品数据结构（2026-09-02 更新）

- [x] 4条产品线的类型定义：`fences | lighting | robotics | energy`
- [x] 7个示例产品：
  - 2个围栏产品（隐私围栏、装饰性花园围栏）
  - 3个照明产品（太阳能围栏灯、便携灯、路径灯）
  - 1个机器人割草机
  - 1个家庭储能系统
- [x] Stripe Payment Link 占位（小件产品）
- [x] WhatsApp 咨询链接（大件和定制产品）
- [x] 价格范围：$45 - $8,999

### 4. 页面路由

- [x] `/` 首页（方案咨询型）
- [x] `/shop` 产品列表页
- [x] `/products/[handle]` 产品详情页（7个静态路由）
- [x] `/contact` 联系表单页面
- [x] `/api/contact` 联系表单 API 路由
- [x] `/about` `/privacy` `/terms` `/shipping` `/returns` 基础页面
- [x] `/robots.txt` `/sitemap.xml` SEO 文件

### 5. 当前验证结果

- [x] `npm run build` 通过
- [x] TypeScript 检查通过
- [x] 静态页面生成 21 个路由
- [x] 产品详情页生成 7 个产品路由
- [x] 删除了不符合 MVP 定位的 admin 系统

## 二、与品牌定位文档的对齐情况

参照 `docs/brand-and-product-positioning.md`：

| 定位要求 | 当前状态 | 说明 |
|---------|---------|------|
| 围栏为核心产品 | ✓ 已对齐 | Featured Solutions 和 Product Lines 都以围栏为主 |
| 5条产品线 | ⚠️ 4/5完成 | 缺失"Garden Tools"（可与Robotics合并） |
| 场景方案展示 | ✓ 已实现 | Featured Solutions 展示组合方案和总价 |
| 咨询优先转化 | ✓ 已实现 | AI Planner CTA 视觉放大，WhatsApp 咨询入口明确 |
| "Transform Your Outdoor Space" | ✓ 已实现 | Hero 文案和品牌定位一致 |
| Pool/Driveway 场景 | ✗ 未实现 | Shop by Space 只有 4 个场景 |

## 三、尚未完成的工作

### A. Phase 1 MVP 必须补齐

- [ ] **围栏产品图片**：从 fencefactory.com 获取真实产品图
- [ ] 将远程 Unsplash 图片替换为正式品牌图片
- [ ] 将示例 Stripe URL 替换为真实 Payment Links
- [ ] 配置真实的 `WHATSAPP_NUMBER`
- [ ] 配置 Resend 域名、发件地址、收件地址和 API Key
- [ ] 补充 `.env.example` 和生产环境变量说明
- [ ] 联系表单成功页、失败页和提交中状态
- [ ] 增加服务端表单限流和字段校验
- [ ] 补充产品数据：将当前 7 个示例扩展为 20-30 SKU
- [ ] 为正式产品补充规格、尺寸、材质、安装方式
- [ ] 增加 Open Graph 图片、favicon 和结构化数据
- [ ] 使用 `next/image` 优化首屏和产品图片
- [ ] 在桌面端和移动端完成真实浏览器视觉验收

### B. Phase 2 品牌特色功能

- [ ] 独立的 Shop by Space 页面和筛选逻辑
- [ ] 独立的 Shop the Look 页面
- [ ] 真实热点点击、产品弹层
- [ ] Day / Night 图片对比滑块
- [ ] Ideas 博客列表和文章详情页
- [ ] MDX 内容加载
- [ ] 邮件订阅接入 Resend Audiences
- [ ] 产品页 Complete the Look 推荐
- [ ] Umami 或 Google Analytics 埋点

### C. Phase 3 Planner 和 AI

- [ ] 完整 Planner 多步骤问卷
- [ ] `/api/planner` 规则引擎
- [ ] 根据空间、面积和目标输出产品组合
- [ ] 将完整方案生成 WhatsApp 消息或邮件
- [ ] 图片上传接口
- [ ] Claude Vision 图片分析
- [ ] Outdoor Plan PDF 输出

### D. 上线与运营

- [ ] VPS 安装 Node.js 20、PM2、Nginx
- [ ] 配置域名 DNS 和 HTTPS / Certbot
- [ ] 配置生产环境变量
- [ ] 配置 PM2 启动、日志和自动重启
- [ ] 添加 GitHub Actions SSH 部署流程
- [ ] 完成 Stripe、Resend、WhatsApp 真实链路测试
- [ ] 完成移动端、桌面端浏览器验收

## 四、2026-09-02 重构总结

### 主要变更

1. **信息架构调整**：从"产品陈列型"重构为"方案咨询型"
2. **新增 Featured Solutions 区块**：展示完整场景组合方案和总价
3. **新增 How We Work 区块**：3步流程可视化，强化咨询定位
4. **AI Planner CTA 视觉放大**：从中后部提升到独立大区块
5. **产品线扩展**：从3条扩展到4条，覆盖围栏、灯光、机器人、储能
6. **产品数据更新**：新增围栏、机器人割草机、家庭储能产品
7. **删除 admin 系统**：移除不符合当前 MVP 定位的后台管理功能

### 技术债务

- 远程图片未迁移到自有服务器
- 图片未使用 `next/image` 优化
- 产品数据仍是演示数据，需扩展为 20-30 SKU
- 支付和咨询链接是占位 URL

## 五、建议的下一阶段顺序

1. **准备围栏产品素材**：从 fencefactory.com 或供应商获取真实产品图
2. **扩展产品数据**：将 7 个示例扩展为 20-30 SKU，补充完整规格
3. **配置真实服务**：Resend、WhatsApp、Stripe Payment Links
4. **图片优化**：迁移到自有服务器，使用 `next/image`
5. **VPS 部署**：完成 Nginx、PM2 配置和真实设备验收
6. **Phase 2 功能**：Shop the Look、Day/Night、Ideas 页面
7. **Planner 规则引擎**：开始 Phase 3 AI 功能
