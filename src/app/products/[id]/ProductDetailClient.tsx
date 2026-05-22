'use client'

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart, Product } from '@/lib/CartContext'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="purchase-controls">
      {product.stock > 0 ? (
        <>
          <div className="quantity-selector-wrapper">
            <span className="selector-label">Cantidad</span>
            <div className="quantity-selector">
              <button 
                onClick={handleDecrease}
                className="btn-qty"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="qty-number">{quantity}</span>
              <button 
                onClick={handleIncrease}
                className="btn-qty"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="stock-info">({product.stock} disponibles en stock)</span>
          </div>

          <div className="actions-buttons">
            <button 
              onClick={handleAddToCart}
              className={`btn-primary full-width ${added ? 'success' : ''}`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> ¡Añadido al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Añadir al Carrito
                </>
              )}
            </button>

            {added && (
              <Link href="/cart" className="btn-accent full-width animate-fade-in">
                Ir al Carrito a Finalizar Pedido <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="out-of-stock-alert">
          <h3>Temporalmente Agotado</h3>
          <p>Puedes contactarnos por WhatsApp para reservar este producto en la siguiente importación.</p>
          <a 
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Hola!%20Me%20interesa%20saber%20cu%C3%A1ndo%20estar%C3%A1%20disponible%20el%20producto%20${encodeURIComponent(product.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ width: '100%', marginTop: '12px' }}
          >
            Consultar disponibilidad
          </a>
        </div>
      )}

      <style jsx>{`
        .purchase-controls {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px;
          border-radius: var(--radius-md);
          background-color: var(--bg-secondary);
          border: 1px solid var(--nav-border);
        }
        .quantity-selector-wrapper {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .selector-label {
          font-family: var(--font-title);
          font-weight: 700;
          color: var(--primary-deep);
          font-size: 0.95rem;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-full);
          padding: 4px;
          box-shadow: var(--shadow-sm);
        }
        .btn-qty {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-deep);
          background-color: var(--bg-primary);
        }
        .btn-qty:hover:not(:disabled) {
          background-color: var(--primary-transparent);
        }
        .btn-qty:disabled {
          color: var(--text-light);
          opacity: 0.5;
          cursor: not-allowed;
        }
        .qty-number {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.1rem;
          width: 40px;
          text-align: center;
          color: var(--primary-deep);
        }
        .stock-info {
          font-size: 0.8rem;
          color: var(--text-light);
        }
        .actions-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .full-width {
          width: 100%;
          justify-content: center;
          padding: 14px;
          font-size: 1.05rem;
        }
        .btn-primary.success {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }
        .out-of-stock-alert {
          border-left: 4px solid #dc2626;
          padding: 16px;
          background-color: rgba(220, 38, 38, 0.05);
          border-radius: 4px;
        }
        .out-of-stock-alert h3 {
          font-family: var(--font-title);
          color: #dc2626;
          margin-bottom: 6px;
          font-size: 1.1rem;
        }
        .out-of-stock-alert p {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
