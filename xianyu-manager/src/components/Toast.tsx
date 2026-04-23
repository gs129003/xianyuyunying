import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap: Record<ToastType, string> = {
  success: '#34d399',
  error: '#f87171',
  warning: '#fb923c',
  info: '#60a5fa',
}

const bgMap: Record<ToastType, string> = {
  success: '#064e3b',
  error: '#450a0a',
  warning: '#431407',
  info: '#1e3a5f',
}

function ToastItem({ toast: t, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = iconMap[t.type]

  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 10,
        background: '#1e293b', border: `1px solid ${colorMap[t.type]}40`,
        boxShadow: `0 8px 30px ${colorMap[t.type]}20`,
        animation: 'toastIn 0.3s ease',
        minWidth: 280, maxWidth: 420,
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${bgMap[t.type]}`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={15} color={colorMap[t.type]} />
      </div>
      <span style={{ flex: 1, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{t.message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 2, lineHeight: 1 }}
      >
        ✕
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const value: ToastContextValue = {
    toast: addToast,
    success: useCallback((m: string) => addToast('success', m), [addToast]),
    error: useCallback((m: string) => addToast('error', m), [addToast]),
    warning: useCallback((m: string) => addToast('warning', m), [addToast]),
    info: useCallback((m: string) => addToast('info', m), [addToast]),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
