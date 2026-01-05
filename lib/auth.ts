import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

// Validate JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable must be set in production!')
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-insecure-secret')
const ALG = 'HS256'

// --- Password Hashing ---

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10) // 10 rounds is standard
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed)
}

// --- JWT Handling (Stateless) ---

export async function signJWT(payload: Record<string, any>, expiresIn: string = '24h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET)
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export function getSessionFromToken(token: string) {
  return verifyJWT(token)
}

// --- Role-based Authorization ---

interface AuthResult {
  payload?: Record<string, any>
  error?: string
  status?: number
}

/**
 * Verify JWT token and check if user has required role
 * @param token - JWT token from Authorization header
 * @param allowedRoles - Array of roles allowed to access the resource
 * @returns AuthResult with payload if success, or error details if failed
 */
export async function requireRole(token: string, allowedRoles: string[]): Promise<AuthResult> {
  const payload = await verifyJWT(token)

  if (!payload) {
    return { error: 'Token tidak valid atau expired', status: 401 }
  }

  if (!payload.role || !allowedRoles.includes(payload.role as string)) {
    return { error: 'Akses ditolak. Anda tidak memiliki izin untuk resource ini.', status: 403 }
  }

  return { payload }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns token string or null if invalid
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}
