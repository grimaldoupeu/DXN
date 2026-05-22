'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Check, Eye } from 'lucide-react'
import { useCart, Product } from '@/lib/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="product-card glass-effect card-hover">
      {/* Insignia de Producto Estrella o Agotado */}
      {product.isStar && (
        <span className="product-badge star-badge">⭐ Destacado</span>
      )}
      {product.stock <= 0 && (
        <span className="product-badge out-badge">Agotado</span>
      )}

      {/* Imagen del Producto */}
      <Link href={`/products/${product.id}`} className="image-container">
        <Image 
          src={product.image} 
          alt={product.name} 
          width={350} 
          height={260} 
          className="product-image"
          priority={product.isStar}
        />
        <div className="overlay">
          <span className="btn-view-details">
            <Eye className="w-4 h-4" /> Ver Beneficios
          </span>
        </div>
      </Link>

      {/* Info del Producto */}
      <div className="product-info">
        <span className="product-category">{product.category === 'bebidas' ? '☕ Bebidas / Café' : product.category === 'suplementos' ? '🌿 Suplementos' : '🧼 Cuidado Personal'}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">{product.description.substring(0, 85)}...</p>
        
        {/* Precio e Interacción */}
        <div className="product-footer">
          <div className="price-container">
            <span className="price-label">Precio Público</span>
            <span className="product-price">S/. {product.price.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`btn-cart ${added ? 'added' : ''}`}
            title="Añadir al carrito"
          >
            {added ? <Check className="w-5 h-5 text-white" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 100%;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          box-shadow: var(--shadow-sm);
        }
        .product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
          font-family: var(--font-title);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .star-badge {
          background-color: var(--accent-gold-transparent);
          color: var(--accent-gold-dark);
          border: 1px solid rgba(194, 120, 3, 0.2);
        }
        .out-badge {
          background-color: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background-color: var(--bg-tertiary);
          display: block;
        }
        .product-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
          transition: var(--transition-smooth);
        }
        .product-card:hover .product-image {
          transform: scale(1.08);
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(6, 78, 59, 0.4);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-smooth);
        }
        .image-container:hover .overlay {
          opacity: 1;
        }
        .btn-view-details {
          background-color: #ffffff;
          color: var(--primary-deep);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-family: var(--font-title);
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .product-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .product-category {
          font-family: var(--font-title);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .product-name {
          font-family: var(--font-title);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-deep);
          margin-bottom: 8px;
          line-height: 1.3;
          transition: var(--transition-smooth);
        }
        .product-name:hover {
          color: var(--primary);
        }
        .product-description {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .product-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px solid rgba(6, 78, 59, 0.05);
        }
        .price-container {
          display: flex;
          flex-direction: column;
        }
        .price-label {
          font-size: 0.7rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .product-price {
          font-family: var(--font-title);
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--accent-gold-dark);
        }
        .btn-cart {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background-color: var(--primary-transparent);
          color: var(--primary-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }
        .btn-cart:hover {
          background-color: var(--primary-deep);
          color: #ffffff;
          transform: scale(1.05);
        }
        .btn-cart.added {
          background-color: var(--primary);
          color: #ffffff;
        }
        .btn-cart:disabled {
          background-color: var(--bg-tertiary);
          color: var(--text-light);
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  )
}
