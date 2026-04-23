import { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(apiFn: (...args: any[]) => Promise<any>, defaultData?: T) {
  const [state, setState] = useState<UseApiState<T>>({
    data: defaultData ?? null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (...args: any[]) => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await apiFn(...args)
      const data = res?.data ?? res
      setState({ data, loading: false, error: null })
      return data
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || '请求失败'
      setState(s => ({ ...s, loading: false, error: msg }))
      throw e
    }
  }, [apiFn])

  return { ...state, execute, setState }
}

export function useMockFallback<T>(apiFn: (...args: any[]) => Promise<any>, mockData: T) {
  const [data, setData] = useState<T>(mockData)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true)
    try {
      const res = await apiFn(...args)
      const d = res?.data ?? res
      setData(d)
      return d
    } catch {
      // fallback to mock silently
      return data
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, execute, setData }
}
