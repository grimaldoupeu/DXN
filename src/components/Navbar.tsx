'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X, Leaf, User2 } from 'lucide-react'
import { useCart } from '@/lib/CartContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detectar scroll para aplicar estilos de vidrio esmerilado más intensos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/catalog' },
    { name: 'Carrito', path: '/cart' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'h-20 glass-nav shadow-md' 
        : 'h-24 bg-transparent border-b border-transparent'
    } flex items-center`}>
      <div className="container flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-12 duration-300" style={{ background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary) 100%)' }}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-title text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400 leading-none">
              DXN <span className="text-amber-600 dark:text-amber-500">Vida</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 dark:text-stone-400">
              Distribuidora Autorizada
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-title font-medium relative py-2 transition-colors ${
                  isActive 
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold' 
                    : 'text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full animate-fade-in" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* BOTONES DE ACCIÓN (CARRITO Y ADMIN) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/cart" 
            className="relative w-12 h-12 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-stone-700 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-stone-900 transition-all shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white font-title text-xs font-bold flex items-center justify-center border-2 border-white dark:border-stone-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          <Link 
            href="/admin" 
            className="w-12 h-12 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-all"
            title="Panel de Administración"
          >
            <User2 className="w-5 h-5" />
          </Link>
        </div>

        {/* MENÚ MÓVIL HOBBY TRIGGER */}
        <div className="flex md:hidden items-center gap-3">
          <Link 
            href="/cart" 
            className="relative w-10 h-10 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white font-title text-[10px] font-bold flex items-center justify-center border border-white dark:border-stone-950">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 glass-nav shadow-lg border-t border-stone-200 dark:border-stone-800 flex flex-col p-6 gap-4 md:hidden animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-title font-medium text-lg py-2 border-b border-stone-100 dark:border-stone-800/50 ${
                  isActive 
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold' 
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <Link 
            href="/admin" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 font-title font-medium text-stone-600 dark:text-stone-300 py-2"
          >
            <User2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            Panel Administrador
          </Link>
        </div>
      )}

      {/* ESTILOS EN LÍNEA DE SOPORTE PARA FLEXIBILIDAD (EVITA TAILWIND SI NO SE INSTALA) */}
      <style jsx global>{`
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        header {
          transition: all 0.3s ease;
        }
        nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .relative { position: relative; }
        .absolute { position: absolute; }
        .z-50 { z-index: 50; }
        .fixed { position: fixed; }
        .top-0 { top: 0; }
        .left-0 { left: 0; }
        .right-0 { right: 0; }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .hidden { display: flex; }
          .md\:flex { display: flex; }
          .md\:hidden { display: none; }
        }
        .rounded-full { border-radius: 9999px; }
        .w-10 { width: 2.5rem; }
        .h-10 { height: 2.5rem; }
        .w-12 { width: 3rem; }
        .h-12 { height: 3rem; }
        .font-bold { font-weight: 700; }
        .text-xl { font-size: 1.25rem; }
        .text-xs { font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.025em; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .bg-white { background-color: #ffffff; }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </header>
  )
}
