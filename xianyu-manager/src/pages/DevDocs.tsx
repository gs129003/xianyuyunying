import { useState } from 'react'
import { BookOpen, ChevronRight, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const sections = [
  {
    title: '项目概述',
    content: `# 📋 闲鱼运营管理系统 - 开发文档

## 项目简介

本系统仿照 [zhinianboke/xianyu-auto-reply](https://github.com/zhinianboke/xianyu-auto-reply) 开发，集成闲鱼平台运营所需的核心功能模块，包括热销品自动搜索、商品自动上新、智能回复等功能。

## 技术架构

| 层级 | 技术选型 |
|------|----------|
| **前端框架** | React 18 + TypeScript |
| **构建工具** | Vite 6 |
| **UI 样式** | Tailwind CSS v4 |
| **路由管理** | React Router DOM v7 |
| **HTTP 客户端** | Axios |
| **后端框架** | FastAPI + Python 3.11+ |
| **数据库** | SQLite 3 |
| **部署** | Docker + Docker Compose |

## 目录结构

\`\`\`
xianyu-manager/
├── src/
│   ├── components/      # 公共组件
│   │   ├── Sidebar.tsx  # 侧边栏导航
│   │   └── Header.tsx   # 顶部栏
│   ├── pages/           # 页面组件
│   │   ├── Dashboard.tsx    # 控制台
│   │   ├── HotSearch.tsx    # 热销品搜索
│   │   ├── AutoList.tsx     # 自动上新
│   │   ├── DevDocs.tsx      # 开发文档
│   │   ├── UserDocs.tsx     # 用户说明
│   │   └── SystemUpdate.tsx # 系统更新
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
└── package.json
\`\`\`
`,
  },
  {
    title: '核心功能模块',
    content: `# 🔧 核心功能模块说明

## 1. 热销品搜索模块

基于 Playwright 的真实数据抓取引擎，对闲鱼平台商品进行实时搜索并按"人想要"数量排序。

### 核心接口

\`\`\`python
# 搜索热销品
GET /api/hot-search?keyword=&category=&page=1&limit=20

# 返回格式
{
  "total": 100,
  "items": [
    {
      "rank": 1,
      "name": "商品名称",
      "want": 5432,        # 想要人数
      "avg_price": 850.0,
      "category": "运动鞋",
      "trend": "up"         # up/down/new
    }
  ]
}
\`\`\`

## 2. 自动上新模块

支持商品信息管理和一键自动发布到闲鱼平台。

### 核心接口

\`\`\`python
# 获取商品列表
GET /api/products?status=pending&page=1

# 创建商品
POST /api/products
{
  "name": "商品名",
  "price": 168.0,
  "category": "数码",
  "desc": "描述文字",
  "images": ["base64..."]
}

# 上新单个商品
POST /api/products/{id}/publish

# 批量上新
POST /api/products/batch-publish
{"ids": [1, 2, 3]}
\`\`\`

## 3. 系统更新模块

自动检查 GitHub Release 版本，发现新版本后提示并一键更新。

### 更新地址
- **更新仓库**: https://github.com/gs129003/xianyuyunying
- **检测接口**: GitHub API \`/repos/gs129003/xianyuyunying/releases/latest\`
`,
  },
  {
    title: 'Docker 部署',
    content: `# 🐳 Docker 部署指南

## 快速部署

\`\`\`bash
# 拉取最新镜像
docker pull ghcr.io/gs129003/xianyuyunying:latest

# 一键启动
docker run -d \\
  -p 8080:8080 \\
  --restart always \\
  -v ./data:/app/data \\
  --name xianyu-manager \\
  ghcr.io/gs129003/xianyuyunying:latest
\`\`\`

## Docker Compose 方式

\`\`\`yaml
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
\`\`\`

## 访问信息

| 项目 | 地址 |
|------|------|
| Web 界面 | http://localhost:8080 |
| API 文档 | http://localhost:8080/docs |
| 健康检查 | http://localhost:8080/health |

> ⚠️ 首次登录请立即修改默认密码 admin/admin123
`,
  },
  {
    title: 'API 接口文档',
    content: `# 📡 API 接口文档

## 认证方式

使用 JWT Bearer Token 认证：

\`\`\`http
Authorization: Bearer <token>
\`\`\`

## 接口列表

### 用户认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 退出登录 |
| GET  | /api/auth/me | 获取当前用户信息 |

### 热销品搜索

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | /api/hot-search | 搜索热销品 |
| GET  | /api/hot-search/categories | 获取分类列表 |
| POST | /api/hot-search/refresh | 强制刷新数据 |

### 商品管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | /api/products | 获取商品列表 |
| POST | /api/products | 新增商品 |
| PUT  | /api/products/{id} | 修改商品 |
| DELETE | /api/products/{id} | 删除商品 |
| POST | /api/products/{id}/publish | 上新单个 |
| POST | /api/products/batch-publish | 批量上新 |

### 系统更新

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | /api/system/version | 当前版本 |
| GET  | /api/system/check-update | 检查更新 |
| POST | /api/system/update | 执行更新 |
`,
  },
]

export default function DevDocs() {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState<number[]>([0])

  const toggle = (i: number) => {
    setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
    setActive(i)
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={24} color="#ff6b35" /> 开发文档
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>系统架构、API接口、部署说明等技术文档</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* TOC */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 12, height: 'fit-content' }}>
          <div style={{ fontSize: 12, color: '#64748b', padding: '4px 8px 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>目录</div>
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: active === i ? '#ff6b3520' : 'transparent',
                border: 'none', color: active === i ? '#ff6b35' : '#94a3b8',
                cursor: 'pointer', fontSize: 13, textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {expanded.includes(i) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {s.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: '#1e293b',
          borderRadius: 14,
          border: '1px solid #1e3a5f',
          padding: '28px 32px',
          minHeight: 500,
        }}>
          <div className="markdown-body" style={{ color: '#e2e8f0' }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #1e3a5f' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: 17, fontWeight: 600, color: '#f1f5f9', margin: '24px 0 10px' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 600, color: '#cbd5e1', margin: '18px 0 8px' }}>{children}</h3>,
                p: ({ children }) => <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 12, fontSize: 14 }}>{children}</p>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <code style={{ display: 'block', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: '#7dd3fc', fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.7, whiteSpace: 'pre' }}>
                      {children}
                    </code>
                  ) : (
                    <code style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 4, padding: '1px 6px', fontSize: 13, color: '#7dd3fc', fontFamily: 'monospace' }}>{children}</code>
                  )
                },
                pre: ({ children }) => <pre style={{ background: 'transparent', margin: '10px 0', padding: 0 }}>{children}</pre>,
                table: ({ children }) => <table style={{ width: '100%', borderCollapse: 'collapse', margin: '12px 0' }}>{children}</table>,
                th: ({ children }) => <th style={{ padding: '8px 14px', background: '#162032', color: '#94a3b8', fontSize: 12, textAlign: 'left', borderBottom: '1px solid #334155' }}>{children}</th>,
                td: ({ children }) => <td style={{ padding: '8px 14px', color: '#e2e8f0', fontSize: 13, borderBottom: '1px solid #1e3a5f' }}>{children}</td>,
                li: ({ children }) => <li style={{ color: '#94a3b8', fontSize: 14, lineHeight: 2 }}>{children}</li>,
                a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>{children}</a>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #ff6b35', paddingLeft: 16, margin: '12px 0', color: '#94a3b8' }}>{children}</blockquote>,
              }}
            >
              {sections[active].content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
