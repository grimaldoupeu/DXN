'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, AlertCircle, Leaf } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Por favor, ingresa la contraseña')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirigir al panel de administración
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Contraseña incorrecta')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setError('Ocurrió un error al conectar con el servidor')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card glass-effect animate-fade-in">
        {/* LOGO BRANNDING */}
        <div className="login-header">
          <div className="logo-icon">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2>Portal del Distribuidor</h2>
          <p>Ingresa la contraseña de seguridad para gestionar tu tienda DXN</p>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="error-alert">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Contraseña de Administrador</label>
            <div className="input-wrapper">
              <Lock className="w-5 h-5 text-stone-400 input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-toggle-eye"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-accent full-width">
            {loading ? 'Accediendo...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, rgba(6, 78, 59, 0.04) 0%, rgba(251, 250, 247, 0) 80%);
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--card-border);
          box-shadow: var(--shadow-lg);
          background-color: var(--card-bg);
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }
        }
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 30px;
        }
        .logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-deep) 0%, var(--primary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: var(--shadow-sm);
        }
        .login-header h2 {
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-deep);
          margin-bottom: 8px;
        }
        .login-header p {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          background-color: rgba(220, 38, 38, 0.05);
          border-left: 4px solid #dc2626;
          margin-bottom: 24px;
          font-size: 0.85rem;
          color: #b91c1c;
          font-weight: 600;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
        }
        .input-wrapper input {
          width: 100%;
          padding: 14px 45px 14px 45px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--bg-tertiary);
          background-color: var(--bg-primary);
          color: var(--text-main);
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .input-wrapper input:focus {
          border-color: var(--primary);
          background-color: #ffffff;
          box-shadow: 0 0 0 3px var(--primary-transparent);
        }
        .btn-toggle-eye {
          position: absolute;
          right: 14px;
          color: var(--text-light);
          cursor: pointer;
        }
        .btn-toggle-eye:hover {
          color: var(--text-muted);
        }
        .full-width {
          width: 100%;
          justify-content: center;
          padding: 14px;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  )
}
