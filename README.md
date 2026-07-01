# 元素周期表速记图谱

初高中元素周期表交互学习页，部署于 `https://qiway.site/ptoe/`。

## 目录结构

```text
frontend/          静态页面（周期表 + 登录页 + Admin）
backend/           Fastify 鉴权 API
deploy/            Nginx 与 env 示例
docker-compose.prod.yml
```

## 本地开发

### 仅前端（无鉴权）

```bash
cd frontend
python3 -m http.server 8080
# 打开 http://127.0.0.1:8080/index.html
```

### 完整栈（Docker）

```bash
cp deploy/env.example .env.prod
# 编辑 .env.prod 填写 PTOE_POSTGRES_PASSWORD / SESSION_SECRET / ADMIN_TOKEN

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod exec ptoe_api npm run db:push
```

本地访问：`http://127.0.0.1:3040/ptoe/`

## 生产部署（宝塔 qiway.site）

1. 服务器拉代码：`cd /opt/periodic-table && git pull`
2. 配置 `.env.prod`（首次）
3. 启动：`docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build`
4. 建表（首次）：`docker compose -f docker-compose.prod.yml --env-file .env.prod exec ptoe_api npm run db:push`
5. 宝塔 **删除** 原 `/ptoe/` 的 `alias`，改为反代：

```nginx
location /ptoe/ {
    proxy_pass http://127.0.0.1:3040/ptoe/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 管理授权码

### Web Admin

登录后顶部导航可切换：

| 页面 | 地址 |
|------|------|
| 授权码 | `/ptoe/admin/` |
| 在线设备 | `/ptoe/admin/sessions.html` |
| 激活日志 | `/ptoe/admin/logs.html` |

使用 `.env.prod` 中的 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 登录。

### CLI

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod exec ptoe_api npm run admin:create-code -- --note "微信-张三" --devices 2
```

## 授权规则（v0.3）

- 每码 2 台设备；Cookie 90 天；30 天无访问释放设备位
- 授权码格式 `PTOE-XXXX-XXXX`，验证不区分大小写
- `/ptoe/` 下静态资源全部鉴权，未登录跳转 `/ptoe/login`

详细设计见 `docs/ACCESS_CONTROL.md`。
