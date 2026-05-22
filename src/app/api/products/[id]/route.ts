import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAdminSession } from '@/lib/auth'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// PUT: Modificar un producto existente (Protegido para Admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Verificar sesión
    const isAdmin = await verifyAdminSession()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()
    const { name, description, benefits, price, image, category, stock, isStar } = data

    // 2. Verificar existencia
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'El producto no existe' }, { status: 404 })
    }

    // 3. Preparar los datos actualizados
    const updateData: any = {}
    if (name) {
      updateData.name = name
      // Si cambia el nombre, actualizamos el slug
      updateData.slug = `${generateSlug(name)}-${Date.now().toString().slice(-4)}`
    }
    if (description !== undefined) updateData.description = description
    if (benefits !== undefined) updateData.benefits = benefits
    if (price !== undefined) updateData.price = parseFloat(price)
    if (image !== undefined) updateData.image = image
    if (category !== undefined) updateData.category = category
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (isStar !== undefined) updateData.isStar = !!isStar

    // 4. Actualizar en base de datos
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error('Error al editar producto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE: Eliminar un producto (Protegido para Admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Verificar sesión
    const isAdmin = await verifyAdminSession()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 })
    }

    const { id } = params

    // 2. Verificar existencia
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'El producto no existe' }, { status: 404 })
    }

    // 3. Eliminar
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
