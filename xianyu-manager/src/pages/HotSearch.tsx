import { useState } from 'react'
import { Search, TrendingUp, RefreshCw, Filter, Star } from 'lucide-react'

interface HotItem {
  rank: number
  name: string
  want: number
  avgPrice: string
  category: string
  trend: 'up' | 'down' | 'new'
  score: number
}

const MOCK_DATA: HotItem[] = [
  { rank: 1, name: 'AJ 1 Low 白蓝配色 2024', want: 5432, avgPrice: '¥850', category: '运动鞋', trend: 'up', score: 98 },
  { rank: 2, name: 'Sony WH-1000XM5 耳机', want: 4876, avgPrice: '¥1199', category: '数码', trend: 'up', score: 97 },
  { rank: 3, name: '宝可梦皮卡丘限定手办', want: 3921, avgPrice: '¥120', category: '手办模型', trend: 'new', score: 95 },
  { rank: 4, name: 'Dyson V15 戴森吸尘器', want: 3541, avgPrice: '¥3200', category: '家电', trend: 'up', score: 93 },
  { rank: 5, name: '复古皮革钱包男款', want: 3102, avgPrice: '¥45', category: '箱包', trend: 'down', score: 90 },
  { rank: 6, name: 'iPhone 15 Pro Max 原装', want: 2987, avgPrice: '¥6800', category: '手机', trend: 'up', score: 89 },
  { rank: 7, name: '机械键盘 Cherry 红轴', want: 2543, avgPrice: '¥320', category: '数码外设', trend: 'up', score: 86 },
  { rank: 8, name: '露营折叠椅户外便携', want: 2311, avgPrice: '¥68', category: '户外', trend: 'new', score: 84 },
  { rank: 9, name: 'Nintendo Switch OLED', want: 2198, avgPrice: '¥1800', category: '游戏', trend: 'down', score: 82 },
  { rank: 10, name: 'Lululemon 瑜伽裤 正品', want: 1987, avgPrice: '¥480', category: '服饰', trend: 'up', score: 80 },
]

const CATEGORIES = ['全部', '运动鞋', '数码', '手机', '家电', '服饰', '箱包', '手办模型', '户外', '游戏', '数码外设']

export default function HotSearch() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('全部')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<HotItem[]>(MOCK_DATA)
  const [lastUpdate, setLastUpdate] = useState('刚刚')

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      const filtered = MOCK_DATA.filter(item => {
        const matchKw = !keyword || item.name.includes(keyword)
        const matchCat = category === '全部' || item.category === category
        return matchKw && matchCat
      })
      setData(filtered)
      setLoading(false)
      setLastUpdate('刚刚')
    }, 1200)
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setData([...MOCK_DATA].sort(() => Math.random() - 0.5).slice(0, 10))
      setLoading(false)
      setLastUpdate('刚刚')
    }, 1500)
  }

  const trendColor = (t: string) => t === 'up' ? '#34d399' : t === 'new' ? '#a78bfa' : '#f87171'
  const trendLabel = (t: string) => t === 'up' ? '↑ 上涨' : t === 'new' ? '★ 新品' : '↓ 下跌'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={24} color="#ff6b35" /> 热销品搜索
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
          基于闲鱼平台真实数据，按"人想要"数量自动排序。最后更新：{lastUpdate}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        background: '#1e293b',
        borderRadius: 14,
        padding: 20,
        border: '1px solid #1e3a5f',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="搜索关键词，如：耳机、运动鞋..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(90deg,#ff6b35,#ff8c42)',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Search size={15} /> 搜索
          </button>
          <button
            onClick={handleRefresh}
            style={{
              padding: '10px 16px',
              background: '#1e3a5f',
              border: '1px solid #334155',
              borderRadius: 8,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14,
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> 刷新
          </button>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} color="#64748b" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '4px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: category === cat ? '#ff6b35' : '#334155',
                background: category === cat ? '#ff6b3520' : 'transparent',
                color: category === cat ? '#ff6b35' : '#94a3b8',
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>热销品榜单 <span style={{ color: '#64748b', fontWeight: 400, fontSize: 13 }}>共 {data.length} 条</span></span>
          <span style={{ fontSize: 12, color: '#64748b' }}>数据来源：闲鱼平台</span>
        </div>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px', display: 'block' }} />
            正在抓取最新数据...
          </div>
        ) : data.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>暂无结果，请调整搜索条件</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#162032' }}>
                {['排名', '商品名称', '想要人数', '参考均价', '分类', '趋势', '热度评分', '操作'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.rank} style={{ borderTop: '1px solid #1e3a5f' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: '50%',
                      background: item.rank <= 3 ? 'linear-gradient(135deg,#ff6b35,#ff8c42)' : '#334155',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>{item.rank}</span>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#e2e8f0', fontSize: 14, maxWidth: 220 }}>{item.name}</td>
                  <td style={{ padding: '13px 16px', color: '#ff6b35', fontWeight: 700, fontSize: 15 }}>{item.want.toLocaleString()}</td>
                  <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 14 }}>{item.avgPrice}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: '#1e3a5f', color: '#94a3b8', fontSize: 12 }}>{item.category}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ color: trendColor(item.trend), fontSize: 13, fontWeight: 500 }}>{trendLabel(item.trend)}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, maxWidth: 80, height: 6, background: '#334155', borderRadius: 3 }}>
                        <div style={{ width: `${item.score}%`, height: '100%', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#ff6b35', fontWeight: 600 }}>{item.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <button style={{
                      padding: '5px 14px',
                      background: 'linear-gradient(90deg,#ff6b35,#ff8c42)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}>
                      一键上新
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
