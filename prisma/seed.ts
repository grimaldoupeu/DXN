import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando la siembra (seed) de la base de datos DXN...')

  // Limpiar productos existentes para evitar duplicados en re-seeds
  await prisma.product.deleteMany({})
  console.log('🗑️ Base de datos de productos limpiada.')

  const products = [
    {
      name: 'Café Lingzhi 3 en 1',
      slug: 'cafe-lingzhi-3-en-1',
      description: 'Una mezcla armoniosa de café gourmet instantáneo de excelente calidad, crema vegetal de suave consistencia y extracto de hongo Ganoderma Lucidum. Es un café sumamente cremoso, de sabor suave y aroma exquisito, con un bajísimo contenido de cafeína.',
      benefits: 'Apoya al sistema de defensas del cuerpo (inmunológico)\nAyuda a oxigenar las células y desintoxicar el organismo\nContenido de cafeína muy bajo (0.06%), ideal para hipertensos\nNo produce acidez y es amable con el estómago\nProporciona una sensación refrescante de energía y vitalidad',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800',
      category: 'bebidas',
      stock: 30,
      isStar: true,
    },
    {
      name: 'Café Negro Lingzhi 2 en 1',
      slug: 'cafe-negro-lingzhi-2-en-1',
      description: 'Café negro gourmet instantáneo enriquecido con extracto de Ganoderma Lucidum. Sin azúcar añadido, conserva el sabor intenso del café negro clásico con todos los beneficios antioxidantes y curativos del hongo Ganoderma. Perfecto para amantes del buen café con cuerpo.',
      benefits: 'Excelente antioxidante natural que combate los radicales libres\nAyuda a regular los niveles de glucosa y colesterol\nPromueve una buena circulación sanguínea\nFavorece la quema de grasa y acelera el metabolismo de forma natural\nSabor fuerte y aromático que despierta los sentidos sin causar nerviosismo',
      price: 62.00,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800',
      category: 'bebidas',
      stock: 25,
      isStar: true,
    },
    {
      name: 'Cocozhi DXN',
      slug: 'cocozhi-dxn',
      description: 'Exquisita bebida de chocolate premium con extracto de Ganoderma Lucidum (obtenido del micelio de hongo joven, rico en polisacáridos y germanio orgánico). Posee un sabor a cacao de primera calidad y es excelente para toda la familia, especialmente niños y adultos mayores.',
      benefits: 'Estimula el desarrollo cerebral, la memoria y la concentración en niños\nAlto valor nutricional rico en vitaminas, minerales y micronutrientes\nExcelente fuente de energía saludable para el crecimiento diario\nContiene Germanio Orgánico que mejora la oxigenación celular\nPromueve un sueño reparador consumido por las noches',
      price: 72.00,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800',
      category: 'bebidas',
      stock: 20,
      isStar: true,
    },
    {
      name: 'Cereal de Espirulina DXN',
      slug: 'cereal-de-espirulina-dxn',
      description: 'Una de las fuentes de nutrientes más completas del planeta. Combina cereal de trigo de alta calidad con polvo de alga Espirulina seleccionada de DXN. Este superalimento aporta proteínas completas, hierro, clorofila, betacaroteno y una gama completa de vitaminas.',
      benefits: 'Combate la anemia y el cansancio crónico gracias a su alto contenido de hierro\nAporta proteínas vegetales altamente asimilables de excelente calidad\nExcelente desintoxicante natural rico en clorofila y antioxidantes\nAyuda a regular el tránsito intestinal y promueve la saciedad saludable\nIdeal para deportistas, niños en etapa de crecimiento y control de peso',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?q=80&w=800',
      category: 'suplementos',
      stock: 15,
      isStar: true,
    },
    {
      name: 'Jabón Ganozhi DXN',
      slug: 'jabon-ganozhi-dxn',
      description: 'Jabón corporal y facial de fórmula especial enriquecida con extracto de Ganoderma Lucidum y aceite de palma puro. Limpia suavemente la piel mientras preserva sus aceites naturales y equilibra el pH, brindando una experiencia rejuvenecedora y nutritiva.',
      benefits: 'Limpia profundamente los poros sin resecar ni irritar la piel\nRico en antioxidantes que combaten el envejecimiento prematuro de la piel\nAyuda a atenuar imperfecciones, acné, manchas y alergias cutáneas\nNutre e hidrata la dermis gracias a los ácidos grasos del aceite de palma\nApto para todo tipo de pieles, incluyendo las más sensibles y de bebés',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1607006342411-92fc462b22fe?q=80&w=800',
      category: 'cuidado_personal',
      stock: 50,
      isStar: false,
    },
    {
      name: 'Pasta Dental Ganozhi',
      slug: 'pasta-dental-ganozhi',
      description: 'Pasta dental revolucionaria de DXN, elaborada con extracto del hongo Ganoderma Lucidum de alta calidad, gel alimenticio y mentol. Completamente libre de flúor, sacarina, colorantes artificiales o microplásticos abrasivos, siendo 100% natural y segura al tragar.',
      benefits: 'Promueve la salud de las encías previniendo el sangrado y la gingivitis\nCombate eficazmente la placa bacteriana, caries y sarro dental\nBrinda un aliento fresco natural y duradero con su toque de menta\nAlivia molestias bucales, aftas y sensibilidad dental de forma rápida\nAl ser de grado alimenticio, es ultra segura para el uso diario infantil',
      price: 28.00,
      image: 'https://images.unsplash.com/photo-1559599189-fe84dea4eb79?q=80&w=800',
      category: 'cuidado_personal',
      stock: 40,
      isStar: false,
    },
  ]

  for (const item of products) {
    const product = await prisma.product.create({
      data: item,
    })
    console.log(`✅ Producto creado: ${product.name} (S/. ${product.price.toFixed(2)})`)
  }

  console.log('🎉 Siembra de base de datos finalizada con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
