'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, Plus, Minus, Send, ArrowRight, Heart } from 'lucide-react'
import { useCart, CartItem } from '@/lib/CartContext'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()
  const [isClient, setIsClient] = useState(false)

  // Datos del Cliente
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    notes: '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)

  // Evitar desajustes de hidratación (hydration mismatches)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="cart-page-loading container section-padding">
        <p>Cargando tu carrito de bienestar...</p>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    } else if (!/^\d{9,15}$/.test(formData.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Introduce un número de teléfono válido'
    }
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria'
    if (!formData.district) newErrors.district = 'El distrito/ciudad es obligatorio'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSending(true)

    // 1. Obtener el número de teléfono configurado
    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51929424184' // Reemplaza este número por el de la vendedora real directamente aquí como respaldo.

    // 2. Formatear el pedido en un hermoso mensaje de texto
    let message = `¡Hola! 🌿 Me interesa realizar el siguiente pedido DXN:\n\n`
    
    cart.forEach((item: CartItem) => {
      const subtotal = item.product.price * item.quantity
      message += `▪️ *${item.quantity}x* ${item.product.name}\n`
      message += `   _Precio: S/. ${item.product.price.toFixed(2)} c/u_ | *Subtotal: S/. ${subtotal.toFixed(2)}*\n\n`
    })

    message += `-------------------------------\n`
    message += `💰 *TOTAL A PAGAR: S/. ${cartTotal.toFixed(2)}*\n`
    message += `-------------------------------\n\n`
    message += `👤 *DATOS DE ENTREGA:*\n`
    message += `• *Nombre:* ${formData.name.trim()}\n`
    message += `• *Teléfono:* ${formData.phone.trim()}\n`
    message += `• *Distrito/Ciudad:* ${formData.district}\n`
    message += `• *Dirección:* ${formData.address.trim()}\n`
    
    if (formData.notes.trim()) {
      message += `• *Notas:* ${formData.notes.trim()}\n`
    }

    message += `\n📲 _Pedido generado desde la Tienda DXN Vida._`

    // 3. Codificar para URL
    const encodedText = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`

    // 4. Redirigir a WhatsApp
    window.open(whatsappUrl, '_blank')

    // 5. Limpiar carrito de compras
    setTimeout(() => {
      clearCart()
      setSending(false)
    }, 1000)
  }

  // Lista de distritos populares de Lima para el selector (o ingreso libre)
  const distritosLima = [
    'Miraflores', 'San Isidro', 'Santiago de Surco', 'San Borja', 'La Molina', 
    'Jesús María', 'Lince', 'Magdalena del Mar', 'Pueblo Libre', 'Barranco',
    'San Miguel', 'Surquillo', 'Chorrillos', 'Lima Cercado', 'Los Olivos', 
    'San Martín de Porres', 'Ate Vitarte', 'San Juan de Lurigancho', 'Callao', 'Otro (Especificar en notas)'
  ]

  return (
    <div className="cart-page section-padding">
      <div className="container">
        <h1 className="page-title">Mi Carrito de Compras</h1>

        {cart.length > 0 ? (
          <div className="cart-grid">
            {/* COLUMNA IZQUIERDA: LISTA DE PRODUCTOS */}
            <div className="cart-items-panel">
              <div className="panel-header">
                <h3>Tus Productos Seleccionados ({cartCount})</h3>
                <button onClick={clearCart} className="btn-clear-all">
                  <Trash2 className="w-4 h-4" /> Vaciar Carrito
                </button>
              </div>

              <div className="items-list">
                {cart.map((item: CartItem) => {
                  const subtotal = item.product.price * item.quantity
                  return (
                    <div key={item.product.id} className="cart-item glass-effect">
                      <div className="item-image-wrapper">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          width={100} 
                          height={80}
                          className="item-image"
                        />
                      </div>
                      
                      <div className="item-info">
                        <Link href={`/products/${item.product.id}`}>
                          <h4 className="item-name">{item.product.name}</h4>
                        </Link>
                        <span className="item-category">
                          {item.product.category === 'bebidas' ? '☕ Bebida' : item.product.category === 'suplementos' ? '🌿 Suplemento' : '🧼 Personal'}
                        </span>
                        <span className="item-unit-price">S/. {item.product.price.toFixed(2)} c/u</span>
                      </div>

                      <div className="item-qty-controls">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="qty-btn"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="item-subtotal-panel">
                        <span className="subtotal-val">S/. {subtotal.toFixed(2)}</span>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="btn-remove-item"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Banner de Afiliación en el carrito */}
              <div className="cart-membership-tip glass-effect">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <p>
                  <strong>¿Sabías qué?</strong> Si te afilias a DXN con nosotros, este pedido te costaría aproximadamente <strong>S/. {(cartTotal * 0.7).toFixed(2)}</strong> (¡Ahorras un 30%!). Puedes coordinar tu afiliación al finalizar el pedido.
                </p>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO Y RESUMEN */}
            <div className="checkout-panel glass-effect">
              <h3>Resumen y Envío</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>S/. {cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Coordinación de Envío</span>
                <span className="free-shipping">Gratis / A coordinar</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Estimado</span>
                <span>S/. {cartTotal.toFixed(2)}</span>
              </div>

              <form onSubmit={handleCheckout} className="checkout-form">
                <h4>Datos para coordinar la entrega</h4>
                
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo *</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    placeholder="Ej: María Delgado"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Celular de Contacto (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    placeholder="Ej: 987654321"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="district">Distrito de Entrega *</label>
                  <select 
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={errors.district ? 'input-error' : ''}
                  >
                    <option value="">Selecciona tu distrito...</option>
                    {distritosLima.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.district && <span className="error-text">{errors.district}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Dirección Completa *</label>
                  <input 
                    type="text" 
                    id="address"
                    name="address"
                    placeholder="Ej: Av. Larco 456, Dpto 302"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notas o Referencias (Opcional)</label>
                  <textarea 
                    id="notes"
                    name="notes"
                    placeholder="Ej: Entregar por las tardes, cerca al óvalo..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={sending}
                  className="btn-accent checkout-submit-btn"
                >
                  <Send className="w-5 h-5" />
                  {sending ? 'Redirigiendo...' : 'Enviar Pedido a WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="empty-cart glass-effect">
            <ShoppingBag className="w-16 h-16 text-stone-300 dark:text-stone-700" />
            <h2>Tu carrito está vacío</h2>
            <p>Aún no has agregado ningún producto para tu salud y nutrición.</p>
            <Link href="/catalog" className="btn-primary" style={{ marginTop: '20px' }}>
              Explorar Catálogo de Productos <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          background-color: var(--bg-primary);
          min-height: 80vh;
        }
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary-deep);
          margin-bottom: 40px;
          text-align: center;
        }
        .cart-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .cart-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
        .cart-items-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .panel-header {
          display: flex;
          justify-content: justify-between;
          align-items: center;
          border-bottom: 1px solid var(--nav-border);
          padding-bottom: 12px;
        }
        .panel-header h3 {
          font-family: var(--font-title);
          color: var(--primary-deep);
        }
        .btn-clear-all {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #dc2626;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-clear-all:hover {
          text-decoration: underline;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item {
          display: grid;
          grid-template-columns: 100px 2fr 1fr 1.2fr;
          align-items: center;
          gap: 20px;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          background-color: var(--card-bg);
        }
        @media (max-width: 600px) {
          .cart-item {
            grid-template-columns: 80px 1fr;
            gap: 12px;
          }
          .item-qty-controls, .item-subtotal-panel {
            grid-column: span 2;
            justify-content: space-between !important;
            border-top: 1px solid rgba(6, 78, 59, 0.05);
            padding-top: 8px;
            margin-top: 4px;
          }
          .item-subtotal-panel {
            display: flex;
            align-items: center;
          }
        }
        .item-image-wrapper {
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-secondary);
        }
        .item-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .item-info {
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-family: var(--font-title);
          font-weight: 700;
          color: var(--primary-deep);
          font-size: 1.05rem;
          line-height: 1.3;
        }
        .item-category {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
        }
        .item-unit-price {
          font-size: 0.8rem;
          color: var(--text-light);
          margin-top: 4px;
        }
        .item-qty-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-deep);
        }
        .qty-btn:hover:not(:disabled) {
          background-color: var(--primary-transparent);
        }
        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .qty-val {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1rem;
          width: 20px;
          text-align: center;
          color: var(--primary-deep);
        }
        .item-subtotal-panel {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }
        .subtotal-val {
          font-family: var(--font-title);
          font-weight: 800;
          color: var(--accent-gold-dark);
          font-size: 1.1rem;
        }
        .btn-remove-item {
          color: var(--text-light);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .btn-remove-item:hover {
          color: #dc2626;
        }
        .cart-membership-tip {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          background-color: var(--accent-gold-transparent);
          color: var(--accent-gold-dark);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        /* CHECKOUT PANEL */
        .checkout-panel {
          padding: 30px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          background-color: var(--card-bg);
          box-shadow: var(--shadow-md);
        }
        .checkout-panel h3 {
          font-family: var(--font-title);
          color: var(--primary-deep);
          font-size: 1.4rem;
          border-bottom: 1px solid var(--nav-border);
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: justify-between;
          margin-bottom: 12px;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .free-shipping {
          color: var(--primary);
          font-weight: 600;
        }
        .total-row {
          border-top: 1px solid var(--nav-border);
          padding-top: 16px;
          margin-top: 8px;
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--primary-deep);
          margin-bottom: 30px;
        }
        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .checkout-form h4 {
          font-family: var(--font-title);
          font-size: 1.05rem;
          color: var(--primary-deep);
          margin-bottom: 8px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--bg-tertiary);
          background-color: var(--bg-primary);
          color: var(--text-main);
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--primary);
          background-color: #ffffff;
          box-shadow: 0 0 0 3px var(--primary-transparent);
        }
        .input-error {
          border-color: #dc2626 !important;
        }
        .error-text {
          font-size: 0.75rem;
          color: #dc2626;
          font-weight: 600;
        }
        .checkout-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 16px;
          font-size: 1.1rem;
          margin-top: 10px;
        }
        
        /* EMPTY STATE */
        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        .empty-cart h2 {
          font-family: var(--font-title);
          color: var(--primary-deep);
          font-size: 1.8rem;
          margin: 20px 0 8px 0;
        }
        .empty-cart p {
          font-size: 1rem;
        }
        .cart-page-loading {
          text-align: center;
          padding: 100px;
          font-size: 1.1rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}
