export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR")
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(401, message, "AUTH_ERROR")
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(403, message, "PERMISSION_ERROR")
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`, "NOT_FOUND")
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, "CONFLICT")
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    }
  }
  console.error("Unexpected error:", error)
  return {
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  }
}
