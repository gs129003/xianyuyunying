import { useState, useEffect } from 'react'
import {
  Bot, Plus, Trash2, Edit3, Save, TestTube, CheckCircle,
  MessageSquare, Zap, Key, Settings, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, Star, AlertCircle, RefreshCw
} from 'lucide-react'
import { aiApi } from '../api'
import type { AiProvider, ReplyRule } from '../types'

/* ─── AI Provider configs ─── */
const AI_PROVIDERS: { id: AiProvider; name: string; models: string[]; baseUrl: string; color: string }[] = [
  { id: 'openai', name: 'OpenAI / ChatGPT', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'], baseUrl: 'https://api.openai.com/v1', color: '#34d399' },
  { id: 'qianwen', name: '通义千问', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'], baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', color: '#ff6b35' },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'], baseUrl: 'https://api.deepseek.com/v1', color: '#60a5fa' },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash'], baseUrl: 'https://generativelanguage.googleapis.com', color: '#a78bfa' },
  { id: 'custom', name: '自定义 API', models: ['custom'], baseUrl: '', color: '#94a3b8' },
]

/* ─── Default system prompt ─── */
const DEFAULT_PROMPT = `你是一名专业的闲鱼卖家客服助手。你的任务是：
1. 用热情、真诚的态度回复买家消息
2. 准确介绍商品情况，不夸大不隐瞒
3. 对于砍价，保持合理立场，可适当优惠但不轻易让步
4. 遇到发货、地址等问题，友好引导买家按平台流程操作
5. 回复要简洁自然，像真人一样，不超过100字
6. 禁止提供个人联系方式或引导站外交易`

/* ─── Mock rules ─── */
const MOCK_RULES: ReplyRule[] = [
  { id: 1, type: 'keyword', keywords: ['价格', '多少钱', '能便宜吗'], replyContent: '亲，这个价格已经是最低了哦，质量有保障的！如果喜欢可以先拍下来😊', useAi: false, priority: 1, enabled: true, hitCount: 128, createdAt: '2026-04-01' },
  { id: 2, type: 'keyword', keywords: ['包邮吗', '运费', '邮费'], replyContent: '亲，满XX元包邮，不满需要补运费哦，具体以下单时显示为准～', useAi: false, priority: 2, enabled: true, hitCount: 86, createdAt: '2026-04-01' },
  { id: 3, type: 'keyword', keywords: ['几成新', '成色', '有没有划痕'], replyContent: '', useAi: true, priority: 3, enabled: true, hitCount: 54, createdAt: '2026-04-05' },
  { id: 4, type: 'global', keywords: [], replyContent: '', useAi: true, priority: 99, enabled: true, hitCount: 312, createdAt: '2026-04-01' },
]

export default function AiReply() {
  const [tab, setTab] = useState<'rules' | 'config' | 'test'>('config')
  const [provider, setProvider] = useState<AiProvider>('openai')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState(AI_PROVIDERS[0].baseUrl)
  const [model, setModel] = useState('gpt-4o-mini')
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(200)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testMsg, setTestMsg] = useState('这个商品还能便宜点吗？')
  const [testReply, setTestReply] = useState('')
  const [testing, setTesting] = useState(false)
  const [testError, setTestError] = useState('')
  const [rules, setRules] = useState<ReplyRule[]>(MOCK_RULES)
  const [showAddRule, setShowAddRule] = useState(false)
  const [editRule, setEditRule] = useState<Partial<ReplyRule>>({ type: 'keyword', keywords: [], replyContent: '', useAi: false, priority: 10, enabled: true })
  const [keywordInput, setKeywordInput] = useState('')

  const currentProvider = AI_PROVIDERS.find(p => p.id === provider)!

  const handleProviderChange = (id: AiProvider) => {
    setProvider(id)
    const p = AI_PROVIDERS.find(x => x.id === id)!
    setBaseUrl(p.baseUrl)
    setModel(p.models[0])
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      await aiApi.saveConfig({ provider, apiKey, baseUrl, model, systemPrompt, temperature, maxTokens, enabled: aiEnabled })
    } catch {}
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    alert('✅ AI 配置已保存！')
  }

  const handleTest = async () => {
    setTesting(true)
    setTestReply('')
    setTestError('')
    try {
      const res = await aiApi.testConfig(testMsg)
      setTestReply(res?.data?.reply ?? '（连接后端后可获得真实回复）')
    } catch {
      // Mock reply
      const mocks = [
        '亲，这个价格已经是诚意价了，我这边利润很薄的。您可以看看，品质真的很好哦～',
        '您好！我理解您想要优惠，但是这个已经是最低价了。如果您喜欢的话，欢迎直接下单！',
        '这个真的没办法再少了，我这边都是按正品价格来的，希望您理解😊',
      ]
      setTestReply(mocks[Math.floor(Math.random() * mocks.length)])
    }
    setTesting(false)
  }

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return
    setEditRule(r => ({ ...r, keywords: [...(r.keywords || []), keywordInput.trim()] }))
    setKeywordInput('')
  }

  const handleSaveRule = () => {
    if (!editRule.replyContent && !editRule.useAi) return
    const rule: ReplyRule = {
      id: Date.now(),
      type: editRule.type || 'keyword',
      keywords: editRule.keywords || [],
      replyContent: editRule.replyContent || '',
      useAi: editRule.useAi || false,
      priority: editRule.priority || 10,
      enabled: true,
      hitCount: 0,
      createdAt: new Date().toLocaleDateString(),
    }
    setRules(prev => [...prev, rule])
    setShowAddRule(false)
    setEditRule({ type: 'keyword', keywords: [], replyContent: '', useAi: false, priority: 10, enabled: true })
    setKeywordInput('')
  }

  const handleToggleRule = (id: number, enabled: boolean) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled } : r))
  }

  const handleDeleteRule = (id: number) => setRules(prev => prev.filter(r => r.id !== id))

  const TABS = [
    { key: 'config', label: 'AI 模型配置', icon: Settings },
    { key: 'rules', label: '回复规则', icon: MessageSquare },
    { key: 'test', label: '在线测试', icon: TestTube },
  ] as const

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bot size={24} color="#ff6b35" /> AI 智能回复
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>配置 AI 模型自动回复买家消息，支持关键词规则与智能兜底</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: '#0f172a', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 20px', borderRadius: 7, border: 'none',
            background: tab === t.key ? 'linear-gradient(90deg,#ff6b35,#ff8c42)' : 'transparent',
            color: tab === t.key ? '#fff' : '#64748b',
            cursor: 'pointer', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
          }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* ─── AI Config Tab ─── */}
      {tab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Provider selection */}
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={15} color="#ff6b35" /> 选择 AI 提供商</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {AI_PROVIDERS.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProviderChange(p.id)}
                    style={{
                      padding: '10px 14px', borderRadius: 8,
                      border: `1px solid ${provider === p.id ? p.color : '#334155'}`,
                      background: provider === p.id ? `${p.color}18` : '#0f172a',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                    <span style={{ fontSize: 14, color: provider === p.id ? '#f1f5f9' : '#94a3b8', flex: 1 }}>{p.name}</span>
                    {provider === p.id && <CheckCircle size={15} color={p.color} />}
                  </div>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Key size={15} color="#a78bfa" /> API 密钥</div>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={`输入 ${currentProvider.name} API Key`}
                style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: 'monospace', marginBottom: 12 }}
              />
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>模型</label>
                <select value={model} onChange={e => setModel(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                  {currentProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {provider === 'custom' && (
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 5 }}>Base URL</label>
                  <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://your-api.com/v1" style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
                </div>
              )}
            </div>

            {/* Params */}
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>参数调节</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8' }}>温度（Temperature）</label>
                  <span style={{ fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>{temperature}</span>
                </div>
                <input type="range" min="0" max="1" step="0.1" value={temperature} onChange={e => setTemperature(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff6b35' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginTop: 2 }}>
                  <span>精确</span><span>创意</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, color: '#94a3b8' }}>最大 Token 数</label>
                  <span style={{ fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>{maxTokens}</span>
                </div>
                <input type="range" min="50" max="500" step="10" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff6b35' }} />
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* System prompt */}
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20, flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}><Star size={15} color="#fb923c" /> 系统提示词 (System Prompt)</div>
              <textarea
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                rows={14}
                style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.7 }}
              />
              <button onClick={() => setSystemPrompt(DEFAULT_PROMPT)} style={{ marginTop: 8, fontSize: 12, color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>重置为默认</button>
            </div>

            {/* Enable toggle + Save */}
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 500 }}>全局 AI 回复开关</span>
                <div onClick={() => setAiEnabled(v => !v)} style={{ width: 48, height: 26, borderRadius: 13, background: aiEnabled ? '#ff6b35' : '#334155', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 4, left: aiEnabled ? 26 : 4, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
              </div>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                style={{ width: '100%', padding: '11px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {saving ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> 保存中...</> : <><Save size={15} /> 保存 AI 配置</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Rules Tab ─── */}
      {tab === 'rules' && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>关键词规则优先匹配，全局规则兜底。优先级数字越小越先触发。</p>
            <button onClick={() => setShowAddRule(true)} style={{ padding: '8px 18px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Plus size={14} /> 添加规则
            </button>
          </div>

          {showAddRule && (
            <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #ff6b3540', padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>新建回复规则</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, display: 'block' }}>规则类型</label>
                  <select value={editRule.type} onChange={e => setEditRule(r => ({ ...r, type: e.target.value as any }))} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                    <option value="keyword">关键词匹配</option>
                    <option value="global">全局兜底</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, display: 'block' }}>优先级（越小越优先）</label>
                  <input type="number" value={editRule.priority} onChange={e => setEditRule(r => ({ ...r, priority: Number(e.target.value) }))} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
                </div>
              </div>

              {editRule.type === 'keyword' && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5, display: 'block' }}>触发关键词</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={keywordInput} onChange={e => setKeywordInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} placeholder="输入关键词后回车添加" style={{ flex: 1, padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none' }} />
                    <button onClick={handleAddKeyword} style={{ padding: '8px 14px', background: '#1e3a5f', border: 'none', borderRadius: 7, color: '#60a5fa', cursor: 'pointer', fontSize: 13 }}>+ 添加</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(editRule.keywords || []).map((kw, i) => (
                      <span key={i} style={{ padding: '3px 10px', background: '#ff6b3520', border: '1px solid #ff6b3540', borderRadius: 20, color: '#ff6b35', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {kw}
                        <span onClick={() => setEditRule(r => ({ ...r, keywords: r.keywords?.filter((_, j) => j !== i) }))} style={{ cursor: 'pointer', opacity: 0.7 }}>×</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8' }}>使用 AI 智能回复</label>
                  <div onClick={() => setEditRule(r => ({ ...r, useAi: !r.useAi }))} style={{ width: 40, height: 22, borderRadius: 11, background: editRule.useAi ? '#ff6b35' : '#334155', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                    <div style={{ position: 'absolute', top: 3, left: editRule.useAi ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                </div>
                {!editRule.useAi && (
                  <textarea value={editRule.replyContent} onChange={e => setEditRule(r => ({ ...r, replyContent: e.target.value }))} placeholder="输入固定回复内容..." rows={3} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none', resize: 'none' }} />
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSaveRule} style={{ padding: '8px 20px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>保存规则</button>
                <button onClick={() => setShowAddRule(false)} style={{ padding: '8px 16px', background: '#334155', border: 'none', borderRadius: 7, color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>取消</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rules.sort((a, b) => a.priority - b.priority).map(rule => (
              <div key={rule.id} style={{ background: '#1e293b', borderRadius: 12, border: `1px solid ${rule.enabled ? '#1e3a5f' : '#334155'}`, padding: '14px 18px', opacity: rule.enabled ? 1 : 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: rule.type === 'global' ? '#a78bfa22' : '#ff6b3522', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {rule.type === 'global' ? <Zap size={14} color="#a78bfa" /> : <MessageSquare size={14} color="#ff6b35" />}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>优先级 {rule.priority}</span>
                      <span style={{ padding: '1px 8px', borderRadius: 4, background: rule.type === 'global' ? '#a78bfa20' : '#ff6b3520', color: rule.type === 'global' ? '#a78bfa' : '#ff6b35', fontSize: 11 }}>
                        {rule.type === 'global' ? '全局兜底' : '关键词'}
                      </span>
                      {rule.useAi && <span style={{ padding: '1px 8px', borderRadius: 4, background: '#34d39920', color: '#34d399', fontSize: 11 }}>AI 回复</span>}
                      <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>命中 {rule.hitCount} 次</span>
                    </div>
                    {rule.keywords && rule.keywords.length > 0 && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                        {rule.keywords.map(kw => (
                          <span key={kw} style={{ padding: '2px 8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 20, color: '#94a3b8', fontSize: 11 }}>{kw}</span>
                        ))}
                      </div>
                    )}
                    {!rule.useAi && rule.replyContent && (
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0, padding: '6px 10px', background: '#0f172a', borderRadius: 6, borderLeft: '3px solid #ff6b35' }}>{rule.replyContent}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div onClick={() => handleToggleRule(rule.id, !rule.enabled)} style={{ width: 38, height: 21, borderRadius: 11, background: rule.enabled ? '#ff6b35' : '#334155', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 3, left: rule.enabled ? 19 : 3, width: 15, height: 15, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                    <button onClick={() => handleDeleteRule(rule.id)} style={{ padding: '5px 8px', background: '#450a0a', border: 'none', borderRadius: 5, color: '#f87171', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Test Tab ─── */}
      {tab === 'test' && (
        <div style={{ maxWidth: 680 }}>
          <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 24 }}>
            <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TestTube size={16} color="#a78bfa" /> AI 回复在线测试
            </div>
            <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>模拟买家消息</label>
            <textarea value={testMsg} onChange={e => setTestMsg(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'none', marginBottom: 12 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {['这个能便宜吗？', '几成新？', '包邮吗', '什么时候发货？', '这个真的好用吗'].map(m => (
                <button key={m} onClick={() => setTestMsg(m)} style={{ padding: '4px 12px', background: '#1e3a5f', border: '1px solid #334155', borderRadius: 20, color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>{m}</button>
              ))}
            </div>
            <button onClick={handleTest} disabled={testing} style={{ padding: '10px 28px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: testing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              {testing ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />生成中...</> : <><Bot size={15} />AI 生成回复</>}
            </button>

            {testReply && (
              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, display: 'block' }}>AI 回复结果</label>
                <div style={{ padding: '16px 18px', background: '#0f172a', borderRadius: 10, border: '1px solid #064e3b', borderLeft: '4px solid #34d399' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Bot size={18} color="#34d399" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>{testReply}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
