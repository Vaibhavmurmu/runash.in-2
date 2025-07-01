// Simple auth helper - in production, you'd use NextAuth.js or similar
export function getCurrentUserId(): string {
  // For demo purposes, return the sample user ID
  // In production, this would get the user ID from session/JWT
  return "550e8400-e29b-41d4-a716-446655440000"
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
