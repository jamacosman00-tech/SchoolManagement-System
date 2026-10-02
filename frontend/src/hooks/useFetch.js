import { useState, useEffect, useCallback, useRef } from 'react'

const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!fetchFn) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      if (mountedRef.current) {
        setData(response.data)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data')
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, deps)

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    return () => {
      mountedRef.current = false
    }
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export default useFetch
