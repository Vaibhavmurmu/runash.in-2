"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Currency = "USD" | "INR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRate: number
  formatPrice: (price: number) => string
  convertPrice: (price: number, fromCurrency?: Currency) => number
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

// Mock exchange rate - in real app, fetch from API
const EXCHANGE_RATES = {
  USD_TO_INR: 83.25,
  INR_TO_USD: 0.012,
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [exchangeRate, setExchangeRate] = useState(EXCHANGE_RATES.USD_TO_INR)

  useEffect(() => {
    // Update exchange rate when currency changes
    setExchangeRate(currency === "USD" ? EXCHANGE_RATES.USD_TO_INR : EXCHANGE_RATES.INR_TO_USD)
  }, [currency])

  const formatPrice = (price: number): string => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
    } else {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price)
    }
  }

  const convertPrice = (price: number, fromCurrency: Currency = "USD"): number => {
    if (fromCurrency === currency) return price

    if (fromCurrency === "USD" && currency === "INR") {
      return price * EXCHANGE_RATES.USD_TO_INR
    } else if (fromCurrency === "INR" && currency === "USD") {
      return price * EXCHANGE_RATES.INR_TO_USD
    }

    return price
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
