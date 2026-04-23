import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Settings, User, LogOut, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const nav = useNavigate()
  const toast = useToast()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const notifications = [
    { title: '系统提示', desc: '欢迎使用闲鱼运营管理系统 v2.1', time: '刚刚', read: false },
    { title: '商品上架成功', desc: 'AJ 1 Low 白蓝配色 已成功上架', time: '5分钟前', read: false },
    { title: 'AI 回复统计', desc: '今日 AI 自动回复 312 条消息', time: '10分钟前', read: true },
  ]

  const unreadCount = notifications.filter(n => !n.read).length

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
              <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: '#f87171', border: '2px solid #0d1b2e' }} />
            )}
          </button>
          {showNotifications && (
            <div style={{
              position: 'absolute', top: 40, right: 0, width: 320,
              background: '#1e293b', border: '1px solid #1e3a5f',
              borderRadius: 12, boxShadow: '0 12px 40px #000a', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e3a5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>通知</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{unreadCount} 条未读</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  padding: '12px 18px', borderBottom: i < notifications.length - 1 ? '1px solid #1e3a5f' : undefined,
                  background: n.read ? 'transparent' : '#162032', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: n.read ? '#94a3b8' : '#e2e8f0' }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{n.desc}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{n.time}</div>
                </div>
              ))}
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
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="#fff" />
            </div>
            <ChevronDown size={14} />
          </button>
          {showUserMenu && (
            <div style={{
              position: 'absolute', top: 46, right: 0, width: 200,
              background: '#1e293b', border: '1px solid #1e3a5f',
              borderRadius: 10, boxShadow: '0 12px 40px #000a', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #1e3a5f' }}>
                <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>admin</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>管理员</div>
              </div>
              {[
                { icon: Settings, label: '系统设置', action: () => nav('/system-update') },
                { icon: LogOut, label: '退出登录', action: () => { localStorage.removeItem('token'); toast.info('已退出登录') } },
              ].map((item, i) => (
                <button key={i} onClick={() => { item.action(); setShowUserMenu(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 18px', background: 'none',
                  border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, textAlign: 'left',
                }}>
                  <item.icon size={15} /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
