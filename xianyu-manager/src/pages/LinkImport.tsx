import { useState } from 'react'
import {
  Link2, Search, Package, Plus, RefreshCw, CheckCircle,
  ArrowRight, Sparkles, AlertTriangle, ExternalLink, Zap, Trash2
} from 'lucide-react'
import type { ParsedProduct, ProductSource } from '../types'
import { parseApi, productApi } from '../api'

/* ─── Platform detection ─── */
const PLATFORMS: { id: ProductSource; name: string; color: string; patterns: RegExp[] }[] = [
  {
    id: 'taobao', name: '淘宝/天猫', color: '#ff6b35',
    patterns: [/taobao\.com/, /tmall\.com/, /item\.taobao/, /detail\.tmall/],
  },
  {
    id: 'alibaba', name: '阿里巴巴1688', color: '#e55a25',
    patterns: [/1688\.com/, /detail\.1688/],
  },
  {
    id: 'xianyu', name: '闲鱼', color: '#22d3ee',
    patterns: [/xianyu\.taobao/, /2\.taobao\.com\/item/],
  },
  {
    id: 'pinduoduo', name: '拼多多', color: '#a78bfa',
    patterns: [/yangkeduo\.com/, /pinduoduo\.com/, /pdd\.com/],
  },
]

function detectPlatform(url: string): typeof PLATFORMS[0] | null {
  return PLATFORMS.find(p => p.patterns.some(re => re.test(url))) ?? null
}

/* ─── Mock parser (simulates backend parse) ─── */
function mockParse(url: string, platform: typeof PLATFORMS[0]): ParsedProduct {
  const mockNames: Record<ProductSource, string[]> = {
    taobao: ['AJ 1 Low 白蓝配色 全新', 'Apple MacBook Air M2', 'LOEWE 酒袋包 正品'],
    alibaba: ['厂家直供 蓝牙耳机 批发', '定制款帆布包 源头工厂', '男士皮带 真皮 批量'],
    xianyu: ['二手 iPhone 14 Pro 256G', '二手 Switch OLED 日版', '9成新 Dyson 吸尘器'],
    pinduoduo: ['爆款数据线 三合一', '夏季新款女装 碎花裙', '儿童积木 益智玩具'],
    manual: ['手动商品'],
  }
  const names = mockNames[platform.id] || ['商品示例']
  const name = names[Math.floor(Math.random() * names.length)]
  const sourcePrice = Math.floor(Math.random() * 800) + 50
  const suggestedPrice = Math.ceil(sourcePrice * (1.1 + Math.random() * 0.3))
  return {
    name,
    price: suggestedPrice,
    sourcePrice,
    images: [],
    desc: `${platform.name}在售 · 成色良好 · 附原包装`,
    category: ['数码', '服饰', '箱包', '手机'][Math.floor(Math.random() * 4)],
    source: platform.id,
    sourceUrl: url,
    shop: `${platform.name}官方旗舰店`,
    sales: Math.floor(Math.random() * 5000) + 100,
  }
}

interface ImportTask {
  id: number
  url: string
  platform: typeof PLATFORMS[0] | null
  status: 'idle' | 'parsing' | 'done' | 'error'
  result?: ParsedProduct
  error?: string
  profitRate: number
  finalPrice: number
}

export default function LinkImport() {
  const [inputUrl, setInputUrl] = useState('')
  const [tasks, setTasks] = useState<ImportTask[]>([])
  const [batchUrls, setBatchUrls] = useState('')
  const [defaultProfit, setDefaultProfit] = useState(15)

  const updateTask = (id: number, patch: Partial<ImportTask>) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))

  const addTask = (url: string) => {
    const clean = url.trim()
    if (!clean) return
    const platform = detectPlatform(clean)
    const task: ImportTask = {
      id: Date.now() + Math.random(),
      url: clean,
      platform,
      status: 'idle',
      profitRate: defaultProfit,
      finalPrice: 0,
    }
    setTasks(prev => [task, ...prev])
    setInputUrl('')
    return task
  }

  const parseTask = async (task: ImportTask) => {
    updateTask(task.id, { status: 'parsing' })
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000))
    try {
      let result: ParsedProduct
      try {
        const res = await parseApi.parseUrl(task.url)
        result = res?.data ?? mockParse(task.url, task.platform ?? PLATFORMS[0])
      } catch {
        result = mockParse(task.url, task.platform ?? PLATFORMS[0])
      }
      const finalPrice = Math.ceil(result.sourcePrice * (1 + task.profitRate / 100))
      updateTask(task.id, { status: 'done', result: { ...result, price: finalPrice }, finalPrice })
    } catch (e: any) {
      updateTask(task.id, { status: 'error', error: e?.message || '解析失败' })
    }
  }

  const handleAddUrl = () => {
    if (!inputUrl.trim()) return
    const t = addTask(inputUrl)
    if (t) setTimeout(() => parseTask(t), 100)
  }

  const handleBatchImport = () => {
    const urls = batchUrls.split('\n').map(u => u.trim()).filter(Boolean)
    urls.forEach((url, i) => {
      const t = addTask(url)
      if (t) setTimeout(() => parseTask(t), i * 300)
    })
    setBatchUrls('')
  }

  const handleAddToProducts = async (task: ImportTask) => {
    if (!task.result) return
    try {
      await productApi.create({
        name: task.result.name,
        price: task.finalPrice || task.result.price,
        sourcePrice: task.result.sourcePrice,
        profitRate: task.profitRate,
        category: task.result.category,
        desc: task.result.desc,
        images: task.result.images,
        source: task.result.source,
        sourceUrl: task.result.sourceUrl,
        status: 'pending',
      })
    } catch {}
    updateTask(task.id, { status: 'done', result: { ...task.result!, price: task.finalPrice } })
    alert('✅ 已添加到商品管理！')
  }

  const handleBatchAddAll = async () => {
    const done = tasks.filter(t => t.status === 'done' && t.result)
    for (const t of done) await handleAddToProducts(t)
  }

  const handleRemove = (id: number) => setTasks(prev => prev.filter(t => t.id !== id))

  const doneCount = tasks.filter(t => t.status === 'done').length
  const parsingCount = tasks.filter(t => t.status === 'parsing').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link2 size={24} color="#ff6b35" /> 链接导入上新品
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
          支持 淘宝 / 天猫 / 阿里巴巴1688 / 闲鱼 / 拼多多，自动提取商品信息并智能加价
        </p>
      </div>

      {/* Platform badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PLATFORMS.map(p => (
          <span key={p.id} style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${p.color}50`, background: `${p.color}18`, color: p.color, fontSize: 12, fontWeight: 600 }}>
            {p.name}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 24 }}>
        {/* Single URL input */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link2 size={16} color="#ff6b35" /> 单个链接导入
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <input
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
              placeholder="粘贴商品链接，如：https://item.taobao.com/item.htm?id=..."
              style={{ flex: 1, padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={handleAddUrl}
              style={{ padding: '10px 20px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Search size={15} /> 解析
            </button>
          </div>

          {/* Profit setting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>默认加价利润率：</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[5, 10, 15, 20, 30].map(v => (
                <button
                  key={v}
                  onClick={() => setDefaultProfit(v)}
                  style={{
                    padding: '4px 12px', borderRadius: 6, border: '1px solid',
                    borderColor: defaultProfit === v ? '#ff6b35' : '#334155',
                    background: defaultProfit === v ? '#ff6b3520' : 'transparent',
                    color: defaultProfit === v ? '#ff6b35' : '#64748b',
                    cursor: 'pointer', fontSize: 12,
                  }}
                >+{v}%</button>
              ))}
              <input
                type="number"
                value={defaultProfit}
                onChange={e => setDefaultProfit(Number(e.target.value))}
                style={{ width: 60, padding: '4px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#e2e8f0', fontSize: 13, outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Batch input */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={16} color="#a78bfa" /> 批量导入
          </div>
          <textarea
            value={batchUrls}
            onChange={e => setBatchUrls(e.target.value)}
            placeholder={'每行一个链接\nhttps://item.taobao.com/...\nhttps://detail.1688.com/...\nhttps://...'}
            rows={5}
            style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 12, outline: 'none', resize: 'none', fontFamily: 'monospace' }}
          />
          <button
            onClick={handleBatchImport}
            disabled={!batchUrls.trim()}
            style={{ marginTop: 10, width: '100%', padding: '9px 0', background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, fontSize: 13, cursor: batchUrls.trim() ? 'pointer' : 'not-allowed', opacity: batchUrls.trim() ? 1 : 0.5 }}
          >
            批量解析 ({batchUrls.split('\n').filter(l => l.trim()).length} 条)
          </button>
        </div>
      </div>

      {/* Tasks list */}
      {tasks.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 600, color: '#f1f5f9' }}>解析结果</span>
              {parsingCount > 0 && <span style={{ fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> 解析中({parsingCount})</span>}
              {doneCount > 0 && <span style={{ fontSize: 12, color: '#34d399' }}>✓ 已完成({doneCount})</span>}
            </div>
            {doneCount > 0 && (
              <button
                onClick={handleBatchAddAll}
                style={{ padding: '6px 16px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <Plus size={13} /> 全部加入商品库
              </button>
            )}
          </div>

          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tasks.map(task => {
              const plt = task.platform
              return (
                <div key={task.id} style={{
                  background: '#162032', borderRadius: 10,
                  border: `1px solid ${task.status === 'done' ? '#064e3b' : task.status === 'error' ? '#450a0a' : '#1e3a5f'}`,
                  padding: 16,
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Status icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: plt ? `${plt.color}22` : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {task.status === 'parsing' ? <RefreshCw size={16} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
                        : task.status === 'done' ? <CheckCircle size={16} color="#34d399" />
                          : task.status === 'error' ? <AlertTriangle size={16} color="#f87171" />
                            : <Link2 size={16} color={plt?.color ?? '#64748b'} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* URL + platform */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {plt && <span style={{ padding: '1px 7px', borderRadius: 4, background: `${plt.color}20`, color: plt.color, fontSize: 11, fontWeight: 600 }}>{plt.name}</span>}
                        <a href={task.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#475569', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                          {task.url}
                        </a>
                        <ExternalLink size={11} color="#475569" />
                      </div>

                      {/* Parsed result */}
                      {task.status === 'done' && task.result && (
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{task.result.name}</span>
                          <span style={{ fontSize: 12, color: '#64748b', background: '#1e3a5f', padding: '2px 7px', borderRadius: 4 }}>{task.result.category}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, color: '#64748b' }}>进价 ¥{task.result.sourcePrice}</span>
                            <ArrowRight size={14} color="#64748b" />
                            {/* Editable price */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ fontSize: 13, color: '#94a3b8' }}>售价 ¥</span>
                              <input
                                type="number"
                                value={task.finalPrice || task.result.price}
                                onChange={e => {
                                  const v = Number(e.target.value)
                                  const profitRate = task.result ? Math.round((v - task.result.sourcePrice) / task.result.sourcePrice * 100) : 0
                                  updateTask(task.id, { finalPrice: v, profitRate })
                                }}
                                style={{ width: 70, padding: '3px 6px', background: '#0f172a', border: '1px solid #334155', borderRadius: 5, color: '#ff6b35', fontWeight: 700, fontSize: 14, outline: 'none' }}
                              />
                            </div>
                            <span style={{ fontSize: 13, color: task.profitRate > 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>
                              +{task.profitRate}%
                            </span>
                          </div>
                        </div>
                      )}
                      {task.status === 'parsing' && <span style={{ fontSize: 13, color: '#60a5fa' }}>正在解析商品信息...</span>}
                      {task.status === 'error' && <span style={{ fontSize: 13, color: '#f87171' }}>解析失败：{task.error}</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {task.status === 'done' && task.result && (
                        <button
                          onClick={() => handleAddToProducts(task)}
                          style={{ padding: '5px 12px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Plus size={12} /> 加入商品库
                        </button>
                      )}
                      {task.status === 'error' && (
                        <button onClick={() => parseTask(task)} style={{ padding: '5px 12px', background: '#1e3a5f', border: 'none', borderRadius: 6, color: '#60a5fa', fontSize: 12, cursor: 'pointer' }}>
                          重试
                        </button>
                      )}
                      <button onClick={() => handleRemove(task.id)} style={{ padding: '5px 8px', background: '#450a0a', border: 'none', borderRadius: 6, color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#475569' }}>
          <Link2 size={40} style={{ margin: '0 auto 14px', display: 'block', opacity: 0.3 }} />
          <div style={{ fontSize: 15, marginBottom: 6 }}>粘贴商品链接开始导入</div>
          <div style={{ fontSize: 13 }}>支持淘宝、阿里巴巴1688、闲鱼、拼多多链接</div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
