"use client"

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
}
