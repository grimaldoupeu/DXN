import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remueve caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Convierte espacios a guiones
    .replace(/-+/g, '-') // Contrae guiones repetidos
}

// GET: Obtener todos los productos (Público)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 })
  }
}

// POST: Crear un nuevo producto (Protegido para Admin)
export async function POST(request: Request) {
  try {
    // 1. Verificar sesión del administrador
    const isAdmin = await verifyAdminSession()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 })
    }

    // 2. Extraer datos del cuerpo
    const data = await request.json()
    const { name, description, benefits, price, image, category, stock, isStar } = data

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // 3. Crear el slug
    const slug = `${generateSlug(name)}-${Date.now().toString().slice(-4)}`

    // 4. Registrar en Prisma
    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        benefits: benefits || '',
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock) || 0,
        isStar: !!isStar,
      },
    })

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
