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
ADMIN_PASSWORD=replace-with-a-long-random-password
ADMIN_SESSION_SECRET=replace-with-a-different-random-secret
```

`.env` 不要提交到 Git。还要把 `data/products.ts` 中的 Stripe 占位链接替换成真实 Payment Links。

后台地址为 `/admin`。请务必设置 `ADMIN_PASSWORD` 和 `ADMIN_SESSION_SECRET`，并使用足够长的随机值。服务器进程需要对 `data/products.json` 所在目录有写权限，后台保存产品时会直接更新该文件。

登录后台后可以新增、编辑、删除产品；保存后前台商品页会动态读取最新数据，不需要重新构建。

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
