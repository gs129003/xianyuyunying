import { useState } from 'react'
import { PlusSquare, Upload, CheckCircle, Clock, XCircle, Zap, Edit3, Trash2 } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: string
  category: string
  desc: string
  status: 'pending' | 'uploading' | 'done' | 'failed'
  images: number
  createdAt: string
}

const INIT_PRODUCTS: Product[] = [
  { id: 1, name: 'AJ 1 Low 白蓝配色 2024', price: '850', category: '运动鞋', desc: '全新未穿，原盒，附赠鞋袋', status: 'done', images: 5, createdAt: '2026-04-24 01:30' },
  { id: 2, name: 'Sony WH-1000XM5', price: '1199', category: '数码', desc: '9成新，附充电线和收纳包', status: 'done', images: 4, createdAt: '2026-04-24 01:45' },
  { id: 3, name: '宝可梦皮卡丘限定手办', price: '120', category: '手办模型', desc: '正版官方，全新未拆封', status: 'pending', images: 3, createdAt: '2026-04-24 02:00' },
]

const statusInfo = {
  pending: { label: '待上传', color: '#fb923c', bg: '#431407', icon: Clock },
  uploading: { label: '上传中', color: '#60a5fa', bg: '#1e3a5f', icon: Upload },
  done: { label: '已上新', color: '#34d399', bg: '#064e3b', icon: CheckCircle },
  failed: { label: '失败', color: '#f87171', bg: '#450a0a', icon: XCircle },
}

export default function AutoList() {
  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', category: '运动鞋', desc: '' })
  const [batchLoading, setBatchLoading] = useState(false)

  const categories = ['运动鞋', '数码', '手机', '家电', '服饰', '手办模型', '箱包', '户外', '游戏']

  const handleAdd = () => {
    if (!form.name || !form.price) return
    const newP: Product = {
      id: Date.now(),
      name: form.name,
      price: form.price,
      category: form.category,
      desc: form.desc,
      status: 'pending',
      images: 0,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    setProducts(prev => [newP, ...prev])
    setForm({ name: '', price: '', category: '运动鞋', desc: '' })
    setShowForm(false)
  }

  const handleUpload = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'uploading' } : p))
    setTimeout(() => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'done' } : p))
    }, 2000 + Math.random() * 1000)
  }

  const handleBatchUpload = () => {
    const pending = products.filter(p => p.status === 'pending')
    if (pending.length === 0) return
    setBatchLoading(true)
    setProducts(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'uploading' } : p))
    pending.forEach((p, i) => {
      setTimeout(() => {
        setProducts(prev => prev.map(pp => pp.id === p.id ? { ...pp, status: 'done' } : pp))
        if (i === pending.length - 1) setBatchLoading(false)
      }, (i + 1) * 1500)
    })
  }

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const done = products.filter(p => p.status === 'done').length
  const pending = products.filter(p => p.status === 'pending').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlusSquare size={24} color="#ff6b35" /> 自动上新品
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>管理待上新商品，支持单个和批量自动上传发布</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: '全部商品', value: products.length, color: '#94a3b8' },
          { label: '已上新', value: done, color: '#34d399' },
          { label: '待上新', value: pending, color: '#fb923c' },
          { label: '失败', value: products.filter(p => p.status === 'failed').length, color: '#f87171' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', borderRadius: 12, padding: '16px 18px', border: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            padding: '9px 20px',
            background: 'linear-gradient(90deg,#ff6b35,#ff8c42)',
            border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <PlusSquare size={16} /> 添加商品
        </button>
        <button
          onClick={handleBatchUpload}
          disabled={batchLoading || pending === 0}
          style={{
            padding: '9px 20px',
            background: '#1e3a5f',
            border: '1px solid #334155',
            borderRadius: 8, color: pending === 0 ? '#475569' : '#60a5fa', fontWeight: 600, fontSize: 14, cursor: pending === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Zap size={16} /> 批量上新 {pending > 0 && `(${pending})`}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background: '#1e293b',
          borderRadius: 14,
          border: '1px solid #ff6b3540',
          padding: 20,
          marginBottom: 18,
        }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>添加新商品</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>商品名称 *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="输入商品名称"
                style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>售价（元）*</label>
              <input
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="如：168"
                style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>商品分类</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>商品描述</label>
              <input
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="简短描述商品情况..."
                style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleAdd}
              style={{ padding: '8px 20px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
            >
              确认添加
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: '8px 20px', background: '#334155', border: 'none', borderRadius: 7, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#162032' }}>
              {['商品名称', '分类', '价格', '图片数', '描述', '状态', '创建时间', '操作'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const si = statusInfo[p.status]
              return (
                <tr key={p.id} style={{ borderTop: '1px solid #1e3a5f' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: 14, maxWidth: 200 }}>{p.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: '#1e3a5f', color: '#94a3b8', fontSize: 12 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#ff6b35', fontWeight: 700 }}>¥{p.price}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 13 }}>{p.images}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13, maxWidth: 180 }}>{p.desc || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: si.bg, color: si.color, fontSize: 12, fontWeight: 500, width: 'fit-content' }}>
                      <si.icon size={12} />
                      {si.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{p.createdAt}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleUpload(p.id)}
                          style={{ padding: '5px 12px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                        >
                          上新
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ padding: '5px 10px', background: '#450a0a', border: 'none', borderRadius: 6, color: '#f87171', fontSize: 12, cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
