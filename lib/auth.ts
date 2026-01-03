import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman-ganti-nanti')
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
