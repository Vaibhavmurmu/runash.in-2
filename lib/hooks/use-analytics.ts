"use client"

import { useEffect, useMemo, useState } from "react"
import type { AnalyticsDaily, Totals, UUID } from "@/lib/types"

export function useAnalytics(userId?: UUID, days = 30) {
  const [dailyAnalytics, setDaily] = useState<AnalyticsDaily[]>([])
  const [totals, setTotals] = useState<Totals>({ revenue: 0, viewers: 0, streams: 0, engagement: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    fetch(`/api/analytics?userId=${userId}&days=${days}`)
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return
        setDaily(j.data?.dailyAnalytics ?? [])
        setTotals(j.data?.totals ?? { revenue: 0, viewers: 0, streams: 0, engagement: 0 })
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [userId, days])

  const getTotalRevenue = useMemo(() => () => totals.revenue, [totals.revenue])
  const getTotalViewers = useMemo(() => () => totals.viewers, [totals.viewers])

  return { dailyAnalytics, totals, getTotalRevenue, getTotalViewers, loading, error }
}
