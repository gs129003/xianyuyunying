import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import HotSearch from './pages/HotSearch'
import LinkImport from './pages/LinkImport'
import AccountManage from './pages/AccountManage'
import ProductManage from './pages/ProductManage'
import AiReply from './pages/AiReply'
import DevDocs from './pages/DevDocs'
import UserDocs from './pages/UserDocs'
import SystemUpdate from './pages/SystemUpdate'
import './index.css'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <HashRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar open={sidebarOpen} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header onToggleSidebar={() => setSidebarOpen(o => !o)} />
          <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hot-search" element={<HotSearch />} />
              <Route path="/link-import" element={<LinkImport />} />
              <Route path="/accounts" element={<AccountManage />} />
              <Route path="/products" element={<ProductManage />} />
              <Route path="/ai-reply" element={<AiReply />} />
              <Route path="/dev-docs" element={<DevDocs />} />
              <Route path="/user-docs" element={<UserDocs />} />
              <Route path="/system-update" element={<SystemUpdate />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  )
}
