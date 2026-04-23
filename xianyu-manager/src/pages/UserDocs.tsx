import { useState } from 'react'
import { FileText, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const sections = [
  {
    title: '快速开始',
    content: `# 🚀 快速开始指南

## 欢迎使用闲鱼运营管理系统

本系统可帮助您高效管理闲鱼店铺，实现商品自动化运营。本文档将引导您完成基础配置和上手操作。

## 第一步：登录系统

1. 打开浏览器，访问系统地址（默认 http://localhost:8080）
2. 输入账号密码登录（默认：admin / admin123）
3. **首次登录后请立即修改密码！**

## 第二步：配置闲鱼账号

1. 点击左侧【账号管理】
2. 点击【添加账号】
3. 扫码或输入 Cookie 完成账号绑定
4. 绑定成功后开启监控开关

## 第三步：搜索热销品

1. 点击左侧【热销品搜索】
2. 输入关键词或选择分类
3. 点击搜索，系统会按"想要人数"排序展示
4. 找到目标商品，点击【一键上新】

## 第四步：自动上新商品

1. 点击【自动上新品】
2. 点击【添加商品】填写信息
3. 也可从热销品列表直接导入
4. 选择待上新商品，点击【批量上新】
`,
  },
  {
    title: '热销品搜索',
    content: `# 🔍 热销品搜索使用说明

## 功能介绍

热销品搜索模块通过抓取闲鱼平台真实数据，帮助您快速发现当前市场上最热门、最有销售潜力的商品。

## 界面说明

| 区域 | 功能 |
|------|------|
| 搜索框 | 输入关键词快速筛选 |
| 分类过滤 | 按商品分类缩小范围 |
| 热度排名 | 按"人想要"数量降序排列 |
| 趋势标识 | ↑上涨 ↓下跌 ★新品 |
| 一键上新 | 将商品加入上新队列 |

## 排名规则

- **想要人数越多 = 需求越旺盛 = 销售机会越大**
- 热度评分综合考虑：人气、价格区间、竞争度、趋势
- 建议优先选择 **评分 ≥ 85 + 趋势↑** 的商品

## 使用技巧

> 💡 **技巧一**：搜索大类词（如"耳机"），再用分类过滤缩小到具体细分品类

> 💡 **技巧二**：优先关注趋势为"新品"的商品，竞争少、利润空间大

> 💡 **技巧三**：每天早上 9:00 刷新一次，可获取当日最新热销数据
`,
  },
  {
    title: '自动上新品',
    content: `# 📦 自动上新品使用说明

## 功能介绍

自动上新品模块帮助您批量管理和发布商品到闲鱼平台，无需手动操作每一件。

## 添加商品

### 手动添加
1. 点击【添加商品】按钮
2. 填写：商品名称、价格、分类、描述
3. 上传商品图片（建议 3-8 张高质量图）
4. 点击【确认添加】

### 从热销品导入
1. 在热销品搜索页找到目标商品
2. 点击【一键上新】
3. 商品会自动进入上新队列，状态为"待上新"

## 上新操作

### 单个上新
- 找到状态为"待上新"的商品
- 点击右侧【上新】按钮
- 系统自动完成发布，状态更新为"已上新"

### 批量上新
- 点击页面顶部【批量上新】按钮
- 系统会将所有"待上新"商品依次自动发布
- 可在列表中实时查看每件商品的上传进度

## 上新建议

| 事项 | 建议 |
|------|------|
| 标题 | 包含核心关键词，不超过 30 字 |
| 价格 | 参考热销榜均价，低 5-10% 更易出单 |
| 图片 | 实物正面图、侧面图、细节图、品牌标签 |
| 描述 | 成色、使用情况、是否包邮、可否议价 |
`,
  },
  {
    title: '系统更新',
    content: `# 🔄 系统更新说明

## 更新来源

本系统的更新托管于 GitHub 仓库：
**https://github.com/gs129003/xianyuyunying**

## 自动检测

系统启动时会自动检测是否有新版本。您也可以在【系统更新】页面手动触发检测。

## 更新流程

1. 系统检测到新版本后，会弹出更新提示
2. 查看更新日志，了解新版本功能
3. 点击【立即更新】开始自动更新
4. 更新完成后，系统自动重启并生效

## 注意事项

> ⚠️ 更新前建议先备份 \`data/\` 目录下的数据

> ⚠️ 更新过程中请勿关闭浏览器或断开网络

> ✅ 所有更新均经过测试，数据结构变更会自动兼容迁移
`,
  },
  {
    title: '常见问题',
    content: `# ❓ 常见问题解答

## Q1: 登录时提示"账号或密码错误"

**A**: 请检查默认账号密码为 admin / admin123，注意字母大小写。如已修改过密码，请使用修改后的密码。

---

## Q2: 热销品搜索一直加载中

**A**: 可能原因：
1. 网络不稳定，请刷新重试
2. 服务器正在抓取数据，等待 10-30 秒
3. 检查系统是否已配置闲鱼账号 Cookie

---

## Q3: 上新失败，状态显示"失败"

**A**: 
- 检查闲鱼账号 Cookie 是否过期（重新绑定）
- 检查商品图片是否合规（不含水印、违禁内容）
- 确认商品描述不包含敏感词汇

---

## Q4: 如何备份我的数据？

**A**: 直接复制 \`data/\` 目录即可，包含所有商品数据和系统配置。

---

## Q5: 更新后系统打不开了怎么办？

**A**: 在终端执行以下命令回滚到上一版本：
\`\`\`bash
docker pull ghcr.io/gs129003/xianyuyunying:previous
docker restart xianyu-manager
\`\`\`

---

## 需要更多帮助？

访问 GitHub 仓库提交 Issue：https://github.com/gs129003/xianyuyunying/issues
`,
  },
]

export default function UserDocs() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={24} color="#ff6b35" /> 使用说明
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>新手入门、功能说明与常见问题解答</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 12, height: 'fit-content' }}>
          <div style={{ fontSize: 12, color: '#64748b', padding: '4px 8px 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>文档目录</div>
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                background: active === i ? '#ff6b3520' : 'transparent',
                border: 'none', color: active === i ? '#ff6b35' : '#94a3b8',
                cursor: 'pointer', fontSize: 13, textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={14} />
              {s.title}
            </button>
          ))}
        </div>

        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: '28px 32px', minHeight: 500 }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #1e3a5f' }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '20px 0 8px' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', margin: '16px 0 6px' }}>{children}</h3>,
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
              hr: () => <hr style={{ border: 'none', borderTop: '1px solid #1e3a5f', margin: '20px 0' }} />,
            }}
          >
            {sections[active].content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
