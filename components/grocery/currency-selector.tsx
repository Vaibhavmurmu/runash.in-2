"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DollarSign, IndianRupee, Globe } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

export default function CurrencySelector() {
  const { currency, setCurrency, exchangeRate } = useCurrency()

  const currencies = [
    {
      code: "USD" as const,
      name: "US Dollar",
      symbol: "$",
      icon: DollarSign,
      flag: "🇺🇸",
    },
    {
      code: "INR" as const,
      name: "Indian Rupee",
      symbol: "₹",
      icon: IndianRupee,
      flag: "🇮🇳",
    },
  ]

  const currentCurrency = currencies.find((c) => c.code === currency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentCurrency?.flag}</span>
          <span className="font-medium">{currentCurrency?.code}</span>
          <span className="text-sm text-muted-foreground">{currentCurrency?.symbol}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {currencies.map((curr) => {
          const Icon = curr.icon
          const isSelected = curr.code === currency

          return (
            <DropdownMenuItem
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
              className={`flex items-center justify-between p-3 cursor-pointer ${
                isSelected ? "bg-green-50 dark:bg-green-950/30" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{curr.flag}</span>
                <Icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{curr.name}</div>
                  <div className="text-sm text-muted-foreground">{curr.code}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{curr.symbol}</span>
                {isSelected && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          )
        })}

        <div className="border-t mt-2 pt-2 px-3 py-2">
          <div className="text-xs text-muted-foreground">Exchange Rate: 1 USD = ₹{exchangeRate.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground mt-1">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
