"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Book, MessageSquare, Search, Video } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import FaqItem from "@/components/faq-item"

const SupportCard = ({
  icon,
  title,
  description,
  action,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: string
  gradient: string
}) => {
  return (
    <Card className="border-orange-200/50 dark:border-orange-900/30 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className={`mb-4 p-3 bg-gradient-to-br ${gradient} rounded-lg inline-block`}>{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <Button
          variant="outline"
          className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50 w-full"
        >
          {action} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
              <span className="text-orange-600 dark:text-orange-400">Help & Support</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Find answers to your questions, get help with technical issues, or contact our support team.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <SupportCard
                icon={<Book className="h-6 w-6 text-white" />}
                title="Documentation"
                description="Comprehensive guides and API documentation to help you get the most out of RunAsh AI."
                action="Browse Docs"
                gradient="from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400"
              />
              <SupportCard
                icon={<Video className="h-6 w-6 text-white" />}
                title="Video Tutorials"
                description="Step-by-step video guides covering everything from basic setup to advanced features."
                action="Watch Tutorials"
                gradient="from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400"
              />
              <SupportCard
                icon={<MessageSquare className="h-6 w-6 text-white" />}
                title="Live Chat"
                description="Get instant help from our support team. Available 24/7 for all your questions."
                action="Start Chat"
                gradient="from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400"
              />
            </div>

            <Tabs defaultValue="faq" className="mb-8">
              <TabsList className="bg-orange-100/50 dark:bg-orange-900/20">
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="contact">Contact Support</TabsTrigger>
                <TabsTrigger value="status">System Status</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="faq" className="mt-8">
                <div className="max-w-3xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                  <div className="space-y-4">
                    <FaqItem
                      question="How do I get started with RunAsh AI?"
                      answer="Getting started is easy! Sign up for an account, connect your streaming platforms, and follow our quick setup guide. You'll be streaming with AI enhancements in minutes."
                    />
                    <FaqItem
                      question="What streaming platforms does RunAsh support?"
                      answer="RunAsh supports all major streaming platforms including Twitch, YouTube, Facebook Live, Instagram Live, TikTok Live, and many more. You can stream to multiple platforms simultaneously."
                    />
                    <FaqItem
                      question="Do I need special hardware to use RunAsh AI?"
                      answer="No special hardware is required! RunAsh works with standard streaming equipment. Our AI processing happens in the cloud, so you don't need a powerful computer."
                    />
                    <FaqItem
                      question="How does the AI video enhancement work?"
                      answer="Our AI analyzes your video stream in real-time and automatically adjusts lighting, reduces noise, enhances details, and optimizes colors to improve your stream quality."
                    />
                    <FaqItem
                      question="Can I cancel my subscription at any time?"
                      answer="Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your billing period."
                    />
                    <FaqItem
                      question="Is my data secure with RunAsh?"
                      answer="Absolutely. We use enterprise-grade security measures to protect your data. All video processing is done securely in the cloud, and we never store your stream content."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-8">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Contact Our Support Team</h2>
                  <Card className="border-orange-200/50 dark:border-orange-900/30">
                    <CardContent className="p-6">
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <Input className="bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                              type="email"
                              className="bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Subject</label>
                          <Input className="bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Message</label>
                          <Textarea
                            rows={6}
                            className="bg-white/50 dark:bg-gray-900/50 border-orange-200 dark:border-orange-800/30 focus:border-orange-500/70"
                          />
                        </div>
                        <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white w-full">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="status" className="mt-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">System Status</h2>
                  <div className="space-y-4">
                    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium">All Systems Operational</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Last updated: 2 minutes ago</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-orange-200/50 dark:border-orange-900/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span>AI Processing</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200/50 dark:border-orange-900/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span>Streaming Infrastructure</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200/50 dark:border-orange-900/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span>API Services</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200/50 dark:border-orange-900/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span>Dashboard</span>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Community Support</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-orange-200/50 dark:border-orange-900/30">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3">Discord Community</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Join our Discord server to connect with other streamers, get help from the community, and stay
                          updated on the latest news.
                        </p>
                        <Button className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 dark:from-orange-500 dark:to-yellow-500 dark:hover:from-orange-600 dark:hover:to-yellow-600 text-white">
                          Join Discord
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200/50 dark:border-orange-900/30">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3">Community Forum</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Browse our community forum for discussions, tips, and solutions shared by other RunAsh users.
                        </p>
                        <Button
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/50"
                        >
                          Visit Forum
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
