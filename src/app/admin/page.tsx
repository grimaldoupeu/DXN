import React from 'react'
import { redirect } from 'next/navigation'
import { LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react'
import { verifyAdminSession, endAdminSession } from '@/lib/auth'
import prisma from '@/lib/db'
import AdminDashboardClient from './AdminDashboardClient'
import { Product } from '@/lib/CartContext'

export const dynamic = 'force-dynamic' // No cachear el panel de administración

export default async function AdminPage() {
  // 1. Verificar sesión en el servidor
  const isAuthorized = await verifyAdminSession()
  
  if (!isAuthorized) {
    redirect('/admin/login')
  }

  // 2. Cargar todos los productos para el catálogo del admin
  let products: Product[] = []
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      benefits: p.benefits,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
      isStar: p.isStar,
    }))
  } catch (error) {
    console.error('Error cargando catálogo en el administrador:', error)
  }

  // 3. Acción de servidor para cerrar sesión
  async function handleLogout() {
    'use server'
    await endAdminSession()
    redirect('/admin/login')
  }

  return (
    <div className="admin-page section-padding">
      <div className="container">
        {/* Barra superior de Administrador */}
        <div className="admin-nav glass-effect">
          <div className="admin-branding">
            <LayoutDashboard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Consola de Administración Independiente</span>
          </div>

          <form action={handleLogout}>
            <button type="submit" className="btn-logout">
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </form>
        </div>

        {/* Dashboard interactivo */}
        <AdminDashboardClient initialProducts={products} />
      </div>
    </div>
  )
}
