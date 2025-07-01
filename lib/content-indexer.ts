import { neon } from "@neondatabase/serverless"
import { generateEmbedding, isOpenAIAvailable } from "./openai"
import type { IndexableContent } from "./search-types"

const sql = neon(process.env.DATABASE_URL!)

export class ContentIndexer {
  // Index a single piece of content
  async indexContent(content: IndexableContent): Promise<void> {
    try {
      console.log(`Indexing content: ${content.title}`)

      // Generate embedding if OpenAI is available
      let embedding = null
      if (isOpenAIAvailable) {
        const embeddingVector = await generateEmbedding(`${content.title} ${content.content}`)
        embedding = JSON.stringify(embeddingVector)
      }

      // Insert or update the document
      await sql`
        INSERT INTO search_documents (
          id, title, content, content_type, tags, url, metadata, embedding, created_at, updated_at
        ) VALUES (
          ${content.id},
          ${content.title},
          ${content.content},
          ${content.contentType},
          ${JSON.stringify(content.tags || [])},
          ${content.url || null},
          ${JSON.stringify(content.metadata || {})},
          ${embedding ? `${embedding}::vector` : null},
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          content_type = EXCLUDED.content_type,
          tags = EXCLUDED.tags,
          url = EXCLUDED.url,
          metadata = EXCLUDED.metadata,
          embedding = EXCLUDED.embedding,
          updated_at = NOW()
      `

      console.log(`Successfully indexed: ${content.title}`)
    } catch (error) {
      console.error(`Error indexing content ${content.id}:`, error)
      throw error
    }
  }

  // Index all users
  async indexUsers(): Promise<number> {
    try {
      console.log("Starting user indexing...")

      const users = await sql`
        SELECT 
          id::text as id,
          COALESCE(username, email, 'User') as title,
          COALESCE(bio, 'User profile') as content,
          email,
          username,
          created_at
        FROM users
        WHERE email IS NOT NULL
      `

      let indexed = 0
      for (const user of users) {
        await this.indexContent({
          id: `user_${user.id}`,
          title: user.title,
          content: `${user.content} ${user.email || ""} ${user.username || ""}`.trim(),
          contentType: "user",
          tags: ["user", "profile"],
          url: `/users/${user.id}`,
          metadata: {
            email: user.email,
            username: user.username,
            createdAt: user.created_at,
          },
          userId: user.id,
        })
        indexed++
      }

      console.log(`Indexed ${indexed} users`)
      return indexed
    } catch (error) {
      console.error("Error indexing users:", error)
      return 0
    }
  }

  // Index all files
  async indexFiles(): Promise<number> {
    try {
      console.log("Starting file indexing...")

      const files = await sql`
        SELECT 
          f.id::text as id,
          f.filename as title,
          COALESCE(f.description, f.filename) as content,
          f.file_type,
          f.file_size,
          f.user_id,
          f.created_at,
          f.metadata
        FROM stored_files f
        WHERE f.filename IS NOT NULL
      `

      let indexed = 0
      for (const file of files) {
        const tags = ["file", file.file_type || "unknown"]
        if (file.file_type) {
          if (file.file_type.startsWith("image/")) tags.push("image")
          if (file.file_type.startsWith("video/")) tags.push("video")
          if (file.file_type.startsWith("audio/")) tags.push("audio")
          if (file.file_type.includes("pdf")) tags.push("document", "pdf")
        }

        await this.indexContent({
          id: `file_${file.id}`,
          title: file.title,
          content: `${file.content} File type: ${file.file_type || "unknown"} Size: ${this.formatFileSize(
            file.file_size || 0,
          )}`,
          contentType: "file",
          tags,
          url: `/storage/files/${file.id}`,
          metadata: {
            fileType: file.file_type,
            fileSize: file.file_size,
            userId: file.user_id,
            createdAt: file.created_at,
            ...((file.metadata as object) || {}),
          },
          userId: file.user_id,
        })
        indexed++
      }

      console.log(`Indexed ${indexed} files`)
      return indexed
    } catch (error) {
      console.error("Error indexing files:", error)
      return 0
    }
  }

  // Index streams (if they exist)
  async indexStreams(): Promise<number> {
    try {
      console.log("Starting stream indexing...")

      // Check if streams table exists
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'streams'
        )
      `

      if (!tableExists[0]?.exists) {
        console.log("Streams table does not exist, creating sample data...")
        return await this.createSampleStreams()
      }

      const streams = await sql`
        SELECT 
          id::text as id,
          title,
          description,
          status,
          user_id,
          created_at,
          metadata
        FROM streams
        WHERE title IS NOT NULL
      `

      let indexed = 0
      for (const stream of streams) {
        await this.indexContent({
          id: `stream_${stream.id}`,
          title: stream.title,
          content: stream.description || `Stream: ${stream.title}`,
          contentType: "stream",
          tags: ["stream", stream.status || "unknown"],
          url: `/streams/${stream.id}`,
          metadata: {
            status: stream.status,
            userId: stream.user_id,
            createdAt: stream.created_at,
            ...((stream.metadata as object) || {}),
          },
          userId: stream.user_id,
        })
        indexed++
      }

      console.log(`Indexed ${indexed} streams`)
      return indexed
    } catch (error) {
      console.error("Error indexing streams:", error)
      return 0
    }
  }

  // Create sample streams for demonstration
  async createSampleStreams(): Promise<number> {
    const sampleStreams = [
      {
        id: "stream_1",
        title: "React Best Practices 2024",
        content:
          "Learn the latest React patterns, hooks, and performance optimization techniques. This comprehensive tutorial covers modern React development.",
        tags: ["react", "javascript", "tutorial", "programming", "web-development"],
        metadata: { duration: 3600, views: 1250, category: "programming" },
      },
      {
        id: "stream_2",
        title: "AI Development with Python",
        content:
          "Explore machine learning and AI development using Python. Cover TensorFlow, PyTorch, and modern AI frameworks.",
        tags: ["python", "ai", "machine-learning", "tensorflow", "tutorial"],
        metadata: { duration: 2700, views: 890, category: "ai" },
      },
      {
        id: "stream_3",
        title: "Gaming Highlights - Esports Championship",
        content: "Epic gaming moments and highlights from the latest esports championship tournament.",
        tags: ["gaming", "esports", "highlights", "tournament", "entertainment"],
        metadata: { duration: 1800, views: 2100, category: "gaming" },
      },
      {
        id: "stream_4",
        title: "Music Production Masterclass",
        content: "Learn professional music production techniques, mixing, and mastering with industry-standard tools.",
        tags: ["music", "production", "audio", "masterclass", "creative"],
        metadata: { duration: 4200, views: 650, category: "music" },
      },
      {
        id: "stream_5",
        title: "Design System Deep Dive",
        content:
          "Building scalable design systems for modern web applications. Cover component libraries and design tokens.",
        tags: ["design", "ui", "ux", "design-system", "frontend"],
        metadata: { duration: 2400, views: 780, category: "design" },
      },
    ]

    let indexed = 0
    for (const stream of sampleStreams) {
      await this.indexContent({
        id: stream.id,
        title: stream.title,
        content: stream.content,
        contentType: "stream",
        tags: stream.tags,
        url: `/streams/${stream.id}`,
        metadata: stream.metadata,
      })
      indexed++
    }

    console.log(`Created and indexed ${indexed} sample streams`)
    return indexed
  }

  // Index posts/content (if they exist)
  async indexPosts(): Promise<number> {
    try {
      console.log("Starting post indexing...")

      // Check if posts table exists
      const tableExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'posts'
        )
      `

      if (!tableExists[0]?.exists) {
        console.log("Posts table does not exist, creating sample data...")
        return await this.createSamplePosts()
      }

      const posts = await sql`
        SELECT 
          id::text as id,
          title,
          content,
          status,
          user_id,
          created_at,
          tags
        FROM posts
        WHERE title IS NOT NULL
      `

      let indexed = 0
      for (const post of posts) {
        await this.indexContent({
          id: `post_${post.id}`,
          title: post.title,
          content: post.content || `Post: ${post.title}`,
          contentType: "post",
          tags: post.tags || ["post"],
          url: `/posts/${post.id}`,
          metadata: {
            status: post.status,
            userId: post.user_id,
            createdAt: post.created_at,
          },
          userId: post.user_id,
        })
        indexed++
      }

      console.log(`Indexed ${indexed} posts`)
      return indexed
    } catch (error) {
      console.error("Error indexing posts:", error)
      return 0
    }
  }

  // Create sample posts for demonstration
  async createSamplePosts(): Promise<number> {
    const samplePosts = [
      {
        id: "post_1",
        title: "Getting Started with Live Streaming",
        content:
          "A comprehensive guide to starting your live streaming journey. Learn about equipment, software, and best practices for engaging your audience.",
        tags: ["streaming", "guide", "tutorial", "beginner"],
        metadata: { readTime: 5, category: "tutorial" },
      },
      {
        id: "post_2",
        title: "Building Community Through Content",
        content:
          "Strategies for building and maintaining an engaged community around your content. Focus on authentic connections and consistent value.",
        tags: ["community", "content-creation", "engagement", "strategy"],
        metadata: { readTime: 8, category: "strategy" },
      },
      {
        id: "post_3",
        title: "The Future of Web Development",
        content:
          "Exploring emerging trends in web development including AI integration, serverless architecture, and modern frameworks.",
        tags: ["web-development", "trends", "future", "technology"],
        metadata: { readTime: 12, category: "technology" },
      },
      {
        id: "post_4",
        title: "Audio Production Tips for Creators",
        content:
          "Essential audio production techniques for content creators. Learn about recording, editing, and mastering your audio content.",
        tags: ["audio", "production", "tips", "content-creation"],
        metadata: { readTime: 6, category: "tutorial" },
      },
    ]

    let indexed = 0
    for (const post of samplePosts) {
      await this.indexContent({
        id: post.id,
        title: post.title,
        content: post.content,
        contentType: "post",
        tags: post.tags,
        url: `/posts/${post.id}`,
        metadata: post.metadata,
      })
      indexed++
    }

    console.log(`Created and indexed ${indexed} sample posts`)
    return indexed
  }

  // Index all content types
  async indexAllContent(): Promise<{
    users: number
    files: number
    streams: number
    posts: number
    total: number
  }> {
    console.log("Starting full content indexing...")

    const results = {
      users: 0,
      files: 0,
      streams: 0,
      posts: 0,
      total: 0,
    }

    try {
      // Index all content types in parallel for better performance
      const [users, files, streams, posts] = await Promise.all([
        this.indexUsers(),
        this.indexFiles(),
        this.indexStreams(),
        this.indexPosts(),
      ])

      results.users = users
      results.files = files
      results.streams = streams
      results.posts = posts
      results.total = users + files + streams + posts

      console.log("Content indexing completed:", results)
      return results
    } catch (error) {
      console.error("Error during full content indexing:", error)
      throw error
    }
  }

  // Re-index content with embeddings (when OpenAI becomes available)
  async reindexWithEmbeddings(): Promise<number> {
    if (!isOpenAIAvailable) {
      throw new Error("OpenAI API key not configured")
    }

    console.log("Re-indexing content with embeddings...")

    const documents = await sql`
      SELECT id, title, content
      FROM search_documents
      WHERE embedding IS NULL
      ORDER BY created_at DESC
    `

    let updated = 0
    for (const doc of documents) {
      try {
        const embedding = await generateEmbedding(`${doc.title} ${doc.content}`)
        await sql`
          UPDATE search_documents
          SET embedding = ${JSON.stringify(embedding)}::vector,
              updated_at = NOW()
          WHERE id = ${doc.id}
        `
        updated++
        console.log(`Updated embedding for: ${doc.title}`)
      } catch (error) {
        console.error(`Error updating embedding for ${doc.id}:`, error)
      }
    }

    console.log(`Re-indexed ${updated} documents with embeddings`)
    return updated
  }

  // Get indexing statistics
  async getIndexingStats(): Promise<{
    totalDocuments: number
    documentsWithEmbeddings: number
    contentTypes: Record<string, number>
    recentlyIndexed: number
  }> {
    try {
      const [totalResult, embeddingResult, contentTypesResult, recentResult] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM search_documents`,
        sql`SELECT COUNT(*) as count FROM search_documents WHERE embedding IS NOT NULL`,
        sql`
          SELECT content_type, COUNT(*) as count 
          FROM search_documents 
          GROUP BY content_type 
          ORDER BY count DESC
        `,
        sql`
          SELECT COUNT(*) as count 
          FROM search_documents 
          WHERE created_at >= NOW() - INTERVAL '24 hours'
        `,
      ])

      const contentTypes: Record<string, number> = {}
      contentTypesResult.forEach((row: any) => {
        contentTypes[row.content_type] = row.count
      })

      return {
        totalDocuments: totalResult[0]?.count || 0,
        documentsWithEmbeddings: embeddingResult[0]?.count || 0,
        contentTypes,
        recentlyIndexed: recentResult[0]?.count || 0,
      }
    } catch (error) {
      console.error("Error getting indexing stats:", error)
      return {
        totalDocuments: 0,
        documentsWithEmbeddings: 0,
        contentTypes: {},
        recentlyIndexed: 0,
      }
    }
  }

  // Remove content from index
  async removeFromIndex(contentId: string): Promise<void> {
    try {
      await sql`DELETE FROM search_documents WHERE id = ${contentId}`
      console.log(`Removed ${contentId} from search index`)
    } catch (error) {
      console.error(`Error removing ${contentId} from index:`, error)
      throw error
    }
  }

  // Utility function to format file sizes
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}

// Export singleton instance
export const contentIndexer = new ContentIndexer()
