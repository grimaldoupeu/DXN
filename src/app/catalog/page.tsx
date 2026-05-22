import React from 'react'
import prisma from '@/lib/db'
import CatalogClient from './CatalogClient'
import { Product } from '@/lib/CartContext'

export const revalidate = 60 // Revalidar la página cada minuto para reflejar cambios del admin

export const metadata = {
  title: 'Catálogo de Productos DXN Perú - Café Lingzhi, Cocozhi y Espirulina',
  description: 'Explora nuestra gama de productos DXN disponibles en Perú. Filtra y busca tus bebidas y suplementos favoritos enriquecidos con Ganoderma Lucidum orgánico.',
}

export default async function CatalogPage() {
  let products: Product[] = []
  
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { name: 'asc' },
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
    console.error('Error cargando el catálogo de productos:', error)
  }

  return (
    <div className="catalog-page section-padding">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-subtitle">Gama de Salud</span>
          <h1 className="section-title">Catálogo Completo DXN</h1>
          <p className="section-desc">
            Encuentra las soluciones perfectas para tu nutrición y cuidado diario. Todos nuestros productos cuentan con registro sanitario y la máxima garantía de calidad DXN.
          </p>
        </div>

        <CatalogClient initialProducts={products} />
      </div>


    </div>
  )
}
