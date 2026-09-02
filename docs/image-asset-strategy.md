# LumaYard 图片资源策略

> 更新时间：2026-09-02
> 状态：MVP 阶段使用占位图，生产阶段需替换

## 一、当前图片来源

### 1. Unsplash（临时占位）
当前使用 Unsplash 高质量图片作为原型展示：
- 围栏场景图
- 花园和庭院场景
- 灯光效果图
- 户外生活场景

**优点：**
- 高质量、免费商用
- 快速原型展示
- 无需授权费用

**限制：**
- 非品牌专属图片
- 不能展示真实产品细节
- 需要在正式上线前替换

### 2. 产品图片需求清单

#### Fences & Privacy（8个产品）
1. Premium Privacy Fence Panel 6ft - 需要正面、安装效果、细节图
2. Premium Privacy Fence Panel 8ft - 需要正面、高度对比图
3. Decorative Garden Fence (Picket) - 需要花园场景图
4. Modern Horizontal Slat Fence - 需要现代庭院场景
5. Lattice Privacy Screen - 需要藤蔓植物场景
6. Bamboo-Style Fence Panel - 需要热带风格场景
7. Steel Post & Wire Fence Kit - 需要简约花园场景
8. Planter Box Fence Combo - 需要种植场景图

#### Garden Lighting（8个产品）
9. Solar Fence Light - 需要夜景效果图
10. LumaGo Portable Lamp - 需要餐桌场景图
11. Solar Pathway Light - 需要花园小路夜景
12. Solar Spotlight - 需要树木照明效果
13. Solar String Lights - 需要露台夜景
14. Wall-Mounted Solar Sconce - 需要墙面安装效果

#### Garden Robotics（2个产品）
15. Smart Robotic Mower Lite - 需要产品图+工作场景
16. Smart Robotic Mower Pro - 需要产品图+大型草坪场景

#### Home Energy（2个产品）
17. Solar + Battery System 5kWh - 需要屋顶安装图+电池柜
18. Solar + Battery System 15kWh - 需要完整系统安装图

## 二、生产环境图片获取方案

### 方案 A：供应商提供（推荐）
1. 联系围栏、灯光、机器人、储能设备供应商
2. 获取产品高清图和授权使用协议
3. 要求提供多角度图片：
   - 产品正面图（白底）
   - 安装效果图（实景）
   - 细节特写图
   - 尺寸对比图

**预计成本：** 免费（供应商营销素材）  
**时间：** 1-2 周

### 方案 B：专业摄影（高端）
1. 雇佣商业摄影师
2. 拍摄真实产品和安装场景
3. 统一品牌视觉风格

**预计成本：** $2,000 - $5,000  
**时间：** 2-4 周

### 方案 C：购买商业图库（快速）
1. Shutterstock / Adobe Stock
2. 搜索围栏、户外灯光、机器人割草机
3. 购买商业授权

**预计成本：** $500 - $1,500  
**时间：** 1 周

### 方案 D：混合方案（平衡）
1. 核心产品（围栏）：供应商提供或专业摄影
2. 配套产品（灯光、机器人）：供应商素材
3. 场景图（庭院、花园）：商业图库

**预计成本：** $500 - $2,000  
**时间：** 2-3 周

## 三、图片规格要求

### 产品图片
- 格式：WebP（主）、JPEG（备用）
- 尺寸：1200×1200px（方形）或 1200×900px（横向）
- 分辨率：72-150 dpi
- 文件大小：< 200KB（WebP优化后）
- 背景：纯色或真实场景

### 场景图片
- 格式：WebP（主）、JPEG（备用）
- 尺寸：1920×1080px 或更大
- 分辨率：150 dpi
- 文件大小：< 500KB
- 风格：自然光、温暖色调、高质量

### 图标和装饰图
- 格式：SVG（矢量）
- 颜色：品牌色系
- 大小：可缩放

## 四、图片存储方案

### 开发阶段（当前）
- Unsplash 远程 URL
- next.config.ts 配置远程图片域名

### 生产阶段（推荐）
**方案 1：VPS 本地存储**
```
/var/www/lumayard/public/images/
├── products/
│   ├── fences/
│   ├── lighting/
│   ├── robotics/
│   └── energy/
├── scenes/
└── og/
```
- Nginx 直接服务静态文件
- 简单、无额外费用
- 需要备份策略

**方案 2：Cloudflare R2（推荐）**
- 类似 S3，但出站流量免费
- 全球 CDN 加速
- 自动图片优化
- 成本：$0.015/GB 存储

**方案 3：Cloudflare Images**
- 专业图片 CDN
- 自动 WebP/AVIF 转换
- 响应式图片变体
- 成本：$5/月 起

## 五、图片迁移检查清单

### 准备阶段
- [ ] 确定图片获取方案（供应商/摄影/图库/混合）
- [ ] 准备图片规格文档
- [ ] 联系供应商或摄影师
- [ ] 购买必要的商业授权

### 获取阶段
- [ ] 收集所有产品图片（20个产品）
- [ ] 收集场景图片（首页、Shop the Look）
- [ ] 收集 Open Graph 社交分享图
- [ ] 验证图片授权和版权

### 优化阶段
- [ ] 调整图片尺寸和裁剪
- [ ] 转换为 WebP 格式
- [ ] 压缩文件大小（保持质量）
- [ ] 生成多个尺寸变体（响应式）

### 部署阶段
- [ ] 上传图片到 VPS 或 R2
- [ ] 更新产品数据中的图片 URL
- [ ] 配置 CDN 缓存策略
- [ ] 测试所有页面图片加载
- [ ] 配置图片备份

### 验证阶段
- [ ] 验证所有图片加载正常
- [ ] 测试移动端图片性能
- [ ] 检查 Lighthouse 性能分数
- [ ] 验证 Open Graph 图片预览

## 六、当前 Unsplash 图片 URL 清单

需要替换的图片 URL：

### 产品图片
```
https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3  # 围栏 1
https://images.unsplash.com/photo-1591290619762-d6d4afe9e5d5  # 围栏 2
https://images.unsplash.com/photo-1494526585095-c41746248156  # 围栏 3
https://images.unsplash.com/photo-1534274988757-a28bf1a57c17  # 太阳能灯
https://images.unsplash.com/photo-1510798831971-661eb04b3739  # 便携灯
https://images.unsplash.com/photo-1558521958-0a228e77e984  # 花园灯
https://images.unsplash.com/photo-1558618666-fcd25c85cd64  # 割草机
https://images.unsplash.com/photo-1509391366360-2e959784a276  # 太阳能
```

### 场景图片
```
https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea  # Backyard
https://images.unsplash.com/photo-1600607687939-ce8a6c25118c  # Patio
https://images.unsplash.com/photo-1600585154340-be6161a56a0c  # Deck
https://images.unsplash.com/photo-1600607687920-4e2a09cf159d  # Shop the Look
https://images.unsplash.com/photo-1513506003901-1e6a229e2d15  # Ideas
```

## 七、建议行动计划

### 第 1 周
1. 联系围栏供应商获取产品图片和授权
2. 联系灯光、机器人、储能供应商
3. 评估是否需要购买图库补充

### 第 2 周
1. 收集所有产品图片
2. 图片优化和格式转换
3. 准备图片存储方案（R2 或 VPS）

### 第 3 周
1. 批量上传图片
2. 更新产品数据 URL
3. 测试和验证

### 第 4 周
1. 配置 CDN 和缓存
2. 性能测试和优化
3. 准备上线

**总预计时间：** 3-4 周  
**总预计成本：** $500 - $2,000（取决于方案选择）
