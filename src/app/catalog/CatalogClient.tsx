'use client'

import React, { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, EyeOff } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/CartContext'

interface CatalogClientProps {
  initialProducts: Product[]
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  const categories = [
    { id: 'todos', label: '🌱 Todos' },
    { id: 'bebidas', label: '☕ Bebidas & Café' },
    { id: 'suplementos', label: '🌿 Suplementos' },
    { id: 'cuidado_personal', label: '🧼 Cuidado Personal' },
  ]

  // Filtrado y Búsqueda en memoria de alta velocidad
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.benefits.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === 'todos' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory, initialProducts])

  // Contar productos por categoría para mostrar indicadores
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: initialProducts.length }
    initialProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [initialProducts])

  return (
    <div className="catalog-content">
      {/* Barra de Filtros e Instrumentos de Búsqueda */}
      <div className="search-filter-bar glass-effect">
        <div className="search-wrapper">
          <Search className="search-icon text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar productos por nombre, ingredientes o beneficios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button onClick={() => setSearch('')} className="btn-clear-search">
              Clear
            </button>
          )}
        </div>

        <div className="categories-pills">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-pill ${isSelected ? 'active' : ''}`}
              >
                <span>{cat.label}</span>
                <span className="pill-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid de Productos Filtrado */}
      <div className="results-info">
        <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
        <span>Mostrando <strong>{filteredProducts.length}</strong> de {initialProducts.length} productos</span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="animate-card">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results glass-effect">
          <EyeOff className="w-12 h-12 text-stone-300 dark:text-stone-700" />
          <h3>No se encontraron resultados</h3>
          <p>Prueba buscando con otros términos o seleccionando otra categoría.</p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('todos') }}
            className="btn-accent"
            style={{ marginTop: '16px' }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <style jsx>{`
        .catalog-content {
          margin-top: 20px;
        }
        .search-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          margin-bottom: 30px;
          box-shadow: var(--shadow-sm);
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
        }
        .search-input {
          width: 100%;
          padding: 14px 16px 14px 50px;
          border-radius: var(--radius-md);
          border: 1px solid var(--bg-tertiary);
          background-color: var(--bg-primary);
          color: var(--text-main);
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-transparent);
          background-color: #ffffff;
        }
        .btn-clear-search {
          position: absolute;
          right: 16px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }
        .categories-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .category-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-family: var(--font-title);
          font-weight: 600;
          font-size: 0.88rem;
          border: 1px solid var(--bg-tertiary);
          background-color: var(--bg-primary);
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }
        .category-pill:hover {
          background-color: var(--bg-secondary);
          color: var(--primary-deep);
        }
        .category-pill.active {
          background-color: var(--primary-deep);
          color: #ffffff;
          border-color: var(--primary-deep);
          box-shadow: 0 4px 10px var(--primary-transparent);
        }
        .pill-count {
          font-size: 0.75rem;
          background-color: rgba(6, 78, 59, 0.08);
          color: var(--primary-deep);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          font-weight: 700;
        }
        .category-pill.active .pill-count {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .results-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }
        .animate-card {
          animation: cardAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          color: var(--text-muted);
        }
        .no-results h3 {
          font-family: var(--font-title);
          font-size: 1.3rem;
          color: var(--primary-deep);
          margin: 16px 0 8px 0;
        }
        .no-results p {
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  )
}
