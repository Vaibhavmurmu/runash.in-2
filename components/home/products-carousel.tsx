"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  items: Array<{ id: string | number; name: string; price?: number; image?: string; sustainability_score?: number }>
}

export default function ProductCarousel({ items = [] }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4">
        {items.map((p) => (
          <Card key={p.id} className="min-w-[220px] p-3">
            <div className="h-36 bg-gray-50 rounded-md flex items-center justify-center mb-3 overflow-hidden">
              <img src={p.image || "/placeholder.svg?height=160&width=240"} alt={p.name} className="object-cover h-full w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                {typeof p.price !== "undefined" && <div className="text-sm text-gray-500">${p.price}</div>}
              </div>
              <Button size="sm" onClick={() => alert(`Add ${p.name} to cart (integrate real cart)`)}>Add</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
