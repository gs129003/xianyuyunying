import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Settings, User, LogOut, ChevronDown, Shield, Moon, Sun, Monitor } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const nav = useNavigate()
  const toast = useToast()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // 用户信息（可从 localStorage 读取）
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('xianyu_user_info')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return { username: 'admin', nickname: '管理员', role: '超级管理员', email: 'admin@example.com' }
  })
  const [editForm, setEditForm] = useState({ nickname: userInfo.nickname, email: userInfo.email })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const notifications = [
    { title: '系统提示', desc: '欢迎使用闲鱼运营管理系统 v1.01', time: '刚刚', read: false },
    { title: '商品上架成功', desc: 'AJ 1 Low 白蓝配色 已成功上架', time: '5分钟前', read: false },
    { title: 'AI 回复统计', desc: '今日 AI 自动回复 312 条消息', time: '10分钟前', read: true },
    { title: '账号状态提醒', desc: '账号「好货分享」Cookie 即将过期', time: '30分钟前', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const handleSaveProfile = () => {
    const updated = { ...userInfo, nickname: editForm.nickname, email: editForm.email }
    setUserInfo(updated)
    localStorage.setItem('xianyu_user_info', JSON.stringify(updated))
    setShowProfileModal(false)
    toast.success('个人信息已更新')
  }

  const handleChangePassword = () => {
    if (!passwordForm.oldPassword) { toast.warning('请输入当前密码'); return }
    if (!passwordForm.newPassword) { toast.warning('请输入新密码'); return }
    if (passwordForm.newPassword.length < 6) { toast.warning('新密码长度不能少于6位'); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.warning('两次输入的密码不一致'); return }
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordModal(false)
    toast.success('密码修改成功，下次登录生效')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('xianyu_user_info')
    toast.info('已退出登录')
    setTimeout(() => nav('/dashboard'), 500)
  }

  return (
    <header style={{
      height: 60, background: '#0d1b2e',
      borderBottom: '1px solid #1e3a5f',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16,
    }}>
      <button onClick={onToggleSidebar} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
        <Menu size={22} />
      </button>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6, position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#f87171', border: '2px solid #0d1b2e', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div style={{
              position: 'absolute', top: 40, right: 0, width: 340,
              background: '#1e293b', border: '1px solid #1e3a5f',
              borderRadius: 12, boxShadow: '0 12px 40px #000a', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>通知中心</span>
                <span style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}>{unreadCount} 条未读</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '12px 18px', borderBottom: i < notifications.length - 1 ? '1px solid #1e3a5f' : undefined,
                  background: n.read ? 'transparent' : '#162032', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b35', flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: n.read ? '#94a3b8' : '#e2e8f0', flex: 1 }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', paddingLeft: n.read ? 0 : 14 }}>{n.desc}</div>
                </div>
              ))}
              <div style={{ padding: '10px 18px', borderTop: '1px solid #1e3a5f', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#60a5fa', cursor: 'pointer' }}>查看全部通知</span>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => nav('/system-update')}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}
          title="系统设置"
        >
          <Settings size={18} />
        </button>

        {/* User dropdown */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700 }}>
              {userInfo.nickname.charAt(0)}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>{userInfo.nickname}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{userInfo.role}</div>
            </div>
            <ChevronDown size={14} />
          </button>
          {showUserMenu && (
            <div style={{
              position: 'absolute', top: 52, right: 0, width: 220,
              background: '#1e293b', border: '1px solid #1e3a5f',
              borderRadius: 12, boxShadow: '0 12px 40px #000a', zIndex: 100, overflow: 'hidden',
            }}>
              {/* User info header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #1e3a5f' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', fontWeight: 700 }}>
                    {userInfo.nickname.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>{userInfo.nickname}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{userInfo.role} · {userInfo.username}</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: User, label: '个人信息', action: () => { setShowProfileModal(true) } },
                { icon: Shield, label: '修改密码', action: () => { setShowPasswordModal(true) } },
                { icon: Settings, label: '系统设置', action: () => nav('/system-update') },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.action(); setShowUserMenu(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 18px', background: 'none',
                  border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#162032')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <item.icon size={15} /> {item.label}
                </button>
              ))}

              {/* Divider */}
              <div style={{ height: 1, background: '#1e3a5f', margin: '4px 0' }} />

              <button onClick={() => { handleLogout(); setShowUserMenu(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 18px', background: 'none',
                border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#450a0a30')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={15} /> 退出登录
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 28, width: 440, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 20 }}>个人信息</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>用户名（不可修改）</label>
              <input value={userInfo.username} disabled style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#475569', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>昵称</label>
              <input value={editForm.nickname} onChange={e => setEditForm(f => ({ ...f, nickname: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>邮箱</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSaveProfile} style={{ padding: '9px 24px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>保存修改</button>
              <button onClick={() => { setShowProfileModal(false); setEditForm({ nickname: userInfo.nickname, email: userInfo.email }) }} style={{ padding: '9px 20px', background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000a', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 28, width: 440, maxWidth: '90vw' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9', marginBottom: 20 }}>修改密码</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>当前密码</label>
              <input type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm(f => ({ ...f, oldPassword: e.target.value }))} placeholder="请输入当前密码" style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>新密码</label>
              <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="至少6位" style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, display: 'block' }}>确认新密码</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="再次输入新密码" style={{ width: '100%', padding: '9px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 7, color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 18, padding: '8px 12px', background: '#0f172a', borderRadius: 6, lineHeight: 1.6 }}>
              密码要求：长度不少于 6 位，建议包含字母和数字
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleChangePassword} style={{ padding: '9px 24px', background: 'linear-gradient(90deg,#ff6b35,#ff8c42)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>确认修改</button>
              <button onClick={() => { setShowPasswordModal(false); setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' }) }} style={{ padding: '9px 20px', background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', fontSize: 14 }}>取消</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
