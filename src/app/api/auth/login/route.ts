import { NextResponse } from 'next/server'
import { authenticateAdmin, startAdminSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'La contraseña es obligatoria' },
        { status: 400 }
      )
    }

    const isValid = await authenticateAdmin(password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Contraseña de administrador incorrecta' },
        { status: 401 }
      )
    }

    // Iniciar sesión (establece la cookie HTTP-only automáticamente)
    await startAdminSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en la API de Login:', error)
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor' },
      { status: 500 }
    )
  }
}
