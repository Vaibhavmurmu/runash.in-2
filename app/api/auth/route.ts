import { auth } from "@/lib/auth"

/**
 * Handle all authentication routes
 * Better Auth uses this to manage /api/auth/* routes
 */
export const { POST, GET } = auth.handler
