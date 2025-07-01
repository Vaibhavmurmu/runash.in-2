"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Download, Calendar, Zap, Check, ArrowUpRight, AlertCircle } from "lucide-react"

export default function BillingPage() {
  const [currentPlan] = useState({
    name: "Creator Plan",
    price: 29,
    billing: "monthly",
    features: [
      "Up to 10 concurrent streams",
      "1080p streaming quality",
      "Basic AI tools",
      "Community chat",
      "Analytics dashboard",
      "Email support",
    ],
    usage: {
      streams: { used: 7, limit: 10 },
      storage: { used: 45, limit: 100 },
      bandwidth: { used: 2.1, limit: 5 },
    },
  })

  const plans = [
    {
      name: "Starter",
      price: 0,
      billing: "monthly",
      description: "Perfect for getting started",
      features: ["Up to 3 concurrent streams", "720p streaming quality", "Basic chat features", "Community support"],
      popular: false,
    },
    {
      name: "Creator",
      price: 29,
      billing: "monthly",
      description: "For serious content creators",
      features: [
        "Up to 10 concurrent streams",
        "1080p streaming quality",
        "Basic AI tools",
        "Priority support",
        "Advanced analytics",
      ],
      popular: true,
    },
    {
      name: "Pro",
      price: 99,
      billing: "monthly",
      description: "For professional streamers",
      features: [
        "Unlimited concurrent streams",
        "4K streaming quality",
        "Advanced AI tools",
        "24/7 phone support",
        "Custom branding",
      ],
      popular: false,
    },
  ]

  const invoices = [
    { id: "INV-001", date: "2024-01-01", amount: 29, status: "paid" },
    { id: "INV-002", date: "2023-12-01", amount: 29, status: "paid" },
    { id: "INV-003", date: "2023-11-01", amount: 29, status: "paid" },
    { id: "INV-004", date: "2023-10-01", amount: 29, status: "paid" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription, billing, and usage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Current Plan
                <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">{currentPlan.name}</Badge>
              </CardTitle>
              <CardDescription>You're currently on the {currentPlan.name} plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">${currentPlan.price}</div>
                  <div className="text-sm text-muted-foreground">per {currentPlan.billing}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Next billing date</div>
                  <div className="font-medium">February 1, 2024</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Concurrent Streams</span>
                      <span>
                        {currentPlan.usage.streams.used}/{currentPlan.usage.streams.limit}
                      </span>
                    </div>
                    <Progress value={(currentPlan.usage.streams.used / currentPlan.usage.streams.limit) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage (GB)</span>
                      <span>
                        {currentPlan.usage.storage.used}/{currentPlan.usage.storage.limit}
                      </span>
                    </div>
                    <Progress value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bandwidth (TB)</span>
                      <span>
                        {currentPlan.usage.bandwidth.used}/{currentPlan.usage.bandwidth.limit}
                      </span>
                    </div>
                    <Progress value={(currentPlan.usage.bandwidth.used / currentPlan.usage.bandwidth.limit) * 100} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Choose the plan that best fits your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-lg border p-4 ${
                      plan.popular
                        ? "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100"
                        : "border-border"
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                        Current Plan
                      </Badge>
                    )}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/{plan.billing}</span>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"} disabled={plan.popular}>
                        {plan.popular ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Download your invoices and view payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200">
                        <CreditCard className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-sm text-muted-foreground">{invoice.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">${invoice.amount}</div>
                        <Badge variant="secondary" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded bg-gradient-to-br from-blue-100 to-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/25</div>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Update Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Billing History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                Usage Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You're using 70% of your concurrent stream limit. Consider upgrading to avoid interruptions.
              </p>
              <Button
                size="sm"
                className="mt-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
