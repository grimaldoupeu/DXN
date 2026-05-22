'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'
import { Product } from '@/lib/CartContext'

interface AdminDashboardClientProps {
  initialProducts: Product[]
}

export default function AdminDashboardClient({ initialProducts }: AdminDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Control del Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Campos del Formulario
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'bebidas',
    image: '',
    stock: '10',
    isStar: false,
    description: '',
    benefits: '',
  })

  // Estadísticas rápidas
  const stats = useMemo(() => {
    return {
      total: products.length,
      stars: products.filter((p) => p.isStar).length,
      out: products.filter((p) => p.stock <= 0).length,
    }
  }, [products])

  // Filtrado de productos en tabla
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    )
  }, [products, search])

  // Abrir modal para Crear Nuevo
  const handleOpenCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      category: 'bebidas',
      image: '',
      stock: '10',
      isStar: false,
      description: '',
      benefits: '',
    })
    setError('')
    setIsModalOpen(true)
  }

  // Abrir modal para Editar
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      isStar: product.isStar,
      description: product.description,
      benefits: product.benefits || '',
    })
    setError('')
    setIsModalOpen(true)
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // GUARDAR (CREAR O EDITAR)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    const { name, price, category, image, stock, description } = formData
    if (!name || !price || !category || !image || !stock || !description) {
      setError('Por favor, rellena todos los campos requeridos')
      return
    }

    setLoading(true)

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (editingProduct) {
          // Actualizar en el estado reactivo local
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          )
          showSuccessAlert('¡Producto actualizado con éxito!')
        } else {
          // Agregar al estado reactivo local
          setProducts((prev) => [data.product, ...prev])
          showSuccessAlert('¡Nuevo producto agregado con éxito!')
        }
        handleCloseModal()
      } else {
        setError(data.error || 'Ocurrió un error al guardar el producto')
      }
    } catch (err) {
      console.error(err)
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // ELIMINAR
  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el producto "${productName}"?`)) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        showSuccessAlert('¡Producto eliminado correctamente!')
      } else {
        setError(data.error || 'Ocurrió un error al eliminar')
      }
    } catch (err) {
      console.error(err)
      setError('Error al eliminar el producto')
    } finally {
      setLoading(false)
    }
  }

  const showSuccessAlert = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3500)
  }

  return (
    <div className="admin-dashboard">
      {/* CABECERA */}
      <div className="dashboard-header">
        <div>
          <h2>Panel de Control</h2>
          <p>Gestiona el inventario, catálogo, descripciones y precios oficiales.</p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn-primary">
          <Plus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      {/* FEEDBACK DE ACCIÓN EXITOSA */}
      {success && (
        <div className="success-alert animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="stats-grid">
        <div className="stat-card glass-effect">
          <span className="stat-label">Total Productos</span>
          <span className="stat-number">{stats.total}</span>
        </div>
        <div className="stat-card glass-effect">
          <span className="stat-label">⭐ Productos Estrella</span>
          <span className="stat-number text-gold">{stats.stars}</span>
        </div>
        <div className="stat-card glass-effect">
          <span className="stat-label">❌ Sin Stock</span>
          <span className="stat-number text-red">{stats.out}</span>
        </div>
      </div>

      {/* CONTROLES DE BUSCADOR */}
      <div className="table-controls glass-effect">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="table-wrapper glass-effect">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estrella</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="td-image-wrapper">
                      <Image src={p.image} alt={p.name} width={50} height={50} className="td-image" />
                    </div>
                  </td>
                  <td>
                    <span className="td-name">{p.name}</span>
                  </td>
                  <td>
                    <span className="td-category">{p.category === 'bebidas' ? '☕ Bebida' : p.category === 'suplementos' ? '🌿 Suplemento' : '🧼 Personal'}</span>
                  </td>
                  <td>
                    <span className="td-price">S/. {p.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`td-stock ${p.stock <= 0 ? 'out' : ''}`}>
                      {p.stock} u.
                    </span>
                  </td>
                  <td>
                    <span className="td-star">{p.isStar ? '⭐ Sí' : 'No'}</span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button onClick={() => handleOpenEditModal(p)} className="btn-action edit" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="btn-action delete" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="td-empty">
                  No se encontraron productos registrados en el catálogo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect animate-fade-in">
            <div className="modal-header">
              <h3>{editingProduct ? '📝 Editar Producto DXN' : '✨ Agregar Nuevo Producto'}</h3>
              <button onClick={handleCloseModal} className="btn-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="error-alert">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label htmlFor="name">Nombre del Producto *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ej: Café Lingzhi 3 en 1"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="price">Precio Público (S/.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    placeholder="S/. 65.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="category">Categoría *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="bebidas">☕ Bebidas / Café</option>
                    <option value="suplementos">🌿 Suplementos</option>
                    <option value="cuidado_personal">🧼 Cuidado Personal</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="stock">Stock Inicial *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group flex-1 align-center-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isStar"
                      checked={formData.isStar}
                      onChange={handleInputChange}
                    />
                    <span>⭐ Producto Estrella</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">URL de Imagen del Producto *</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción Corta *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Escribe una breve descripción del producto..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="benefits">Beneficios para la salud (Uno por línea)</label>
                <textarea
                  id="benefits"
                  name="benefits"
                  placeholder="Ej: Fortalece el sistema inmune&#10;Desintoxica el organismo&#10;Bajo en cafeína"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-accent">
                  {loading ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding-bottom: 60px;
        }
        .dashboard-header {
          display: flex;
          justify-content: justify-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .dashboard-header h2 {
          font-family: var(--font-title);
          font-size: 2rem;
          color: var(--primary-deep);
        }
        .dashboard-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        @media (max-width: 600px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
        
        .success-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: var(--radius-sm);
          background-color: rgba(5, 150, 105, 0.05);
          border-left: 4px solid var(--primary);
          margin-bottom: 24px;
          color: var(--primary-deep);
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        /* ESTADISTICAS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
        .stats-grid .stat-card {
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .stat-number {
          font-family: var(--font-title);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--primary-deep);
        }
        .text-gold { color: var(--accent-gold-dark); }
        .text-red { color: #dc2626; }

        /* CONTROLES */
        .table-controls {
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          margin-bottom: 20px;
        }
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 400px;
        }
        .search-box .search-icon {
          position: absolute;
          left: 14px;
          width: 18px;
          height: 18px;
          color: var(--text-light);
        }
        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 42px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--bg-tertiary);
          background-color: var(--bg-primary);
          color: var(--text-main);
          font-size: 0.9rem;
        }
        .search-box input:focus {
          border-color: var(--primary);
          background-color: #ffffff;
        }

        /* TABLA */
        .table-wrapper {
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          overflow-x: auto;
          box-shadow: var(--shadow-sm);
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.95rem;
        }
        .products-table th {
          background-color: var(--bg-secondary);
          color: var(--primary-deep);
          font-family: var(--font-title);
          font-weight: 700;
          padding: 16px 20px;
          border-bottom: 1px solid var(--nav-border);
        }
        .products-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--nav-border);
          color: var(--text-muted);
          vertical-align: middle;
        }
        .products-table tr:hover td {
          background-color: rgba(6, 78, 59, 0.01);
        }
        .td-image-wrapper {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background-color: var(--bg-tertiary);
        }
        .td-image {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .td-name {
          font-weight: 600;
          color: var(--primary-deep);
        }
        .td-category {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 600;
        }
        .td-price {
          font-weight: 700;
          color: var(--accent-gold-dark);
        }
        .td-stock {
          font-weight: 600;
          color: var(--text-muted);
        }
        .td-stock.out {
          color: #dc2626;
          font-weight: 700;
        }
        .td-actions {
          display: flex;
          gap: 10px;
        }
        .btn-action {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--bg-tertiary);
          background-color: #ffffff;
          transition: var(--transition-smooth);
        }
        .btn-action.edit {
          color: var(--primary);
        }
        .btn-action.edit:hover {
          background-color: var(--primary-transparent);
          border-color: var(--primary);
        }
        .btn-action.delete {
          color: #dc2626;
        }
        .btn-action.delete:hover {
          background-color: rgba(220, 38, 38, 0.05);
          border-color: #dc2626;
        }
        .td-empty {
          text-align: center;
          padding: 40px;
          color: var(--text-light);
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 18, 0.6);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 650px;
          background-color: var(--bg-primary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: justify-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--nav-border);
        }
        .modal-header h3 {
          font-family: var(--font-title);
          color: var(--primary-deep);
          font-size: 1.3rem;
        }
        .btn-close {
          color: var(--text-light);
          cursor: pointer;
        }
        .btn-close:hover {
          color: var(--text-muted);
        }
        .modal-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row {
          display: flex;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
            gap: 16px;
          }
        }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .align-center-row {
          display: flex;
          align-items: flex-end;
          padding-bottom: 10px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-deep);
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
          padding: 12px;
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
        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background-color: rgba(220, 38, 38, 0.05);
          border-left: 4px solid #dc2626;
          margin: 16px 24px 0 24px;
          font-size: 0.85rem;
          color: #b91c1c;
          font-weight: 600;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
          border-top: 1px solid var(--nav-border);
          padding-top: 20px;
        }
      `}</style>
    </div>
  )
}
