"use client"

import { useState, useEffect } from "react"
import { MapPin, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const countries = [
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York", flag: "🇺🇸" },
  { code: "SG", name: "Singapore", currency: "SGD", timezone: "Asia/Singapore", flag: "🇸🇬" },
 // { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London", flag: "🇬🇧" }, 
 // { code: "CA", name: "Canada", currency: "CAD", timezone: "America/Toronto", flag: "🇨🇦" }, 
 // { code: "AU", name: "Australia", currency: "AUD", timezone: "Australia/Sydney", flag: "🇦🇺" }, 
 // { code: "DE", name: "Germany", currency: "EUR", timezone: "Europe/Berlin", flag: "🇩🇪" }, 
 // { code: "FR", name: "France", currency: "EUR", timezone: "Europe/Paris", flag: "🇫🇷" }, 
 // { code: "JP", name: "Japan", currency: "JPY", timezone: "Asia/Tokyo", flag: "🇯🇵" }, 
 // { code: "KR", name: "South Korea", currency: "KRW", timezone: "Asia/Seoul", flag: "🇰🇷" }, 
 // { code: "CN", name: "China", currency: "CNY", timezone: "Asia/Shanghai", flag: "🇨🇳" }, 
 // { code: "BR", name: "Brazil", currency: "BRL", timezone: "America/Sao_Paulo", flag: "🇧🇷" }, 
 // { code: "MX", name: "Mexico", currency: "MXN", timezone: "America/Mexico_City", flag: "🇲🇽" }, 
 // { code: "SG", name: "Singapore", currency: "SGD", timezone: "Asia/Singapore", flag: "🇸🇬" },
 // { code: "NL", name: "Netherlands", currency: "EUR", timezone: "Europe/Amsterdam", flag: "🇳🇱" }, 
 // { code: "SE", name: "Sweden", currency: "SEK", timezone: "Europe/Stockholm", flag: "🇸🇪" },  
// { code: "CH", name: "Switzerland", currency: "CHF", timezone: "Europe/Zurich", flag: "🇨🇭" }, 
]

export function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved country preference
    const savedCountry = localStorage.getItem("runash-country")
    if (savedCountry) {
      const country = countries.find((c) => c.code === savedCountry)
      if (country) {
        setSelectedCountry(country)
      }
    } else {
      // Auto-detect country from timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const detectedCountry = countries.find((c) => c.timezone === userTimezone)
      if (detectedCountry) {
        setSelectedCountry(detectedCountry)
      } else {
        // Fallback: try to detect from locale
        const locale = navigator.language
        const countryCode = locale.split("-")[1]
        if (countryCode) {
          const localeCountry = countries.find((c) => c.code === countryCode.toUpperCase())
          if (localeCountry) {
            setSelectedCountry(localeCountry)
          }
        }
      }
    }
  }, [])

  const handleCountryChange = async (country: (typeof countries)[0]) => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("runash-country", country.code)

      // Update state
      setSelectedCountry(country)

      // Here you would typically make an API call to save user preference
      // await updateUserCountryPreference(country.code)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // You might want to update pricing, content, or other regional features
      // updateRegionalContent(country)
    } catch (error) {
      console.error("Failed to update country:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs boarder hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={isLoading}
        >
          <MapPin className="h-3 w-3 mr-1" />
          <span className="mr-1">{selectedCountry.flag}</span>
          <span className="hidden sm:inline">{selectedCountry.name}</span>
          <span className="sm:hidden">{selectedCountry.code}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{country.name}</span>
                <span className="text-xs text-gray-500">
                  {country.currency} • {country.timezone.split("/")[1]?.replace("_", " ")}
                </span>
              </div>
            </div>
            {selectedCountry.code === country.code && <Check className="h-4 w-4 text-orange-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
