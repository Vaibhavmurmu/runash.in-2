"use client"

import { useState, useEffect } from "react"
import { Globe, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
 // { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
 //  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
 // { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
 // { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
 // { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
 // { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
 // { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
 // { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
]

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("runash-language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setSelectedLanguage(language)
      }
    } else {
      // Auto-detect language from browser
      const browserLanguage = navigator.language.split("-")[0]
      const detectedLanguage = languages.find((lang) => lang.code === browserLanguage)
      if (detectedLanguage) {
        setSelectedLanguage(detectedLanguage)
      }
    }
  }, [])

  const handleLanguageChange = async (language: (typeof languages)[0]) => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("runash-language", language.code)

      // Update state
      setSelectedLanguage(language)

      // Here you would typically make an API call to save user preference
      // await updateUserLanguagePreference(language.code)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // You might want to reload the page or update the app's language context
      // window.location.reload()
    } catch (error) {
      console.error("Failed to update language:", error)
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
          className="h-8 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={isLoading}
        >
          <Globe className="h-3 w-3 mr-1" />
          <span className="mr-1">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.name}</span>
          <span className="sm:hidden">{selectedLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.name}</span>
                <span className="text-xs text-gray-500">{language.nativeName}</span>
              </div>
            </div>
            {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-orange-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
