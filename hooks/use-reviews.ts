"use client"

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProductReviews(productId: string) {
  const { data, error, isLoading, mutate } = useSWR(productId ? `/api/reviews?productId=${productId}` : null, fetcher)

  return {
    reviews: data?.reviews || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export const useCreateReview = () => {
  const create = useCallback(async (reviewData: any) => {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    })

    if (!response.ok) throw new Error("Failed to create review")
    return response.json()
  }, [])

  return { create }
}
