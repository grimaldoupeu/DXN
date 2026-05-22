import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ShieldCheck, Leaf, Heart } from 'lucide-react'
import prisma from '@/lib/db'
import ProductDetailClient from './ProductDetailClient'
import { Product } from '@/lib/CartContext'

export const revalidate = 60

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) return { title: 'Producto no encontrado - DXN' }

    return {
      title: `${product.name} DXN Perú - Beneficios y Precio`,
      description: `${product.name} enriquecido con Ganoderma Lucidum orgánico. Descubre sus excelentes beneficios para la salud y cómo adquirirlo al mejor precio en Perú.`,
    }
  } catch {
    return { title: 'Detalle del Producto - DXN' }
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product: Product | null = null

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        benefits: dbProduct.benefits,
        price: dbProduct.price,
        image: dbProduct.image,
        category: dbProduct.category,
        stock: dbProduct.stock,
        isStar: dbProduct.isStar,
      }
    }
  } catch (error) {
    console.error('Error cargando el producto:', error)
  }

  if (!product) {
    notFound()
  }

  // Parsear beneficios separados por salto de línea
  const benefitsList = product.benefits
    ? product.benefits.split('\n').filter((b) => b.trim() !== '')
    : []

  return (
    <div className="product-detail-page section-padding">
      <div className="container">
        {/* Enlace de regreso */}
        <Link href="/catalog" className="btn-back">
          <ArrowLeft className="w-4 h-4" /> Regresar al Catálogo
        </Link>

        {/* Grid de Detalle */}
        <div className="detail-grid">
          {/* Imagen Principal */}
          <div className="image-panel glass-effect">
            <Image 
              src={product.image} 
              alt={product.name} 
              width={500} 
              height={450} 
              className="detail-image"
              priority
            />
            {product.isStar && (
              <span className="star-tag">⭐ Producto Recomendado</span>
            )}
          </div>

          {/* Ficha Técnica / Textos */}
          <div className="info-panel">
            <span className="category-label">
              {product.category === 'bebidas' ? '☕ Bebidas / Café' : product.category === 'suplementos' ? '🌿 Suplementos' : '🧼 Cuidado Personal'}
            </span>
            <h1 className="product-name">{product.name}</h1>
            
            <div className="price-badge-container">
              <span className="price-tag">S/. {product.price.toFixed(2)}</span>
              <span className="igv-tag">Incluye I.G.V.</span>
            </div>

            <p className="product-description">{product.description}</p>

            {/* Controles de Compra (Client Component) */}
            <ProductDetailClient product={product} />

            {/* Beneficios de Salud */}
            {benefitsList.length > 0 && (
              <div className="benefits-section">
                <h3>Beneficios para tu Salud</h3>
                <ul className="benefits-ul">
                  {benefitsList.map((benefit, idx) => (
                    <li key={idx} className="benefit-li">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN DE MEMBRESÍA EN DETALLE */}
        <div className="discount-banner glass-effect">
          <div className="discount-icon-box">
            <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="discount-text-box">
            <h3>¿Quieres comprar {product.name} con un 30% a 40% de descuento?</h3>
            <p>
              Los precios mostrados son de venta al público general. Si te afilias a DXN (membresía gratuita o con kits), podrás adquirir este y todos los productos a precio de Distribuidor Oficial de forma inmediata.
            </p>
            <div className="discount-actions">
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Hola!%20Vengo%20de%20la%20web%20y%20quiero%20saber%20c%C3%B3mo%20comprar%20el%20producto%20${encodeURIComponent(product.name)}%20con%20descuento%20de%20socio%20en%20Per%C3%BA.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Solicitar descuento de Socio vía WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
