# 访问控制设计（v0.3 已实现）

## 架构

- `ptoe_web`（3040）：Nginx + 静态文件 + `auth_request`
- `ptoe_api`（3041）：Fastify + PostgreSQL
- 宝塔：`/ptoe/` 反代到 `127.0.0.1:3040/ptoe/`

## 已确认参数

| 项 | 值 |
|----|-----|
| 设备位 | 1 |
| Cookie | 90 天固定（访问不续期，下期） |
| 空闲释放 | 30 天无访问，verify 时懒清理 |
| 授权码 | `PTOE-XXXX-XXXX`，不区分大小写 |
| Admin | 用户名密码（`.env.prod`） |
| 限流 | 每 IP 每分钟 5 次失败 |

## API

| 路径 | 说明 |
|------|------|
| `POST /ptoe/api/login` | 激活 |
| `POST /ptoe/api/logout` | 解绑本机 |
| `GET /ptoe/api/session/status` | 会话状态 |
| `GET /ptoe/api/verify` | Nginx 内部鉴权 |
| `GET /ptoe/api/config/public` | 登录页公开配置 |
| `/ptoe/api/admin/*` | 管理接口 |

## 下期

- 访问时 Cookie 滚动续期
- 定时清扫 cron
- 微信支付自动发卡
