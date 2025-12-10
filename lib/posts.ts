import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type PostMeta = {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
  image?: string
  slug: string
  content?: string
}

const postsDir = path.join(process.cwd(), 'content', 'posts')

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
  const posts = files.map((file) => {
    const full = path.join(postsDir, file)
    const raw = fs.readFileSync(full, 'utf8')
    const { data, content } = matter(raw)

    return {
      title: data.title || '',
      excerpt: data.excerpt || '',
      author: data.author || '',
      date: data.date || '',
      readTime: data.readTime || '',
      category: data.category || '',
      image: data.image || '',
      slug: data.slug || file.replace(/\.mdx?$/, ''),
      content: content || '',
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  const posts = getAllPosts()
  return posts.find((p) => p.slug === slug)
}
