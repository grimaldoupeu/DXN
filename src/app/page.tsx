import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, ShieldCheck, Heart, Award, CheckCircle } from 'lucide-react'
import prisma from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/CartContext'

export const revalidate = 60 // Revalidar la página cada minuto para reflejar cambios del admin

export default async function HomePage() {
  // Obtener los productos estrella para la Home
  let starProducts: Product[] = []
  try {
    const dbProducts = await prisma.product.findMany({
      where: { isStar: true },
      take: 4,
    })
    // Mapear los tipos de Prisma al tipo local Product (asegura compatibilidad)
    starProducts = dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      benefits: p.benefits,
      price: p.price,
      image: p.image,
      category: p.category,
      stock: p.stock,
      isStar: p.isStar,
    }))
  } catch (error) {
    console.error('Error cargando productos estrella:', error)
  }

  return (
    <div className="home-container animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tagline">🌿 Cuidado Natural & Nutrición Celular</span>
            <h1 className="hero-title">
              Eleva tu Salud con el Poder del <span className="text-highlight">Ganoderma Lucidum</span>
            </h1>
            <p className="hero-desc">
              Descubre las bebidas gourmet y suplementos nutricionales de <strong>DXN</strong> en Perú. Enriquecidos con hongos milenarios y algas orgánicas para desintoxicar, oxigenar y revitalizar tu cuerpo de forma natural y deliciosa.
            </p>
            <div className="hero-actions">
              <Link href="/catalog" className="btn-primary">
                Ver Catálogo S/. <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#ganoderma-info" className="btn-secondary">
                Saber más sobre Ganoderma
              </a>
            </div>
            
            {/* Pequeños USP */}
            <div className="hero-usp">
              <div className="usp-item">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>100% Orgánico</span>
              </div>
              <div className="usp-item">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Envíos a todo el Perú</span>
              </div>
              <div className="usp-item">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Soporte vía WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="image-blob-bg"></div>
            <div className="hero-card glass-effect animate-bounce-slow">
              <Image 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800" 
                alt="Café Lingzhi DXN Orgánico" 
                width={450} 
                height={450}
                className="hero-image"
                priority
              />
              <div className="floating-badge glass-effect">
                <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="badge-title">Café Lingzhi</span>
                  <span className="badge-text">100% Extracto de Ganoderma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="stats-section glass-effect">
        <div className="container stats-grid">
          <div className="stat-card">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <div className="stat-info">
              <h3>Calidad Certificada</h3>
              <p>Procesos ecológicos y certificaciones ISO internacionales.</p>
            </div>
          </div>
          <div className="stat-card">
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <div className="stat-info">
              <h3>Líder Mundial</h3>
              <p>Presencia en más de 180 países promoviendo bienestar.</p>
            </div>
          </div>
          <div className="stat-card">
            <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <div className="stat-info">
              <h3>Bienestar Integral</h3>
              <p>Suplementación celular para una longevidad activa y sana.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTOS ESTRELLA (STAR PRODUCTS) */}
      <section className="star-products-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Lo más elegido</span>
            <h2 className="section-title">Productos Estrella de DXN</h2>
            <p className="section-desc">
              Comienza tu camino hacia una salud óptima con nuestros productos más populares en Perú. Deliciosos, nutritivos y cargados de antioxidantes.
            </p>
          </div>

          <div className="products-grid">
            {starProducts.length > 0 ? (
              starProducts.map((product) => (
                <div key={product.id} className="grid-item">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="no-products">
                No se encontraron productos estrella en este momento. Visita el catálogo completo.
              </p>
            )}
          </div>

          <div className="view-catalog-container">
            <Link href="/catalog" className="btn-secondary">
              Ver Catálogo Completo S/.
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN EDUCATIVA: GANODERMA LUCIDUM */}
      <section id="ganoderma-info" className="education-section section-padding">
        <div className="container education-grid">
          <div className="education-image-container">
            <Image 
              src="https://images.unsplash.com/photo-1610970881699-44a5587caaec?q=80&w=800" 
              alt="Hongo Reishi Ganoderma Lucidum Orgánico" 
              width={500} 
              height={400}
              className="education-image"
            />
          </div>
          
          <div className="education-content">
            <span className="section-subtitle">Ciencia y Naturaleza</span>
            <h2 className="section-title">¿Qué es el Ganoderma Lucidum?</h2>
            <p className="education-desc">
              Conocido en la medicina tradicional asiática como el <strong>"Rey de las Hierbas"</strong>, el Ganoderma Lucidum es un hongo terapéutico sumamente estudiado. Aporta más de 400 nutrientes activos y 150 antioxidantes que actúan a nivel celular.
            </p>

            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">RG</div>
                <div className="benefit-text">
                  <h4>Reishi Gano (Hongo Maduro - 90 días)</h4>
                  <p>Altamente rico en triterpenoides y adenosina. Se enfoca en desintoxicar profundamente el organismo, eliminando toxinas y regulando las funciones corporales.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">GL</div>
                <div className="benefit-text">
                  <h4>Ganoceilium (Micelio Joven - 14 días)</h4>
                  <p>Sumamente rico en Germanio Orgánico, polisacáridos y minerales. Su función primordial es oxigenar las células, potenciar el cerebro y fortalecer el sistema inmune.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMBRESÍA & BENEFICIOS DE AFILIACIÓN */}
      <section className="membership-section">
        <div className="container glass-effect membership-card">
          <div className="membership-content">
            <h2>¿Quieres comprar con hasta un 30% a 40% de descuento?</h2>
            <p>
              ¡Afíliate como miembro de DXN hoy! Al obtener tu código de socio internacional, podrás comprar todos los productos a precio distribuidor, acumular puntos y emprender un negocio rentable si lo deseas.
            </p>
            <ul className="membership-features">
              <li>🏆 Membresía vitalicia, sin compras mensuales obligatorias.</li>
              <li>💰 Descuentos inmediatos en todos tus productos favoritos.</li>
              <li>📦 Envíos directos a todo el Perú y soporte de equipo.</li>
            </ul>
            <div className="membership-actions">
              <a 
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Hola!%20Me%20interesa%20obtener%20informaci%C3%B3n%20sobre%20c%C3%B3mo%20afiliarme%20a%20DXN%20Per%C3%BA%20y%20comprar%20con%20descuento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Preguntar por la Membresía vía WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
