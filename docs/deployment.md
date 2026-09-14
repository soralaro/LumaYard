# LumaYard 服务器部署

本文以 Ubuntu/Debian 为例，使用 Node.js 20、PM2 和 Nginx 部署。

## 1. 安装运行环境

```bash
ssh user@SERVER_IP
sudo apt update
sudo apt install -y git nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
node -v
```

Node.js 需要 `20.9+`。

## 2. 获取项目

```bash
sudo mkdir -p /var/www/lumayard
sudo chown -R "$USER":"$USER" /var/www/lumayard
git clone <你的仓库地址> /var/www/lumayard
cd /var/www/lumayard
```

也可以在本机使用 `scp -r /home/czx/LumaYard user@SERVER_IP:/var/www/lumayard` 上传。

## 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

```env
NEXT_PUBLIC_SITE_URL=https://你的域名.com
RESEND_API_KEY=re_xxx
CONTACT_FROM_EMAIL=LumaYard <hello@你的域名.com>
CONTACT_TO_EMAIL=你的收件邮箱
WHATSAPP_NUMBER=15551234567
# Legacy compatibility login. Keep during the database migration.
ADMIN_PASSWORD=replace-with-a-long-random-password
ADMIN_SESSION_SECRET=replace-with-a-different-random-secret
DATABASE_URL=postgresql://lumayard:replace-with-a-long-random-password@127.0.0.1:5432/lumayard?schema=public
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=lumayard
S3_ACCESS_KEY_ID=replace-with-r2-access-key
S3_SECRET_ACCESS_KEY=replace-with-r2-secret-key
# Optional. Without a custom media domain, the app serves R2 objects at /media/<key>.
# S3_PUBLIC_URL=https://media.你的域名.com
```

`.env` 不要提交到 Git。还要把 `data/products.ts` 中的 Stripe 占位链接替换成真实 Payment Links。

后台地址为 `/admin`。请务必设置 `ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET`，并使用足够长的随机值。服务器进程需要对 `data/products.json` 所在目录有写权限，后台保存产品时会直接更新该文件。

登录后台后可以新增、编辑、删除产品；保存后前台商品页会动态读取最新数据，不需要重新构建。

## 3.1 启用数据库与文件上传

产品 JSON 模式可立即使用；要启用图片/PDF 本地选择上传，需要 PostgreSQL 和兼容 S3 的对象存储（推荐 Cloudflare R2）。详细数据模型和安全约束见 [admin-system-design.md](admin-system-design.md)。

安装 PostgreSQL 并创建数据库：

```bash
sudo apt install -y postgresql
sudo -u postgres psql
CREATE USER lumayard WITH PASSWORD 'replace-with-a-long-random-password';
CREATE DATABASE lumayard OWNER lumayard;
\\q
```

填好 `DATABASE_URL` 后，在项目目录执行：

```bash
npm run prisma:push
npm run admin:create -- owner@example.com 'a-long-unique-admin-password' 'Site Owner'
npm run products:import
```

在 R2 创建仅限 `lumayard` bucket 读写权限的 API token，把 `.env` 中的 `S3_ENDPOINT`、`S3_BUCKET`、`S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY` 填完整。后台上传由服务端写入 R2，前台默认经 `/media/<key>` 安全读取，因此不需要把密钥、临时上传链接或 R2 `r2.dev` 域名暴露给浏览器。绑定 `media.你的域名.com` 后可选填 `S3_PUBLIC_URL` 让 CDN 直接提供媒体。随后后台可上传 JPEG、PNG、WebP、AVIF 图片或 PDF；图片上限 15 MB，PDF 上限 25 MB。

现有本地媒体迁移前先备份数据库和 `public/`。填好 R2 变量后执行 `npm run media:migrate-r2`。脚本只上传 `/uploads/`、`/products/`、`/categories/`、`/category-cover/` 下被数据库引用的文件，确认对象上传成功后才更新数据库 URL；不会删除任何本地文件，并可重复运行。

## 4. 构建并启动

```bash
npm ci
npx next build --webpack
pm2 start npm --name lumayard -- start -- -p 3000
pm2 save
pm2 startup
```

复制执行 `pm2 startup` 输出的命令，然后用 `pm2 status` 和 `pm2 logs lumayard` 检查。

## 5. 配置 Nginx

创建 `/etc/nginx/sites-available/lumayard`：

```nginx
server {
    listen 80;
    server_name 你的域名.com www.你的域名.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用：

```bash
sudo ln -s /etc/nginx/sites-available/lumayard /etc/nginx/sites-enabled/lumayard
sudo nginx -t
sudo systemctl reload nginx
```

没有域名时，把 `server_name` 改为服务器 IP，即可通过 `http://SERVER_IP` 访问。

## 6. HTTPS

DNS 指向服务器后执行：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com -d www.你的域名.com
sudo certbot renew --dry-run
```

本次 VPS 的 Nginx 运行在无 systemd 的容器中，不能使用 `systemctl reload nginx`；修改证书或配置后使用：

```bash
sudo nginx -t
sudo nginx -s reload
sudo certbot renew --dry-run
```

证书申请时将根域名和 `www` 一起加入（例如 `-d lumayard.me.uk -d www.lumayard.me.uk`）。若 DNS 使用 Cloudflare 代理，请在 Cloudflare 的 SSL/TLS 中选择 `Full (strict)`，确保 Cloudflare 到 VPS 的 HTTPS 连接也校验证书。容器没有 systemd 时，需由宿主机 cron/定时任务执行 `certbot renew`，续期后执行 `nginx -s reload`。

## 7. 更新与回滚

更新：

```bash
cd /var/www/lumayard
git pull
npm ci
npx next build --webpack
pm2 restart lumayard
```

回滚到指定提交：

```bash
git log --oneline -5
git checkout <正常提交>
npm ci
npx next build --webpack
pm2 restart lumayard
```

不要删除服务器上的 `.env` 文件。

## 8. 2026-09 实际 VPS 部署记录

本次美国 VPS 使用已有的容器/主机环境，没有新建 Docker。SSH 必须通过本机代理连接：

```bash
proxychains4 ssh -p 48322 lumayard@45.78.1.226
```

远端已有源码目录 `/home/lumayard/LumaYard`，生产目录是 `/var/www/lumayard`。部署时在生产目录切换到目标提交，并保留该目录已有的 `.env`：

```bash
cd /var/www/lumayard
git fetch origin
git checkout f744c17
```

不要用仓库文件覆盖生产 `.env`，也不要把数据库密码或 R2 密钥写进 Git。`.env` 至少应包含 `DATABASE_URL` 和完整的 `S3_*` 配置，权限设为 `600`。

### 数据库和初始化

本次在远端安装了 PostgreSQL，并创建独立的 `lumayard_app` 用户和 `lumayard` 数据库。端口是否可用必须先检查；如果 5432/5433 已被其他服务占用，就为 PostgreSQL 选择其他本机端口并同步修改 `DATABASE_URL`。

```bash
sudo pg_lsclusters
sudo ss -ltn | grep -E ':5432|:5433|:5434' || true
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
npm run products:import-admin
npm run categories:import
npm run admin:create -- owner@example.com 'strong-password' 'Site Owner'
```

### 低内存主机的安装和构建

本次主机约 1 GB 内存。普通 `npm ci` 会被 OOM 杀掉，因此先使用低内存安装，并确认主机有足够 swap（本次 VPS 使用约 937 MB swap）：

```bash
export NODE_OPTIONS=--max-old-space-size=256
npm ci --include=dev --omit=optional --ignore-scripts --no-audit --no-fund --install-strategy=shallow
```

`--omit=optional` 会跳过当前平台的 esbuild 二进制，构建或 `tsx` 导入时会报 `@esbuild/linux-x64` 缺失。安装完成后补齐它：

```bash
npm install --no-save --no-audit --no-fund @esbuild/linux-x64
npm install --no-save --package-lock=false --no-audit --no-fund lightningcss-linux-x64-gnu@1.32.0
```

`lightningcss-linux-x64-gnu` 是 Tailwind/Next CSS 构建所需的平台二进制，同样因为跳过 optional 依赖而需要补装。若之前的安装被中断并出现 `ENOTEMPTY`，先把残缺目录改名备份，再重新安装：

```bash
mv node_modules "node_modules.backup.$(date +%Y%m%d%H%M%S)"
npm ci --include=dev --omit=optional --ignore-scripts --no-audit --no-fund --install-strategy=shallow
```

构建时提高 Node 堆上限（实际值要低于容器可用内存，并确保有 swap）：

```bash
export NODE_OPTIONS=--max-old-space-size=700
NEXT_TELEMETRY_DISABLED=1 npx next build --webpack
```

只有构建成功后才重启线上进程。若构建失败，旧版本仍应保持运行。

### tmux 持久运行

长时间的安装、导入和构建必须放在远端 tmux 中，这样 SSH 断线不会终止任务：

```bash
tmux new -s lumayard       # 仅首次创建
tmux at -t lumayard
```

按 `Ctrl-b`、`d` 可分离会话；重新登录后再次 `tmux at -t lumayard` 查看进度。部署结束后可分离，不要杀掉该会话中的 shell。

### PM2 和 Nginx 切换

本次 Nginx 继续监听 80 端口并反代到 `127.0.0.1:3000`，只替换后面的 LumaYard PM2 进程，不删除 Nginx：

```bash
sudo pm2 list
sudo pm2 restart lumayard --update-env
sudo pm2 save
```

如果 PM2 中没有该应用，确认旧进程归属后再启动：

```bash
cd /var/www/lumayard
sudo pm2 start npm --name lumayard -- start -- -p 3000
sudo pm2 save
```

### 部署验收

```bash
curl -fsS -o /dev/null -w 'app:%{http_code}\n' http://127.0.0.1:3000/
curl -fsS -o /dev/null -w 'api:%{http_code}\n' http://127.0.0.1:3000/api/products
curl -fsS -o /dev/null -w 'nginx:%{http_code}\n' http://127.0.0.1/
proxychains4 curl -fsS -o /dev/null -w 'external:%{http_code}\n' http://45.78.1.226/
```

本次验收结果为应用首页、产品 API、Nginx 和外网地址均返回 `200`，PM2 已保存，源码提交为 `f744c17`。

## 9. 本地修改后更新云端

日常发布从本地 Git 推送开始。不要用 `scp` 覆盖整个生产目录，也不要把本地 `.env` 上传到服务器；云端的 `.env`、PostgreSQL 数据、R2 对象和 HTTPS 证书不由 Git 管理。

### 9.1 本地提交并推送

```bash
cd /home/czx/LumaYard
git status
git add <修改的文件>
git commit -m "describe the change"
git push origin main
git rev-parse --short HEAD
```

记下最后输出的提交号，下面以 `<新提交号>` 代替。

### 9.2 进入云端持久会话

SSH 必须使用代理；部署命令放在 tmux 中执行，网络中断后任务仍会继续：

```bash
proxychains4 ssh -tt -p 48322 lumayard@45.78.1.226 'tmux at -t lumayard'
```

如果会话尚未创建，先执行 `tmux new -s lumayard`；已有会话直接执行 `tmux at -t lumayard`。完成后按 `Ctrl-b`、`d` 分离，不要退出 tmux 中的 shell。

### 9.3 拉取、安装、构建并重启

在云端 tmux 中执行。先保存当前提交号，构建失败时可以回滚：

```bash
cd /var/www/lumayard
OLD_COMMIT=$(git rev-parse --short HEAD)
cp .env ".env.backup.$(date +%Y%m%d%H%M%S)"
git fetch origin
git checkout <新提交号>

export NODE_OPTIONS=--max-old-space-size=700
export XDG_CACHE_HOME=/tmp/lumayard-cache
npm ci --include=dev --omit=optional --ignore-scripts --no-audit --no-fund --install-strategy=shallow
npm install --no-save --no-audit --no-fund @esbuild/linux-x64
npm install --no-save --package-lock=false --no-audit --no-fund lightningcss-linux-x64-gnu@1.32.0
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
NEXT_TELEMETRY_DISABLED=1 npx next build --webpack

sudo pm2 restart lumayard --update-env
sudo pm2 save
echo "deployed $(git rev-parse --short HEAD), previous $OLD_COMMIT"
```

只有产品或分类数据文件发生变化时，才额外执行：

```bash
npm run products:import-admin
npm run categories:import
```

构建成功后才重启 PM2。若 `next build` 失败，不要重启，线上仍会继续运行旧进程。

#### Prisma 缓存和数据库同步说明

如果 Prisma 默认缓存目录不可写或挂载为只读，使用可写缓存目录执行生成和同步：

```bash
export XDG_CACHE_HOME=/tmp/lumayard-cache
./node_modules/.bin/prisma generate
./node_modules/.bin/prisma db push
```

不要用 Prisma 7 直接替换项目当前的 Prisma 6.19.3；当前 schema 使用的是 Prisma 6 格式。数据库同步成功后再执行 Next.js 构建。

### 9.4 发布后检查

```bash
curl -fsS -o /dev/null -w 'app:%{http_code}\n' https://www.lumayard.me.uk/
curl -fsS -o /dev/null -w 'api:%{http_code}\n' https://www.lumayard.me.uk/api/products
sudo pm2 status
sudo pm2 logs lumayard --lines 50
```

正常情况下首页和 API 返回 `200`，PM2 中 `lumayard` 为 `online`。外网检查失败时，先查看 `sudo pm2 logs lumayard --lines 100`，再检查 `sudo nginx -t`。

### 9.5 回滚到上一个版本

如果新版本验收失败，在云端执行上一步记录的旧提交号：

```bash
cd /var/www/lumayard
git checkout <上一个正常提交号>
export NODE_OPTIONS=--max-old-space-size=700
NEXT_TELEMETRY_DISABLED=1 npx next build --webpack
sudo pm2 restart lumayard --update-env
sudo pm2 save
```
