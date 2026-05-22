import { cookies } from 'next/headers'
import prisma from '@/lib/db'

// Generar una cadena de caracteres aleatoria y segura para usar como token
function generateToken(): string {
  const array = new Uint8Array(32)
  if (typeof window === 'undefined') {
    // Entorno de Node.js
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  return Array.from(array, (dec) => dec.toString(16).padStart(2, '0')).join('')
}

const SESSION_COOKIE_NAME = 'dxn_admin_token'
const SESSION_DURATION_DAYS = 7

/**
 * Autentica si la contraseña coincide con la configurada en variables de entorno.
 */
export async function authenticateAdmin(password: string): Promise<boolean> {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'dxn_admin_secreto_2026'
  return password === expectedPassword
}

/**
 * Crea una nueva sesión para el administrador en la base de datos y establece la cookie segura HTTP-only.
 */
export async function startAdminSession(): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  // Registrar en la base de datos
  await prisma.adminSession.create({
    data: {
      token,
      expiresAt,
    },
  })

  // Establecer la cookie en Next.js
  const cookieStore = cookies()
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return token
}

/**
 * Verifica si la cookie de sesión actual es válida y no ha expirado.
 */
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!tokenCookie || !tokenCookie.value) {
    return false
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: { token: tokenCookie.value },
    })

    if (!session) {
      return false
    }

    // Verificar si ha expirado
    const now = new Date()
    if (now > session.expiresAt) {
      // Limpiar sesión expirada
      await prisma.adminSession.delete({ where: { token: tokenCookie.value } }).catch(() => {})
      await endAdminSession()
      return false
    }

    return true
  } catch (error) {
    console.error('Error al verificar sesión:', error)
    return false
  }
}

/**
 * Termina la sesión actual borrando la cookie y eliminando el registro de la base de datos.
 */
export async function endAdminSession(): Promise<void> {
  const cookieStore = cookies()
  const tokenCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (tokenCookie && tokenCookie.value) {
    try {
      await prisma.adminSession.delete({
        where: { token: tokenCookie.value },
      }).catch(() => {}) // Ignorar error si ya fue eliminada
    } catch (e) {}
  }

  // Eliminar la cookie
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  })
}
