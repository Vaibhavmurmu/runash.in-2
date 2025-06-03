"use client"

import { useState } from "react"
import { Check, ChevronDown, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Country {
  code: string
  name: string
}

interface CountrySelectorProps {
  className?: string
}

const countries: Country[] = [
  { code: "in", name: "India" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "sg", name: "Singapore" },
  { code: "ae", name: "United Arab Emirates" },
]

export function CountrySelector({ className = "" }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
    // Here you would implement the actual country change logic
    // For example, storing in localStorage or calling an API
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        >
          <MapPin className="h-4 w-4" />
          <span>{selectedCountry.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{country.name}</span>
            {selectedCountry.code === country.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
