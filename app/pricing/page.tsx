"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import FaqItem from "@/components/faq-item"

const PricingCard = ({
  title,
  price,
  yearlyPrice,
  description,
  features,
  buttonText,
  popular = false,
  isYearly = false,
}: {
  title: string
  price: string
  yearlyPrice: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  isYearly?: boolean
}) => {
  const currentPrice = isYearly ? yearlyPrice : price
  const savings = isYearly && title !== "Starter" ? "Save 20%" : null

  return (
    <Card
      className={`relative ${popular ? "border-orange-500 shadow-lg shadow-orange-500/20" : "border-orange-200/50 dark:border-orange-900/30"}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <div className="mb-4">
            <span className="text-4xl font-bold">{currentPrice}</span>
            <span className="text-gray-600 dark:text-gray-400">/month</span>
            {savings && (
              <div className="mt-1">
                <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900/30">
                  {savings}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full ${
            popular
              ? "bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white"
              : "border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50"
          }`}
          variant={popular ? "default" : "outline"}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-orange-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
              <span className="text-orange-600 dark:text-orange-400">Simple Pricing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className={`${!isYearly ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`${isYearly ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}
              >
                Yearly
              </span>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Save 20%</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Starter"
                price="Free"
                yearlyPrice="Free"
                description="Perfect for trying out RunAsh AI"
                features={[
                  "720p AI Enhancement",
                  "Basic Chat Moderation",
                  "5 Hours Monthly Streaming",
                  "Single Platform Streaming",
                  "Community Support",
                  "Basic Analytics",
                ]}
                buttonText="Get Started Free"
                isYearly={isYearly}
              />

              <PricingCard
                title="Professional"
                price="$29"
                yearlyPrice="$23"
                description="For serious content creators"
                features={[
                  "1080p AI Enhancement",
                  "Advanced Chat Moderation",
                  "50 Hours Monthly Streaming",
                  "Multi-platform Streaming (3 platforms)",
                  "Custom Overlays & Backgrounds",
                  "Priority Support",
                  "Advanced Analytics",
                  "Stream Recording",
                  "API Access",
                ]}
                buttonText="Start Professional"
                popular={true}
                isYearly={isYearly}
              />

              <PricingCard
                title="Enterprise"
                price="$99"
                yearlyPrice="$79"
                description="For teams and businesses"
                features={[
                  "4K AI Enhancement",
                  "Premium Chat Moderation",
                  "Unlimited Streaming",
                  "Unlimited Platform Streaming",
                  "Custom Branding",
                  "24/7 Dedicated Support",
                  "Advanced Analytics & Reports",
                  "Team Management",
                  "Custom Integrations",
                  "SLA Guarantee",
                  "Dedicated Account Manager",
                ]}
                buttonText="Contact Sales"
                isYearly={isYearly}
              />
            </div>

            {/* Enterprise CTA */}
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border border-orange-200 dark:border-orange-800/30">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 text-orange-800 dark:text-orange-300">
                  Need a Custom Solution?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  We offer custom enterprise solutions with dedicated infrastructure, white-label options, and
                  specialized support.
                </p>
                <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                  Contact Enterprise Sales <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gradient-to-b from-white via-orange-50/50 to-white dark:from-gray-950 dark:via-orange-950/20 dark:to-gray-950 relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
              <p className="text-gray-600 dark:text-gray-400">See what's included in each plan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-orange-200 dark:border-orange-900/30">
                    <th className="text-left p-4 font-medium">Features</th>
                    <th className="text-center p-4 font-medium">Starter</th>
                    <th className="text-center p-4 font-medium">Professional</th>
                    <th className="text-center p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">AI Video Enhancement</td>
                    <td className="text-center p-4">720p</td>
                    <td className="text-center p-4">1080p</td>
                    <td className="text-center p-4">4K</td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">Monthly Streaming Hours</td>
                    <td className="text-center p-4">5 hours</td>
                    <td className="text-center p-4">50 hours</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">Platform Streaming</td>
                    <td className="text-center p-4">1 platform</td>
                    <td className="text-center p-4">3 platforms</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">Chat Moderation</td>
                    <td className="text-center p-4">Basic</td>
                    <td className="text-center p-4">Advanced</td>
                    <td className="text-center p-4">Premium</td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">Custom Branding</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">Limited</td>
                    <td className="text-center p-4">Full</td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">API Access</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-orange-100 dark:border-orange-900/20">
                    <td className="p-4 font-medium">Support</td>
                    <td className="text-center p-4">Community</td>
                    <td className="text-center p-4">Priority</td>
                    <td className="text-center p-4">24/7 Dedicated</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-6">
              <FaqItem
                question="Can I change my plan at any time?"
                answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
              />
              <FaqItem
                question="What happens if I exceed my streaming hours?"
                answer="If you exceed your monthly streaming hours, you'll receive a notification. You can either upgrade your plan or purchase additional hours at a discounted rate."
              />
              <FaqItem
                question="Do you offer refunds?"
                answer="We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
              />
              <FaqItem
                question="Is there a free trial for paid plans?"
                answer="Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial."
              />
              <FaqItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards, PayPal, and bank transfers for Enterprise customers. All payments are processed securely."
              />
              <FaqItem
                question="Can I cancel my subscription anytime?"
                answer="Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period, and you won't be charged again."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-950 border-t border-orange-200/50 dark:border-orange-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} RunAsh AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
