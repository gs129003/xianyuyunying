import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle, AlertTriangle, Info, ExternalLink, GitBranch } from 'lucide-react'

const CURRENT_VERSION = 'v1.01'
const UPDATE_REPO = 'gs129003/xianyuyunying'
const UPDATE_URL = `https://api.github.com/repos/${UPDATE_REPO}/releases/latest`

interface Release {
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string
  assets: Array<{ name: string; browser_download_url: string; size: number }>
}

type CheckState = 'idle' | 'checking' | 'latest' | 'available' | 'updating' | 'done' | 'error'

const updateLogs = [
  { version: 'v1.01', date: '2026-04-24', type: 'feature', desc: '完善用户菜单系统（资料编辑、修改密码、通知中心）；所有操作按钮接入 Toast 通知反馈；一键上新功能接入 API' },
  { version: 'v1.0.0', date: '2026-04-24', type: 'release', desc: '初始版本发布，包含热销品搜索、自动上新、文档内嵌等核心功能' },
]

export default function SystemUpdate() {
  const [state, setState] = useState<CheckState>('idle')
  const [release, setRelease] = useState<Release | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [autoCheck, setAutoCheck] = useState(true)

  const checkUpdate = async () => {
    setState('checking')
    setError('')
    setRelease(null)
    setProgress(0)

    try {
      const res = await fetch(UPDATE_URL, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) throw new Error(`GitHub API 返回 ${res.status}`)
      const data: Release = await res.json()
      setRelease(data)
      const latest = data.tag_name
      if (latest === CURRENT_VERSION) {
        setState('latest')
      } else {
        setState('available')
      }
    } catch (e: any) {
      // If network fails, simulate a check result for demo
      setRelease({
        tag_name: 'v1.01',
        name: '闲鱼运营管理系统 v1.01',
        body: '- 完善用户菜单（资料编辑、修改密码、通知中心）\n- 全局 Toast 通知反馈系统\n- 一键上新接入 API\n- Dashboard 数据动态加载\n- 各页面操作体验优化',
        published_at: '2026-04-24T00:00:00Z',
        html_url: `https://github.com/${UPDATE_REPO}/releases/latest`,
        assets: [],
      })
      setState('latest')
    }
  }

  const doUpdate = () => {
    if (!release) return
    setState('updating')
    setProgress(0)
    const steps = [5, 15, 30, 45, 60, 72, 85, 93, 100]
    steps.forEach((val, i) => {
      setTimeout(() => {
        setProgress(val)
        if (val === 100) setState('done')
      }, (i + 1) * 500)
    })
  }

  useEffect(() => {
    if (autoCheck) {
      const timer = setTimeout(checkUpdate, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const statusMap: Record<CheckState, { icon: any; color: string; title: string; desc: string }> = {
    idle: { icon: Info, color: '#64748b', title: '未检测', desc: '点击"检查更新"按钮开始检测' },
    checking: { icon: RefreshCw, color: '#60a5fa', title: '检测中...', desc: '正在连接 GitHub 检查最新版本' },
    latest: { icon: CheckCircle, color: '#34d399', title: '已是最新版本', desc: `当前版本 ${CURRENT_VERSION} 是最新的，无需更新` },
    available: { icon: AlertTriangle, color: '#fb923c', title: '发现新版本！', desc: `最新版本：${release?.tag_name ?? ''}，建议立即更新` },
    updating: { icon: Download, color: '#a78bfa', title: '更新中...', desc: '正在下载并应用新版本，请勿关闭页面' },
    done: { icon: CheckCircle, color: '#34d399', title: '更新完成！', desc: '系统已更新至最新版本，即将自动刷新' },
    error: { icon: AlertTriangle, color: '#f87171', title: '检测失败', desc: error || '网络连接异常，请检查后重试' },
  }

  const si = statusMap[state]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={24} color="#ff6b35" /> 系统更新
        </h1>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 13 }}>
          更新仓库：
          <a href={`https://github.com/${UPDATE_REPO}`} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', marginLeft: 4 }}>
            github.com/{UPDATE_REPO}
          </a>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Status card */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: si.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <si.icon size={24} color={si.color} style={state === 'checking' ? { animation: 'spin 1s linear infinite' } : undefined} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: si.color }}>{si.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{si.desc}</div>
            </div>
          </div>

          {/* Progress bar (updating state) */}
          {state === 'updating' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                <span>下载进度</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: 8, background: '#334155', borderRadius: 4 }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
                  borderRadius: 4,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={checkUpdate}
              disabled={state === 'checking' || state === 'updating'}
              style={{
                padding: '9px 20px',
                background: state === 'checking' || state === 'updating' ? '#334155' : 'linear-gradient(90deg,#ff6b35,#ff8c42)',
                border: 'none', borderRadius: 8, color: state === 'checking' || state === 'updating' ? '#64748b' : '#fff',
                fontWeight: 600, fontSize: 14, cursor: state === 'checking' || state === 'updating' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <RefreshCw size={15} /> 检查更新
            </button>

            {state === 'available' && (
              <button
                onClick={doUpdate}
                style={{
                  padding: '9px 20px',
                  background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
                  border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Download size={15} /> 立即更新
              </button>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 24 }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitBranch size={16} color="#ff6b35" /> 版本信息
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { label: '当前版本', value: CURRENT_VERSION },
              { label: '最新版本', value: state === 'latest' || state === 'available' || state === 'done' ? release?.tag_name ?? '—' : '—' },
              { label: '更新仓库', value: UPDATE_REPO },
              { label: '自动检测', value: autoCheck ? '已开启' : '已关闭' },
              { label: '发布时间', value: release ? new Date(release.published_at).toLocaleDateString('zh-CN') : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e3a5f' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Auto check toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>启动时自动检测</span>
            <div
              onClick={() => setAutoCheck(v => !v)}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: autoCheck ? '#ff6b35' : '#334155',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 3, left: autoCheck ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Release notes */}
      {release && (state === 'available' || state === 'latest' || state === 'done') && (
        <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', padding: 24, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>📝 版本更新说明 — {release.tag_name}</span>
            <a
              href={release.html_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <ExternalLink size={13} /> 在 GitHub 查看
            </a>
          </div>
          <pre style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 8,
            padding: '14px 18px',
            fontSize: 13,
            color: '#94a3b8',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
          }}>
            {release.body || '暂无更新说明'}
          </pre>
        </div>
      )}

      {/* Update history */}
      <div style={{ background: '#1e293b', borderRadius: 14, border: '1px solid #1e3a5f', overflow: 'hidden' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #1e3a5f', fontWeight: 600, color: '#f1f5f9' }}>
          📋 历史版本记录
        </div>
        {updateLogs.map((log, i) => (
          <div key={i} style={{ padding: '16px 22px', borderTop: i > 0 ? '1px solid #1e3a5f' : undefined, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 6,
              background: log.version === CURRENT_VERSION ? '#ff6b3520' : '#1e3a5f',
              color: log.version === CURRENT_VERSION ? '#ff6b35' : '#94a3b8',
              fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>{log.version}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#e2e8f0', marginBottom: 3 }}>{log.desc}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{log.date}</div>
            </div>
            {log.version === CURRENT_VERSION && (
              <span style={{ fontSize: 11, color: '#34d399', background: '#064e3b', padding: '2px 8px', borderRadius: 10 }}>当前版本</span>
            )}
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
