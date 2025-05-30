import { Button } from "@/components/ui/button"
import { Play, Zap, Users, Shield, ArrowRight, ChevronRight, Star, BarChart, Globe } from "lucide-react"
import VideoBackground from "@/components/video-background"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import PricingCard from "@/components/pricing-card"
import Navbar from "@/components/navbar"
import StatCounter from "@/components/stat-counter"
import TechBadge from "@/components/tech-badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <VideoBackground />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
            <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
              Next Generation AI Streaming
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
            Elevate Your Live Streams with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            The most advanced AI-powered live streaming platform for creators, gamers, and businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10"
            >
              Start Streaming <Play className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Tech badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <TechBadge label="Real-time AI" />
            <TechBadge label="4K Quality" />
            <TechBadge label="Low Latency" />
            <TechBadge label="Multi-platform" />
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <ChevronRight className="h-8 w-8 transform rotate-90 text-orange-500 dark:text-orange-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCounter value={5000} label="Active Streamers" />
            <StatCounter value={1500000} label="Monthly Viewers" suffix="+" />
            <StatCounter value={99.9} label="Uptime Percentage" suffix="%" />
            <StatCounter value={120} label="Countries Reached" suffix="+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              AI-Powered Streaming Tools
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Unlock the full potential of your content with our cutting-edge AI features designed for modern creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-white" />}
              title="AI-Enhanced Streaming"
              description="Automatically enhance your video quality, reduce noise, and optimize bandwidth in real-time with our proprietary AI algorithms."
              gradient="from-orange-600 to-yellow-500"
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-white" />}
              title="Smart Audience Engagement"
              description="AI-powered chat moderation, sentiment analysis, and audience analytics to boost engagement and grow your community."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-white" />}
              title="Content Protection"
              description="Advanced AI content monitoring to protect your brand and comply with platform guidelines automatically."
              gradient="from-yellow-500 to-orange-600"
            />
            <FeatureCard
              icon={<BarChart className="h-6 w-6 text-white" />}
              title="Analytics Dashboard"
              description="Comprehensive analytics with AI-driven insights to understand your audience and optimize your content strategy."
              gradient="from-red-500 to-orange-500"
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-white" />}
              title="AI Content Suggestions"
              description="Get personalized content recommendations based on your audience preferences and trending topics."
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-white" />}
              title="Multi-platform Streaming"
              description="Stream simultaneously to multiple platforms with optimized settings for each destination."
              gradient="from-orange-600 to-red-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-orange-50 dark:bg-gray-950 border-y border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              How RunAsh Works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes and transform your streaming experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 aspect-video bg-gradient-to-br from-orange-600 to-yellow-500 dark:from-orange-700 dark:to-yellow-600 flex items-center justify-center group relative">
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="h-20 w-20 text-white opacity-90 z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Sign Up & Connect</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    Create your account and connect your streaming sources in minutes. Our intuitive setup wizard guides
                    you through the process.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Customize Your Stream</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    Set up AI enhancements, overlays, and engagement tools. Choose from our library of templates or
                    create your own.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-br from-orange-600 to-yellow-500 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/20 dark:shadow-orange-500/10">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Go Live with AI</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    Start streaming with real-time AI enhancements and analytics. Monitor performance and engage with
                    your audience like never before.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">Success Stories</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              What Streamers Say
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of content creators who have transformed their streaming with RunAsh AI
            </p>
          </div>

          <ScrollArea className="w-full pb-8">
            <div className="flex space-x-6">
              <TestimonialCard
                name="Alex Chen"
                role="Gaming Streamer"
                image="/placeholder.svg?height=80&width=80"
                quote="RunAsh AI has doubled my viewer engagement and made streaming so much easier. The AI enhancements make my stream look professional without expensive equipment."
              />
              <TestimonialCard
                name="Sarah Johnson"
                role="Fitness Instructor"
                image="/placeholder.svg?height=80&width=80"
                quote="The AI video enhancement makes my fitness streams look professional without expensive equipment. My subscribers have increased by 200% since switching to RunAsh."
              />
              <TestimonialCard
                name="Michael Rodriguez"
                role="Tech Educator"
                image="/placeholder.svg?height=80&width=80"
                quote="The audience analytics have helped me tailor my content to what my viewers actually want. The AI content suggestions are spot on and have helped me grow my channel."
              />
              <TestimonialCard
                name="Emma Wilson"
                role="Music Artist"
                image="/placeholder.svg?height=80&width=80"
                quote="As a musician, audio quality is everything. RunAsh's AI audio enhancement has made my live performances sound studio-quality. My fans love it!"
              />
              <TestimonialCard
                name="David Park"
                role="Cooking Channel Host"
                image="/placeholder.svg?height=80&width=80"
                quote="The multi-camera AI switching is a game-changer for my cooking streams. It's like having a professional director for my channel. Absolutely worth every penny."
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-orange-50 dark:bg-gray-950 border-y border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 backdrop-blur-sm border border-orange-200 dark:border-orange-800/50">
              <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">Flexible Plans</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Select the perfect plan for your streaming needs with no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="$19"
              features={[
                "720p AI Enhancement",
                "Basic Chat Moderation",
                "5 Hours Monthly Streaming",
                "Standard Support",
                "Single Platform Streaming",
              ]}
              buttonText="Get Started"
              popular={false}
            />
            <PricingCard
              title="Professional"
              price="$49"
              features={[
                "1080p AI Enhancement",
                "Advanced Chat Moderation",
                "50 Hours Monthly Streaming",
                "Priority Support",
                "Custom Overlays",
                "Multi-platform Streaming (2)",
                "Analytics Dashboard",
              ]}
              buttonText="Choose Pro"
              popular={true}
            />
            <PricingCard
              title="Enterprise"
              price="$99"
              features={[
                "4K AI Enhancement",
                "Premium Chat Moderation",
                "Unlimited Streaming",
                "24/7 Support",
                "Custom Branding",
                "Multi-platform Streaming (unlimited)",
                "Advanced Analytics",
                "API Access",
                "Dedicated Account Manager",
              ]}
              buttonText="Contact Sales"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-600 to-yellow-500 dark:from-orange-700 dark:to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Streams?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of content creators who are elevating their streaming with RunAsh AI. Start your free 14-day
            trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg shadow-orange-700/20">
              Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-700/20">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-white/80 text-sm">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-gray-900 border-t border-orange-100 dark:border-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">RunAsh</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/press"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/features"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/integrations"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="/roadmap"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/tutorials"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="/tutorials"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Tutorials
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://twitter.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-orange-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} RunAsh AI. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">All systems operational</span>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <ThemeToggle />
              <div className="flex space-x-6">
                <a
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookies"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
