# 🐟 闲鱼运营管理系统

<p align="center">
  <strong>一站式闲鱼店铺运营管理平台</strong><br/>
  热销品搜索 · 自动上新 · AI 智能回复 · 链接导入 · 多账号管理
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-6.0-blue" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-8-purple" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

---

## ✨ 功能概览

| 模块 | 说明 |
|------|------|
| 📊 **控制台** | 运营数据统计面板，销量趋势、账号状态、热销品速览 |
| 🔍 **热销品搜索** | 实时抓取闲鱼热销数据，按"想要人数"排序，一键加入上新队列 |
| 📦 **自动上新品** | 批量商品管理与自动发布，支持单个/批量上新、状态追踪 |
| 🔗 **链接导入** | 支持淘宝/1688/闲鱼/拼多多链接解析，自动提取商品信息并加价计算 |
| 🤖 **AI 智能回复** | 集成 OpenAI / 通义千问 / DeepSeek / Gemini，自动回复买家咨询 |
| 👤 **账号管理** | 多闲鱼账号绑定，Cookie 管理、在线状态监控、自动回复开关 |
| 📖 **开发文档** | 项目架构、API 接口、Docker 部署说明 |
| 📝 **使用说明** | 新手入门指南、功能说明与常见问题 |
| 🔄 **系统更新** | 自动检测 GitHub Release 新版本，一键更新 |

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/gs129003/xianyuyunying.git
cd xianyuyunying/xianyu-manager

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

### 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录下，可部署到任意静态服务器。

## 🐳 Docker 部署

### 快速启动

```bash
docker pull ghcr.io/gs129003/xianyuyunying:latest

docker run -d \
  -p 8080:8080 \
  --restart always \
  -v ./data:/app/data \
  --name xianyu-manager \
  ghcr.io/gs129003/xianyuyunying:latest
```

### Docker Compose

```yaml
version: "3.8"
services:
  xianyu-manager:
    image: ghcr.io/gs129003/xianyuyunying:latest
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
    restart: always
    environment:
      - TZ=Asia/Shanghai
```

### 访问信息

| 项目 | 地址 |
|------|------|
| Web 界面 | http://localhost:8080 |
| API 文档 | http://localhost:8080/docs |
| 健康检查 | http://localhost:8080/health |

> ⚠️ 首次登录默认账号密码：`admin / admin123`，请登录后立即修改！

## 🛠️ 技术架构

| 层级 | 技术选型 |
|------|----------|
| **前端框架** | React 19 + TypeScript 6 |
| **构建工具** | Vite 8 |
| **UI 样式** | Tailwind CSS v4 |
| **图标库** | Lucide React |
| **Markdown 渲染** | React Markdown |
| **HTTP 客户端** | Axios |
| **后端框架** | FastAPI + Python 3.11+ |
| **数据库** | SQLite 3 |
| **部署** | Docker + Docker Compose |

## 📁 项目结构

```
xianyuyunying/
├── xianyu-manager/
│   ├── src/
│   │   ├── api/                # API 服务层
│   │   │   ├── client.ts       # Axios 封装
│   │   │   └── index.ts        # API 接口定义
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 公共组件
│   │   │   ├── Header.tsx      # 顶部栏
│   │   │   └── Sidebar.tsx     # 侧边栏导航
│   │   ├── hooks/              # 自定义 Hooks
│   │   │   └── useApi.ts       # 通用请求 Hook（支持 Mock 降级）
│   │   ├── pages/              # 页面组件
│   │   │   ├── Dashboard.tsx   # 控制台
│   │   │   ├── HotSearch.tsx   # 热销品搜索
│   │   │   ├── AutoList.tsx    # 自动上新品
│   │   │   ├── LinkImport.tsx  # 链接导入
│   │   │   ├── AiReply.tsx     # AI 智能回复
│   │   │   ├── AccountManage.tsx # 账号管理
│   │   │   ├── ProductManage.tsx # 商品库管理
│   │   │   ├── DevDocs.tsx     # 开发文档
│   │   │   ├── UserDocs.tsx    # 使用说明
│   │   │   └── SystemUpdate.tsx # 系统更新
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript 类型定义
│   │   ├── App.tsx             # 应用入口
│   │   ├── App.css
│   │   ├── index.css           # 全局样式 + Tailwind
│   │   └── main.tsx            # 挂载入口
│   ├── public/                 # 公共静态文件
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── .gitignore
```

## 📡 API 接口

### 认证方式

```http
Authorization: Bearer <token>
```

### 主要接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| GET | `/api/hot-search` | 搜索热销品 |
| GET | `/api/hot-search/categories` | 获取分类列表 |
| GET | `/api/products` | 获取商品列表 |
| POST | `/api/products` | 新增商品 |
| POST | `/api/products/{id}/publish` | 上新单个商品 |
| POST | `/api/products/batch-publish` | 批量上新 |
| POST | `/api/link/parse` | 解析商品链接 |
| GET | `/api/accounts` | 获取账号列表 |
| GET | `/api/system/check-update` | 检查系统更新 |

完整 API 文档启动后访问：`http://localhost:8080/docs`

## 💡 使用指南

### 1. 配置闲鱼账号

1. 进入【账号管理】页面
2. 点击【添加账号】
3. 通过扫码或输入 Cookie 完成绑定
4. 绑定成功后开启监控开关

### 2. 搜索热销品

1. 进入【热销品搜索】
2. 输入关键词或选择分类
3. 系统按"想要人数"排序展示热销商品
4. 找到目标商品，点击【一键上新】

### 3. 自动上新商品

1. 进入【自动上新品】
2. 添加商品（手动填写或从热销品导入）
3. 选择待上新商品，点击【批量上新】
4. 系统自动发布，实时查看进度

### 4. 链接导入上新

1. 进入【链接导入】
2. 粘贴淘宝/1688/闲鱼/拼多多商品链接
3. 系统自动解析商品信息
4. 设置加价规则，一键上新

### 5. AI 智能回复

1. 进入【AI 智能回复】
2. 选择 AI 服务商（OpenAI / 通义千问 / DeepSeek / Gemini）
3. 配置 API Key
4. 设置回复规则和关键词
5. 在线测试回复效果

## ❓ 常见问题

**Q: 登录提示"账号或密码错误"？**
A: 默认账号密码为 `admin / admin123`，注意大小写。如已修改请使用新密码。

**Q: 热销品搜索一直加载中？**
A: 请检查网络连接，确认已配置闲鱼账号 Cookie，等待 10-30 秒数据抓取完成。

**Q: 上新失败？**
A: 检查 Cookie 是否过期、商品图片是否合规、描述是否包含敏感词。

**Q: 如何备份数据？**
A: 复制 `data/` 目录即可，包含所有商品数据和系统配置。

**Q: 更新后系统异常？**
A: 执行 `docker pull ghcr.io/gs129003/xianyuyunying:previous` 回滚到上一版本。

## 📄 License

MIT License

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gs129003">gs129003</a>
</p>
