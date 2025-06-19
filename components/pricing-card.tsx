import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  buttonText: string
  popular?: boolean
}

export default function PricingCard({ title, price, features, buttonText, popular = false }: PricingCardProps) {
  return (
    <div
      className={`
      relative rounded-xl overflow-hidden
      ${
        popular
          ? "border-2 border-orange-500 bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-900/80"
          : "border border-orange-200 dark:border-orange-800/20 bg-white dark:bg-gray-900"
      }
      backdrop-blur-sm p-6 flex flex-col shadow-lg shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 hover:translate-y-[-5px]
    `}
    >
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
            MOST POPULAR
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
        <span className="text-gray-500 dark:text-gray-400">/month</span>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={
          popular
            ? "bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white w-full"
            : "bg-white dark:bg-gray-900 border border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 w-full"
        }
      >
        {buttonText}
      </Button>
    </div>
  )
}

{/* "use client"

import { Button } from "@/components/ui/button"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  buttonText: string
  popular?: boolean
  onButtonClick?: () => void
}

export default function PricingCard({
  title,
  price,
  features,
  buttonText,
  popular = false,
  onButtonClick,
}: PricingCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-md">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <div className="text-4xl font-bold mb-4">{price}</div>
      <ul className="mb-6">
        {features.map((feature, index) => (
          <li key={index} className="mb-2">
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={popular ? "default" : "outline"} onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  )
} */}
