import OpenAI from "openai"

// Initialize OpenAI client only if API key is available
export const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

// Check if OpenAI is available
export const isOpenAIAvailable = !!process.env.OPENAI_API_KEY

// Generate embeddings for text
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!openai || !isOpenAIAvailable) {
    console.warn("OpenAI not configured, returning mock embedding")
    // Return a consistent mock embedding for development
    return Array.from({ length: 1536 }, (_, i) => Math.sin(i * 0.1) * 0.1)
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    })

    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    // Return a mock embedding as fallback
    return Array.from({ length: 1536 }, (_, i) => Math.sin(i * 0.1) * 0.1)
  }
}

// Generate search suggestions using GPT
export async function generateSearchSuggestions(query: string, context?: string[]): Promise<string[]> {
  if (!openai || !isOpenAIAvailable) {
    // Return basic suggestions based on query
    const basicSuggestions = [
      `${query} tutorial`,
      `${query} guide`,
      `${query} tips`,
      `how to ${query}`,
      `${query} examples`,
    ]
    return basicSuggestions.slice(0, 3)
  }

  try {
    const contextText = context?.length ? `\nContext: ${context.join(", ")}` : ""

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates relevant search suggestions. Return only a JSON array of 3-5 search suggestions based on the user query.",
        },
        {
          role: "user",
          content: `Generate search suggestions for: "${query}"${contextText}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (content) {
      try {
        const suggestions = JSON.parse(content)
        return Array.isArray(suggestions) ? suggestions.slice(0, 5) : []
      } catch {
        // If JSON parsing fails, extract suggestions from text
        return content
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^[-*]\s*/, "").replace(/"/g, ""))
          .slice(0, 5)
      }
    }

    return []
  } catch (error) {
    console.error("Error generating search suggestions:", error)
    // Return basic fallback suggestions
    return [`${query} tutorial`, `${query} guide`, `how to ${query}`]
  }
}

// Enhance search query using GPT
export async function enhanceSearchQuery(query: string): Promise<string> {
  if (!openai || !isOpenAIAvailable) {
    // Return original query if OpenAI not available
    return query
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a search query optimizer. Enhance the user query to make it more effective for searching content. Return only the enhanced query without explanation.",
        },
        {
          role: "user",
          content: `Enhance this search query: "${query}"`,
        },
      ],
      max_tokens: 50,
      temperature: 0.3,
    })

    return response.choices[0]?.message?.content?.trim() || query
  } catch (error) {
    console.error("Error enhancing search query:", error)
    return query
  }
}

// Calculate cosine similarity between embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
