import { type NextRequest, NextResponse } from "next/server"
import { contentIndexer } from "@/lib/content-indexer"
import { isOpenAIAvailable } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, contentType } = body

    switch (action) {
      case "index-all":
        const results = await contentIndexer.indexAllContent()
        return NextResponse.json({
          success: true,
          message: "Content indexing completed",
          results,
        })

      case "index-users":
        const userCount = await contentIndexer.indexUsers()
        return NextResponse.json({
          success: true,
          message: `Indexed ${userCount} users`,
          count: userCount,
        })

      case "index-files":
        const fileCount = await contentIndexer.indexFiles()
        return NextResponse.json({
          success: true,
          message: `Indexed ${fileCount} files`,
          count: fileCount,
        })

      case "index-streams":
        const streamCount = await contentIndexer.indexStreams()
        return NextResponse.json({
          success: true,
          message: `Indexed ${streamCount} streams`,
          count: streamCount,
        })

      case "index-posts":
        const postCount = await contentIndexer.indexPosts()
        return NextResponse.json({
          success: true,
          message: `Indexed ${postCount} posts`,
          count: postCount,
        })

      case "reindex-embeddings":
        if (!isOpenAIAvailable) {
          return NextResponse.json(
            {
              success: false,
              error: "OpenAI API key not configured",
            },
            { status: 400 },
          )
        }
        const embeddingCount = await contentIndexer.reindexWithEmbeddings()
        return NextResponse.json({
          success: true,
          message: `Re-indexed ${embeddingCount} documents with embeddings`,
          count: embeddingCount,
        })

      case "get-stats":
        const stats = await contentIndexer.getIndexingStats()
        return NextResponse.json({
          success: true,
          stats,
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Content indexing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const stats = await contentIndexer.getIndexingStats()
    return NextResponse.json({
      success: true,
      stats,
      openaiAvailable: isOpenAIAvailable,
    })
  } catch (error) {
    console.error("Error getting indexing stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get indexing statistics",
      },
      { status: 500 },
    )
  }
}
