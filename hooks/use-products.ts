"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/products/${id}` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    product: data,
    isLoading,
    error,
  }
}

export function useProducts(category?: string, limit = 20) {
  const query = category ? `/api/products?category=${category}&limit=${limit}` : `/api/products?limit=${limit}`

  const { data, error, isLoading } = useSWR(query, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    products: data?.products || [],
    isLoading,
    error,
  }
}

export function useFeaturedProducts(limit = 10) {
  const { data, error, isLoading } = useSWR(`/api/products/featured?limit=${limit}`, fetcher)

  return {
    products: data?.products || [],
    isLoading,
    error,
  }
}
