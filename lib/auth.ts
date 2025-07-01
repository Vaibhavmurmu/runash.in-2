// Simple auth helper - in production, you'd use NextAuth.js or similar
export function getCurrentUserId(): string {
  // For demo purposes, return the sample user ID
  // In production, this would get the user ID from session/JWT
  // Return as string but it might be an integer in the database
  return "1" // Changed from UUID to integer for compatibility
}

export function isAuthenticated(): boolean {
  // In production, check if user has valid session
  return true
}

// Helper to validate UUID format
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Helper to check if string is a valid integer
export function isValidInteger(str: string): boolean {
  return /^\d+$/.test(str) && !isNaN(Number.parseInt(str))
}

// Helper to determine if we should use UUID or integer casting
export function formatUserId(userId: string): string {
  if (isValidUUID(userId)) {
    return `${userId}::uuid`
  } else if (isValidInteger(userId)) {
    return userId
  } else {
    throw new Error("Invalid user ID format")
  }
}
