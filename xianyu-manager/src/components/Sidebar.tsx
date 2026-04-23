import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Link2, Package, Users,
  Bot, BookOpen, FileText, RefreshCw, Fish, PlusSquare
} from 'lucide-react'

const navGroups = [
  {
    label: '运营中心',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: '控制台' },
      { to: '/hot-search', icon: TrendingUp, label: '热销品搜索' },
      { to: '/auto-list', icon: PlusSquare, label: '自动上新品' },
      { to: '/link-import', icon: Link2, label: '链接导入上新' },
    ],
  },
  {
    label: '管理中心',
    items: [
      { to: '/accounts', icon: Users, label: '账号管理' },
      { to: '/products', icon: Package, label: '商品管理' },
      { to: '/ai-reply', icon: Bot, label: 'AI 智能回复' },
    ],
  },
  {
    label: '文档与系统',
    items: [
      { to: '/dev-docs', icon: BookOpen, label: '开发文档' },
      { to: '/user-docs', icon: FileText, label: '使用说明' },
      { to: '/system-update', icon: RefreshCw, label: '系统更新' },
    ],
  },
]

export default function Sidebar({ open }: { open: boolean }) {
  return (
    <aside style={{
      width: open ? 240 : 0,
      minWidth: open ? 240 : 0,
      overflow: 'hidden',
      transition: 'width 0.3s, min-width 0.3s',
      background: '#0d1b2e',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e3a5f',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #1e3a5f', whiteSpace: 'nowrap' }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#ff6b35,#ff8c42)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Fish size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>闲鱼运营</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>管理系统 v2.0.0</div>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', padding: '8px 14px 4px', whiteSpace: 'nowrap' }}>{group.label}</div>
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', borderRadius: 8, textDecoration: 'none',
                  color: isActive ? '#fff' : '#94a3b8',
                  background: isActive ? 'linear-gradient(90deg,#ff6b35,#ff8c42)' : 'transparent',
                  fontWeight: isActive ? 600 : 400, fontSize: 13.5, whiteSpace: 'nowrap',
                  transition: 'all 0.2s', marginBottom: 2,
                })}
              >
                <Icon size={16} />{label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '10px 16px', borderTop: '1px solid #1e3a5f', fontSize: 11, color: '#334155', whiteSpace: 'nowrap' }}>© 2026 闲鱼运营系统</div>
    </aside>
  )
}
