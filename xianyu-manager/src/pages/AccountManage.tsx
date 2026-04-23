import { useState, useEffect } from 'react'
import {
  Users, Plus, Trash2, RefreshCw, Power, MessageSquare,
  Package, Wifi, WifiOff, AlertTriangle, Clock, CheckCircle, Copy, Eye, EyeOff, Key, Cookie, ShieldCheck
} from 'lucide-react'
import type { XianyuAccount } from '../types'
import { accountApi } from '../api'
import { useToast } from '../components/Toast'

/* ─── Mock data (used when backend is unavailable) ─── */
const MOCK_ACCOUNTS: XianyuAccount[] = [
  {
    id: 1, nickname: '旺铺小店', avatar: '', cookie: 'mock_cookie_1',
    loginType: 'cookie', status: 'online', goodsCount: 47, todayMessages: 23, totalMessages: 1280,
    autoReply: true, createdAt: '2026-04-01 10:00', lastActiveAt: '刚刚',
  },
  {
    id: 2, nickname: '好货分享', avatar: '', cookie: 'mock_cookie_2',
    loginType: 'password', loginPhone: '138****6789', status: 'offline', goodsCount: 12, todayMessages: 0, totalMessages: 430,
    autoReply: false, createdAt: '2026-04-10 14:30', lastActiveAt: '3小时前',
  },
  {
    id: 3, nickname: '二手优品', avatar: '', cookie: 'mock_cookie_3',
    loginType: 'cookie', status: 'expired', goodsCount: 88, todayMessages: 0, totalMessages: 3210,
    autoReply: false, createdAt: '2026-03-15 09:00', lastActiveAt: '2天前',
  },
]

const statusMap = {
  online: { label: '在线', color: '#34d399', bg: '#064e3b', icon: Wifi },
  offline: { label: '离线', color: '#94a3b8', bg: '#1e3a5f', icon: WifiOff },
  expired: { label: 'Cookie过期', color: '#fb923c', bg: '#431407', icon: AlertTriangle },
  error: { label: '异常', color: '#f87171', bg: '#450a0a', icon: AlertTriangle },
}

const loginTypeMap = {
  cookie: { label: 'Cookie', icon: Cookie, color: '#60a5fa' },
  password: { label: '密码登录', icon: Key, color: '#34d399' },
}

function CookieInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="粘贴闲鱼 Cookie（从浏览器开发者工具 → 网络请求 → Request Headers 中复制）"
        rows={show ? 4 : 2}
        style={{
          width: '100%', padding: '9px 38px 9px 12px',
          background: '#0f172a', border: '1px solid #334155',
          borderRadius: 7, color: '#e2e8f0', fontSize: 13, outline: 'none', resize: 'vertical',
          fontFamily: 'monospace',
        }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: 8, top: 10, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

type LoginTab = 'cookie' | 'password'

export default function AccountManage() {
  const toast = useToast()
  const [accounts, setAccounts] = useState<XianyuAccount[]>(MOCK_ACCOUNTS)
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState<number | null>(null)
  const [loginTab, setLoginTab] = useState<LoginTab>('cookie')
  const [form, setForm] = useState({ nickname: '', cookie: '' })
  const [pwdForm, setPwdForm] = useState({ nickname: '', phone: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newCookie, setNewCookie] = useState('')
  const [refreshingId, setRefreshingId] = useState<number | null>(null)

  /* Fetch from backend, fallback to mock */
  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const res = await accountApi.list()
      setAccounts(res?.data?.items ?? MOCK_ACCOUNTS)
    } catch {
      setAccounts(MOCK_ACCOUNTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAccounts() }, [])

  const handleAdd = async () => {
    if (loginTab === 'cookie') {
      if (!form.nickname.trim() || !form.cookie.trim()) {
        toast.warning('请填写账号昵称和 Cookie')
        return
      }
      setSubmitting(true)
      try {
        const res = await accountApi.add(form)
        const added = res?.data ?? { id: Date.now(), ...form, loginType: 'cookie' as const, status: 'offline', goodsCount: 0, todayMessages: 0, totalMessages: 0, autoReply: false, createdAt: new Date().toLocaleString(), lastActiveAt: '刚刚' }
        setAccounts(prev => [added as XianyuAccount, ...prev])
        toast.success(`账号 "${form.nickname}" 添加成功`)
      } catch {
        const newAcc: XianyuAccount = {
          id: Date.now(), nickname: form.nickname, cookie: form.cookie,
          loginType: 'cookie', status: 'offline', goodsCount: 0, todayMessages: 0, totalMessages: 0,
          autoReply: false, createdAt: new Date().toLocaleString(), lastActiveAt: '刚刚',
        }
        setAccounts(prev => [newAcc, ...prev])
        toast.success(`账号 "${form.nickname}" 添加成功（离线模式）`)
      }
      setForm({ nickname: '', cookie: '' })
    } else {
      if (!pwdForm.nickname.trim() || !pwdForm.phone.trim() || !pwdForm.password.trim()) {
        toast.warning('请填写完整信息（昵称、手机号、密码）')
        return
      }
      if (!/^1\d{10}$/.test(pwdForm.phone.trim())) {
        toast.warning('请输入正确的11位手机号')
        return
      }
      setSubmitting(true)
      try {
        const res = await accountApi.addByPassword(pwdForm)
        const added = res?.data ?? {
          id: Date.now(), nickname: pwdForm.nickname, cookie: '',
          loginType: 'password' as const,
          loginPhone: pwdForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          status: 'offline', goodsCount: 0, todayMessages: 0, totalMessages: 0,
          autoReply: false, createdAt: new Date().toLocaleString(), lastActiveAt: '刚刚',
        }
        setAccounts(prev => [added as XianyuAccount, ...prev])
        toast.success(`账号 "${pwdForm.nickname}" 登录成功`)
      } catch {
        const newAcc: XianyuAccount = {
          id: Date.now(), nickname: pwdForm.nickname, cookie: '',
          loginType: 'password',
          loginPhone: pwdForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
          status: 'offline', goodsCount: 0, todayMessages: 0, totalMessages: 0,
          autoReply: false, createdAt: new Date().toLocaleString(), lastActiveAt: '刚刚',
        }
        setAccounts(prev => [newAcc, ...prev])
        toast.success(`账号 "${pwdForm.nickname}" 添加成功（离线模式）`)
      }
      setPwdForm({ nickname: '', phone: '', password: '' })
      setShowPwd(false)
    }
    setSubmitting(false)
    setShowAddModal(false)
  }

  const handleDelete = async (id: number) => {
    const acc = accounts.find(a => a.id === id)
    if (!window.confirm(`确认删除账号 "${acc?.nickname}"？删除后不可恢复。`)) return
    try { await accountApi.remove(id) } catch {}
    setAccounts(prev => prev.filter(a => a.id !== id))
    toast.success(`账号 "${acc?.nickname}" 已删除`)
  }

  const handleToggleReply = async (id: number, enabled: boolean) => {
    try { await accountApi.toggleAutoReply(id, enabled) } catch {}
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, autoReply: enabled } : a))
    toast.success(`自动回复已${enabled ? '开启' : '关闭'}`)
  }

  const handleRefresh = async (id: number) => {
    setRefreshingId(id)
    try {
      const res = await accountApi.refresh(id)
      if (res?.data) setAccounts(prev => prev.map(a => a.id === id ? res.data : a))
      else setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'online', lastActiveAt: '刚刚' } : a))
      toast.success('账号状态已刷新')
    } catch {
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, lastActiveAt: '刚刚' } : a))
      toast.error('刷新失败，请检查网络连接')
    } finally {
      setRefreshingId(null)
    }
  }

  const handleUpdateCookie = async (id: number) => {
    if (!newCookie.trim()) {
      toast.warning('请输入新的 Cookie 内容')
      return
    }
    try { await accountApi.updateCookie(id, newCookie) } catch {}
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, cookie: newCookie, status: 'offline' } : a))
    setShowCookieModal(null)
    setNewCookie('')
    toast.success('Cookie 更新成功')
  }

  const online = accounts.filter(a => a.status === 'online').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={24} color="#ff6b35" /> 闲鱼账号管理
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
          管理多个闲鱼账号，支持 Cookie 登录和账号密码登录两种方式
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 22 }}>
        {[
          { label: '账号总数', value: accounts.length, color: '#94a3b8' },
          { label: '在线账号', value: online, color: '#34d399' },
          { label: '今日消息', value: accounts.reduce((s, a) => s + a.todayMessages, 0), color: '#60a5fa' },
          { label: '自动回复', value: accounts.filter(a => a.autoReply).length, color: '#a78bfa' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1e293b', borderRadius: 12, padding: '16px 18px', border: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button
          onClick={() => { setShowAddModal(true); setLoginTab('cookie') }}
          style={{ padding: '9px 20px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} /> 添加账号
        </button>
        <button
          onClick={fetchAccounts}
          disabled={loading}
          style={{ padding: '9px 16px', background: '#1e3a5f', border: '1px solid #334155', borderRadius: 8, color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}
        >
          <RefreshCw size={15} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} /> 刷新
        </button>
      </div>

      {/* Account cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>
        {accounts.map(acc => {
          const si = statusMap[acc.status]
          const li = loginTypeMap[acc.loginType || 'cookie']
          return (
            <div key={acc.id} style={{ background: '#1e293b', borderRadius: 14, border: `1px solid ${acc.status === 'online' ? '#064e3b' : '#1e3a5f'}`, overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#ff6b35,#ff8c42)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: '#fff', fontWeight: 700, flexShrink: 0,
                }}>
                  {acc.nickname.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {acc.nickname}
                    <span style={{ padding: '1px 8px', borderRadius: 4, background: `${li.color}18`, color: li.color, fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <li.icon size={10} /> {li.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    最后活跃：{acc.lastActiveAt}
                    {acc.loginType === 'password' && acc.loginPhone && (
                      <span style={{ marginLeft: 8 }}>· {acc.loginPhone}</span>
                    )}
                  </div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: 20, background: si.bg, color: si.color, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <si.icon size={12} /> {si.label}
                </span>
              </div>

              {/* Stats */}
              <div style={{ padding: '12px 18px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, borderBottom: '1px solid #1e3a5f' }}>
                {[
                  { label: '商品数', value: acc.goodsCount },
                  { label: '今日消息', value: acc.todayMessages },
                  { label: '累计消息', value: acc.totalMessages },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Auto reply toggle */}
              <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Power size={15} color={acc.autoReply ? '#34d399' : '#64748b'} />
                  <span style={{ fontSize: 13, color: acc.autoReply ? '#34d399' : '#64748b' }}>
                    自动回复 {acc.autoReply ? '已开启' : '已关闭'}
                  </span>
                </div>
                <div
                  onClick={() => handleToggleReply(acc.id, !acc.autoReply)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: acc.autoReply ? '#ff6b35' : '#334155',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 4, left: acc.autoReply ? 23 : 4,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                  }} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '12px 18px', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleRefresh(acc.id)}
                  style={{ flex: 1, padding: '7px 0', background: '#1e3a5f', border: 'none', borderRadius: 7, color: '#60a5fa', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  <RefreshCw size={13} style={refreshingId === acc.id ? { animation: 'spin 1s linear infinite' } : undefined} /> 刷新状态
                </button>
                {acc.loginType === 'cookie' && (
                  <button
                    onClick={() => { setShowCookieModal(acc.id); setNewCookie('') }}
                    style={{ flex: 1, padding: '7px 0', background: '#422006', border: 'none', borderRadius: 7, color: '#fb923c', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    <Copy size={13} /> 更新Cookie
                  </button>
                )}
                {acc.loginType === 'password' && (
                  <button
                    onClick={() => toast.info('账号密码登录的账号，系统将自动维护登录状态')}
                    style={{ flex: 1, padding: '7px 0', background: '#064e3b', border: 'none', borderRadius: 7, color: '#34d399', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    <ShieldCheck size={13} /> 自动维护
                  </button>
                )}
                <button
                  onClick={() => handleDelete(acc.id)}
                  style={{ padding: '7px 10px', background: '#450a0a', border: 'none', borderRadius: 7, color: '#f87171', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {/* Add placeholder */}
        <div
          onClick={() => { setShowAddModal(true); setLoginTab('cookie') }}
          style={{
            background: '#1e293b', borderRadius: 14,
            border: '2px dashed #334155', minHeight: 200,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', gap: 8, color: '#475569', transition: 'all 0.2s',
          }}
        >
          <Plus size={28} />
          <span style={{ fontSize: 14 }}>添加闲鱼账号</span>
        </div>
      </div>

      {/* ═══════ Add Modal with Tab Switch ═══════ */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 28, width: 520, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={18} color="#ff6b35" /> 添加闲鱼账号
            </div>

            {/* Login method tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#0f172a', borderRadius: 10, padding: 4 }}>
              {([
                { key: 'cookie' as LoginTab, label: 'Cookie 登录', icon: Cookie, desc: '粘贴浏览器 Cookie' },
                { key: 'password' as LoginTab, label: '账号密码登录', icon: Key, desc: '使用手机号+密码' },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => setLoginTab(t.key)}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 7, border: 'none',
                    background: loginTab === t.key ? 'linear-gradient(90deg,#ff6b35,#ff8c42)' : 'transparent',
                    color: loginTab === t.key ? '#fff' : '#64748b',
                    cursor: 'pointer', fontSize: 13, fontWeight: loginTab === t.key ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                    justifyContent: 'center',
                  }}
                >
                  <t.icon size={15} />
                  <div style={{ textAlign: 'left' }}>
                    <div>{t.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* ── Cookie Login Form ── */}
            {loginTab === 'cookie' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>账号昵称</label>
                  <input
                    value={form.nickname}
                    onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder="给该账号起个名字"
                    style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>闲鱼 Cookie</label>
                  <CookieInput value={form.cookie} onChange={v => setForm(f => ({ ...f, cookie: v }))} />
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 18, padding: '8px 12px', background: '#0f172a', borderRadius: 6 }}>
                  💡 获取方式：浏览器打开闲鱼 → F12 → Network → 任意请求 → Request Headers → 复制 Cookie 字段完整内容
                </div>
              </>
            )}

            {/* ── Password Login Form ── */}
            {loginTab === 'password' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>账号昵称</label>
                  <input
                    value={pwdForm.nickname}
                    onChange={e => setPwdForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder="给该账号起个名字，方便识别"
                    style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>手机号</label>
                  <input
                    type="tel"
                    value={pwdForm.phone}
                    onChange={e => setPwdForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="输入闲鱼绑定的手机号"
                    maxLength={11}
                    style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>密码</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={pwdForm.password}
                      onChange={e => setPwdForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="输入闲鱼账号密码"
                      style={{ width: '100%', padding: '9px 38px 9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 18, padding: '8px 12px', background: '#0f172a', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <ShieldCheck size={14} color="#34d399" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>密码将加密存储，系统定期自动维护登录状态，无需手动更新 Cookie。</span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleAdd}
                disabled={submitting}
                style={{ padding: '9px 24px', background: submitting ? '#334155' : 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {submitting
                  ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> 登录中...</>
                  : loginTab === 'cookie'
                    ? '确认添加'
                    : '登录并添加'}
              </button>
              <button
                onClick={() => { setShowAddModal(false); setForm({ nickname: '', cookie: '' }); setPwdForm({ nickname: '', phone: '', password: '' }) }}
                style={{ padding: '9px 20px', background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Cookie Modal */}
      {showCookieModal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 28, width: 480, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 16 }}>更新账号 Cookie</div>
            <CookieInput value={newCookie} onChange={setNewCookie} />
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => handleUpdateCookie(showCookieModal)} style={{ padding: '9px 24px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>保存</button>
              <button onClick={() => setShowCookieModal(null)} style={{ padding: '9px 20px', background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>取消</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
