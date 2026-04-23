import { Menu, Bell, Settings, User } from 'lucide-react'

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header style={{
      height: 60,
      background: '#0d1b2e',
      borderBottom: '1px solid #1e3a5f',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 16,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
      >
        <Menu size={22} />
      </button>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}>
          <Bell size={18} />
        </button>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6 }}>
          <Settings size={18} />
        </button>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg,#ff6b35,#ff8c42)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <User size={16} color="#fff" />
        </div>
      </div>
    </header>
  )
}
