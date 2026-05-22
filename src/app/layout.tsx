import './globals.css'
import type { Metadata } from 'next'
import { CartProvider } from '@/lib/CartContext'
import Navbar from '@/components/Navbar'
import { Phone, Mail, MapPin, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'DXN Bienestar & Salud - Productos de Ganoderma Lucidum y Espirulina',
  description: 'Descubre la gama de productos DXN de alta calidad en Perú: Café Lingzhi, Cocozhi, Espirulina y Cuidado Personal. Cuida tu salud y tu familia con el poder del Ganoderma Lucidum.',
  keywords: 'DXN, Ganoderma Lucidum, Café Lingzhi, Espirulina, Salud, Bienestar, Cocozhi, DXN Perú',
  openGraph: {
    title: 'DXN Bienestar & Salud',
    description: 'Productos premium de Ganoderma Lucidum y Espirulina con entrega a domicilio en Perú.',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          
          {/* Margen para compensar la barra de navegación fija */}
          <main style={{ marginTop: 'calc(var(--header-height) + 20px)', flex: '1 0 auto' }}>
            {children}
          </main>

          {/* Footer Premium */}
          <footer className="footer">
            <div className="container footer-grid">
              {/* Columna 1: Info Distribuidora */}
              <div className="footer-col">
                <h3 className="footer-logo">
                  DXN <span>Vida</span>
                </h3>
                <p className="footer-desc">
                  Promoviendo la salud, la riqueza y la felicidad. Distribución oficial autorizada de productos de nutrición y bienestar basados en Ganoderma Lucidum orgánico.
                </p>
                <div className="independent-badge">
                  Distribuidora Independiente DXN
                </div>
              </div>

              {/* Columna 2: Enlaces */}
              <div className="footer-col">
                <h4 className="footer-title">Explorar</h4>
                <ul className="footer-links">
                  <li><a href="/">Inicio</a></li>
                  <li><a href="/catalog">Catálogo de Productos</a></li>
                  <li><a href="/cart">Mi Carrito de Compras</a></li>
                  <li><a href="/admin">Portal del Distribuidor</a></li>
                </ul>
              </div>

              {/* Columna 3: Contacto */}
              <div className="footer-col">
                <h4 className="footer-title">Contacto Rápido</h4>
                <ul className="footer-contact">
                  <li>
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span>+51 900 895 483</span>
                  </li>
                  <li>
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>salud.dxn.peru@gmail.com</span>
                  </li>
                  <li>
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Lima, Perú (Envíos a todo el país)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="container footer-bottom-flex">
                <p className="copy-text">
                  &copy; {new Date().getFullYear()} DXN Vida. Todos los derechos reservados.
                </p>
                <p className="credits">
                  Hecho con <Heart className="w-4 h-4 text-red-500 inline" style={{ fill: 'red' }} /> para promover el bienestar.
                </p>
              </div>
            </div>
          </footer>


        </CartProvider>
      </body>
    </html>
  )
}
