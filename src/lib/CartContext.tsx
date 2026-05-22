'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  benefits: string
  price: number
  image: string
  category: string
  stock: number
  isStar: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem('dxn_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error al parsear el carrito guardado:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dxn_cart', JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      }
      return [...prevCart, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}
