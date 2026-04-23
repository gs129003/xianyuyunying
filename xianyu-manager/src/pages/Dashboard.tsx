import { TrendingUp, Package, RefreshCw, Eye, ArrowUp, ArrowDown, Activity, Users, Bot, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { label: '闲鱼账号', value: '3', sub: '1 在线', up: true, icon: Users, color: '#22d3ee', to: '/accounts' },
  { label: '商品总数', value: '147', sub: '+12 今日', up: true, icon: Package, color: '#ff6b35', to: '/products' },
  { label: 'AI 今日回复', value: '312', sub: '+23%', up: true, icon: Bot, color: '#a78bfa', to: '/ai-reply' },
  { label: '今日搜索热品', value: '128', sub: '已更新', up: true, icon: TrendingUp, color: '#34d399', to: '/hot-search' },
]

const recentItems = [
  { name: '复古皮质钱包', want: 2341, price: '¥39', status: '已上架', source: '手动' },
  { name: 'AJ运动鞋 Air Jordan', want: 1876, price: '¥450', status: '已上架', source: '淘宝' },
  { name: '索尼WH-1000XM5耳机', want: 1654, price: '¥1200', status: '待上新', source: '1688' },
  { name: '宝可梦手办限定版', want: 1432, price: '¥180', status: '已上架', source: '拼多多' },
  { name: '机械键盘Cherry轴', want: 1290, price: '¥280', status: '待上新', source: '闲鱼' },
]

const recentReplies = [
  { msg: '这个能便宜吗？', reply: '亲，这个已经是最低价了，品质有保障哦～', account: '旺铺小店', time: '2分钟前' },
  { msg: '包邮吗', reply: '满39元包邮，不满需补运费，具体以下单显示为准', account: '旺铺小店', time: '5分钟前' },
  { msg: '几成新？有划痕吗', reply: '9成新，表面没有明显划痕，功能完好', account: '好货分享', time: '12分钟前' },
]

export default function Dashboard() {
  const nav = useNavigate()
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>控制台</h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>欢迎使用闲鱼运营管理系统 v2.0 — 多账号 · AI回复 · 智能上新 🚀</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div
            key={s.label}
            onClick={() => nav(s.to)}
            style={{ background: '#1e293b', borderRadius: 14, padding: '20px 22px', border: '1px solid #1e3a5f', cursor: 'pointer', transition: 'border-color 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.up ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{s.sub}
                </div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} color={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Recent hot items */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={16} color="#ff6b35" /><span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>热销品快览</span></div>
            <button onClick={() => nav('/hot-search')} style={{ fontSize: 12, color: '#ff6b35', background: 'none', border: 'none', cursor: 'pointer' }}>查看更多 →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {recentItems.map((item, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? '1px solid #1e3a5f' : undefined }}>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: i < 3 ? '#ff6b35' : '#334155', color: '#fff', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  </td>
                  <td style={{ padding: '10px 8px', color: '#e2e8f0', fontSize: 13, maxWidth: 140 }}>{item.name}</td>
                  <td style={{ padding: '10px 8px', color: '#ff6b35', fontWeight: 700, fontSize: 13 }}>{item.want.toLocaleString()}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: 4, background: '#1e3a5f', color: '#64748b', fontSize: 11 }}>{item.source}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: item.status === '已上架' ? '#064e3b' : '#422006', color: item.status === '已上架' ? '#34d399' : '#fb923c' }}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent AI replies */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bot size={16} color="#a78bfa" /><span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>AI 回复记录</span></div>
            <button onClick={() => nav('/ai-reply')} style={{ fontSize: 12, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer' }}>配置 →</button>
          </div>
          <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentReplies.map((r, i) => (
              <div key={i} style={{ padding: '10px 12px', background: '#162032', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>买家：{r.msg}</div>
                <div style={{ fontSize: 13, color: '#e2e8f0', borderLeft: '2px solid #a78bfa', paddingLeft: 8 }}>{r.reply}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{r.account} · {r.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
        <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14, fontSize: 14 }}>⚡ 快捷操作</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: '🔗 链接导入上新', to: '/link-import', color: '#ff6b35' },
            { label: '🔥 搜索热销品', to: '/hot-search', color: '#fb923c' },
            { label: '📦 商品管理', to: '/products', color: '#22d3ee' },
            { label: '👤 账号管理', to: '/accounts', color: '#34d399' },
            { label: '🤖 AI 回复配置', to: '/ai-reply', color: '#a78bfa' },
            { label: '🔄 检查更新', to: '/system-update', color: '#60a5fa' },
          ].map(item => (
            <button
              key={item.to}
              onClick={() => nav(item.to)}
              style={{ padding: '8px 18px', background: item.color + '18', border: `1px solid ${item.color}40`, borderRadius: 8, color: item.color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
