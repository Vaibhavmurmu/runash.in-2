'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Calendar, Clock, Search, User } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

type PostMeta = {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image?: string
  slug: string
}

export default function BlogClient({ posts }: { posts: PostMeta[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(6)
  const [email, setEmail] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return posts
      .filter((p) => activeTab === 'all' || p.category.toLowerCase().includes(activeTab.toLowerCase()))
      .filter((p) => (q ? `${p.title} ${p.excerpt} ${p.author}`.toLowerCase().includes(q) : true))
  }, [posts, searchQuery, activeTab])

  async function handleSubscribe() {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error('Subscription failed')
      setEmail('')
      alert('Thanks for subscribing — check your inbox for a confirmation email.')
    } catch (e) {
      alert('Failed to subscribe. Try again later.')
    }
  }

  const BlogCard = ({ p }: { p: PostMeta }) => (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img src={p.image || '/placeholder.svg'} alt={p.title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">{p.category}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{p.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{p.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><User className="h-4 w-4" /><span>{p.author}</span></div>
            <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(p.date).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{p.readTime}</span></div>
          </div>
          <Link href={`/blog/${p.slug}`} legacyBehavior>
            <Button variant="ghost" size="sm" className="text-orange-600">Read More <ArrowRight className="ml-1 h-3 w-3" /></Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end py-6"><ThemeToggle /></div>

      <div className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v)} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
          <TabsTrigger value="product updates">Product Updates</TabsTrigger>
          <TabsTrigger value="ai research">AI Research</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.slice(0, visibleCount).map((p) => (<BlogCard key={p.slug} p={p} />))}
          </div>
        </TabsContent>
      </Tabs>

      {visibleCount < filtered.length && (
        <div className="mt-8 text-center"><Button onClick={() => setVisibleCount((c) => c + 6)}>Load more</Button></div>
      )}

      <div className="mt-16 p-8 rounded-xl bg-orange-50">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest updates.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSubscribe}>Subscribe</Button>
        </div>
      </div>
    </div>
  )
}
