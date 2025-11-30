"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useWishlist(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/wishlist?userId=${userId}` : null, fetcher)

  return {
    items: data?.items || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export const useAddToWishlist = () => {
  const add = useCallback(async (productId: string) => {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })

    if (!response.ok) throw new Error("Failed to add to wishlist")
    return response.json()
  }, [])

  return { add }
}

export const useRemoveFromWishlist = () => {
  const remove = useCallback(async (productId: string) => {
    const response = await fetch(`/api/wishlist/${productId}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to remove from wishlist")
    return response.json()
  }, [])

  return { remove }
}
