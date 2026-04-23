import { useState, useEffect } from 'react'
import {
  Package, Plus, Trash2, Edit3, Upload, Eye, Search, Filter,
  RefreshCw, ArrowUp, ExternalLink, Tag, Star, TrendingUp, CheckCircle, XCircle
} from 'lucide-react'
import type { Product, ProductStatus, ProductSource } from '../types'
import { productApi } from '../api'
import { useToast } from '../components/Toast'

const MOCK_PRODUCTS: Product[] = [
  { id: 1, accountId: 1, name: 'AJ 1 Low 白蓝配色', price: 850, originalPrice: 920, profitRate: 8, category: '运动鞋', desc: '全新未穿，原盒附赠鞋袋', images: [], status: 'published', source: 'taobao', sourceUrl: 'https://item.taobao.com/xxx', sourcePrice: 780, stock: 3, soldCount: 2, createdAt: '2026-04-24 01:30', publishedAt: '2026-04-24 02:00' },
  { id: 2, accountId: 1, name: 'Sony WH-1000XM5 降噪耳机', price: 1199, originalPrice: 1399, profitRate: 14, category: '数码', desc: '9成新，附原装充电线', images: [], status: 'pending', source: 'alibaba', sourceUrl: 'https://detail.1688.com/xxx', sourcePrice: 1050, stock: 1, soldCount: 0, createdAt: '2026-04-24 01:45' },
  { id: 3, accountId: 2, name: '宝可梦皮卡丘限定手办', price: 120, originalPrice: 150, profitRate: 25, category: '手办模型', desc: '正版未拆封，官方授权', images: [], status: 'draft', source: 'pinduoduo', sourceUrl: 'https://mobile.yangkeduo.com/xxx', sourcePrice: 96, stock: 5, soldCount: 0, createdAt: '2026-04-24 02:00' },
  { id: 4, accountId: 1, name: 'Dyson V15 戴森吸尘器', price: 3200, originalPrice: 3600, profitRate: 12, category: '家电', desc: '全新正品，含配件大全', images: [], status: 'offline', source: 'xianyu', sourceUrl: 'https://item.taobao.com/yyy', sourcePrice: 2850, stock: 1, soldCount: 0, createdAt: '2026-04-23 20:00' },
]

const statusMap: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  draft: { label: '草稿', color: '#94a3b8', bg: '#1e3a5f' },
  pending: { label: '待上新', color: '#fb923c', bg: '#431407' },
  published: { label: '已上架', color: '#34d399', bg: '#064e3b' },
  offline: { label: '已下架', color: '#64748b', bg: '#1e293b' },
  failed: { label: '失败', color: '#f87171', bg: '#450a0a' },
}

const sourceMap: Record<ProductSource, { label: string; color: string }> = {
  manual: { label: '手动添加', color: '#64748b' },
  taobao: { label: '淘宝/天猫', color: '#ff6b35' },
  alibaba: { label: '1688', color: '#e55a25' },
  xianyu: { label: '闲鱼', color: '#22d3ee' },
  pinduoduo: { label: '拼多多', color: '#a78bfa' },
}

type TabStatus = 'all' | ProductStatus

export default function ProductManage() {
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<TabStatus>('all')
  const [keyword, setKeyword] = useState('')
  const [showDetail, setShowDetail] = useState<Product | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productApi.list({ page: 1, pageSize: 100 })
      if (res?.data?.items) setProducts(res.data.items)
    } catch { /* use mock */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter(p => {
    const matchTab = tab === 'all' || p.status === tab
    const matchKw = !keyword || p.name.toLowerCase().includes(keyword.toLowerCase())
    return matchTab && matchKw
  })

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const handlePublish = async (id: number) => {
    try { await productApi.publish(id) } catch {}
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'published', publishedAt: new Date().toLocaleString() } : p))
    const p = products.find(p => p.id === id)
    toast.success(`商品 "${p?.name}" 已上架`)
  }

  const handleOffline = async (id: number) => {
    try { await productApi.toggleStatus(id, 'offline') } catch {}
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'offline' } : p))
    const p = products.find(p => p.id === id)
    toast.success(`商品 "${p?.name}" 已下架`)
  }

  const handleDelete = async (id: number) => {
    const p = products.find(p => p.id === id)
    if (!window.confirm(`确认删除商品 "${p?.name}"？删除后不可恢复。`)) return
    try { await productApi.remove(id) } catch {}
    setProducts(prev => prev.filter(p => p.id !== id))
    setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s })
    toast.success(`商品 "${p?.name}" 已删除`)
  }

  const handleBatchPublish = async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) {
      toast.warning('请先选择要上架的商品')
      return
    }
    try {
      await productApi.batchPublish(ids)
      setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'published' } : p))
      setSelectedIds(new Set())
      toast.success(`已批量上架 ${ids.length} 件商品`)
    } catch {
      setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'published' } : p))
      setSelectedIds(new Set())
      toast.success(`已批量上架 ${ids.length} 件商品（离线模式）`)
    }
  }

  const tabs: { key: TabStatus; label: string }[] = [
    { key: 'all', label: `全部 (${products.length})` },
    { key: 'pending', label: `待上新 (${products.filter(p => p.status === 'pending').length})` },
    { key: 'published', label: `已上架 (${products.filter(p => p.status === 'published').length})` },
    { key: 'draft', label: `草稿 (${products.filter(p => p.status === 'draft').length})` },
    { key: 'offline', label: `已下架 (${products.filter(p => p.status === 'offline').length})` },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Package size={24} color="#ff6b35" /> 商品管理
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>管理所有上新商品，支持上架、下架、批量操作</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: '#0f172a', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 16px', borderRadius: 7, border: 'none',
            background: tab === t.key ? '#ff6b35' : 'transparent',
            color: tab === t.key ? '#fff' : '#64748b',
            cursor: 'pointer', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜索商品名称..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', background: '#1e293b', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
        </div>
        {selectedIds.size > 0 && (
          <button onClick={handleBatchPublish} style={{ padding: '8px 18px', background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Upload size={14} /> 批量上架 ({selectedIds.size})
          </button>
        )}
        <button onClick={fetchProducts} disabled={loading}
          style={{ padding: '8px 14px', background: '#1e3a5f', border: '1px solid #334155', borderRadius: 7, color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
          <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> 刷新
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#162032' }}>
              <th style={{ padding: '10px 12px', width: 40 }}>
                <input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? new Set(filtered.map(p => p.id)) : new Set())} checked={selectedIds.size === filtered.length && filtered.length > 0} />
              </th>
              {['商品名称', '来源', '进价', '售价', '利润率', '库存', '状态', '操作'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const sm = statusMap[p.status]
              const srcm = sourceMap[p.source]
              return (
                <tr key={p.id} style={{ borderTop: '1px solid #1e3a5f', background: selectedIds.has(p.id) ? '#1e3a5f30' : undefined }}>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} />
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{p.category}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#1e3a5f', color: srcm.color, fontSize: 11 }}>{srcm.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 13 }}>¥{p.sourcePrice ?? '—'}</td>
                  <td style={{ padding: '12px 14px', color: '#ff6b35', fontWeight: 700, fontSize: 14 }}>¥{p.price}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {p.profitRate != null ? (
                      <span style={{ color: p.profitRate > 10 ? '#34d399' : '#fb923c', fontSize: 13, fontWeight: 600 }}>
                        +{p.profitRate}%
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: 13 }}>{p.stock ?? '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: sm.bg, color: sm.color, fontSize: 12, fontWeight: 500 }}>{sm.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => setShowDetail(p)} style={{ padding: '5px 9px', background: '#1e3a5f', border: 'none', borderRadius: 5, color: '#94a3b8', cursor: 'pointer' }}>
                        <Eye size={13} />
                      </button>
                      {(p.status === 'pending' || p.status === 'draft') && (
                        <button onClick={() => handlePublish(p.id)} style={{ padding: '5px 12px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 5, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>上架</button>
                      )}
                      {p.status === 'published' && (
                        <button onClick={() => handleOffline(p.id)} style={{ padding: '5px 12px', background: '#422006', border: 'none', borderRadius: 5, color: '#fb923c', fontSize: 12, cursor: 'pointer' }}>下架</button>
                      )}
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 9px', background: '#450a0a', border: 'none', borderRadius: 5, color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '50px 0', textAlign: 'center', color: '#475569' }}>暂无商品数据</div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 28, width: 500, maxWidth: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 18 }}>{showDetail.name}</div>
            {[
              ['分类', showDetail.category],
              ['来源平台', sourceMap[showDetail.source].label],
              ['来源链接', showDetail.sourceUrl],
              ['进价', `¥${showDetail.sourcePrice ?? '—'}`],
              ['售价', `¥${showDetail.price}`],
              ['利润率', showDetail.profitRate != null ? `+${showDetail.profitRate}%` : '—'],
              ['库存', showDetail.stock ?? '—'],
              ['状态', statusMap[showDetail.status].label],
              ['创建时间', showDetail.createdAt],
              ['描述', showDetail.desc],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #1e3a5f' }}>
                <span style={{ width: 90, fontSize: 13, color: '#64748b', flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 13, color: '#e2e8f0', wordBreak: 'break-all' }}>{v as string}</span>
              </div>
            ))}
            <button onClick={() => setShowDetail(null)} style={{ marginTop: 20, padding: '9px 24px', background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>关闭</button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}


