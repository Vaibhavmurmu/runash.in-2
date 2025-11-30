"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useOrders(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/orders?userId=${userId}` : null, fetcher)

  return {
    orders: data?.orders || [],
    isLoading,
    error,
    mutate,
  }
}

export function useOrder(orderId: string) {
  const { data, error, isLoading } = useSWR(`/api/orders/${orderId}`, fetcher)

  return {
    order: data?.order,
    isLoading,
    error,
  }
}

export const useCreateOrder = () => {
  const create = useCallback(async (orderData: any) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) throw new Error("Failed to create order")
    return response.json()
  }, [])

  return { create }
}
