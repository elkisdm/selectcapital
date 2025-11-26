import { NextResponse } from 'next/server'

/**
 * API Route para obtener el valor actual de la UF
 * Usa la API gratuita de findic.cl
 */
export async function GET() {
  try {
    // Obtener de findic.cl
    const response = await fetch('https://findic.cl/api/uf', {
      next: { revalidate: 3600 }, // Cache por 1 hora
    })

    if (!response.ok) {
      throw new Error('Error al obtener UF de findic.cl')
    }

    const data = await response.json()

    // findic.cl retorna: { "serie": [{ "fecha": "2025-11-19", "valor": 39643.59 }, ...] }
    if (data.serie && Array.isArray(data.serie) && data.serie.length > 0) {
      // Tomar el primer valor de la serie (más reciente)
      const valorActual = data.serie[0]
      return NextResponse.json({
        uf: valorActual.valor,
        fecha: valorActual.fecha,
        source: 'findic.cl',
      })
    }

    throw new Error('Formato de respuesta inesperado de findic.cl')
  } catch (error) {
    // Fallback: retornar un valor aproximado (último conocido)
    console.error('Error obteniendo UF:', error)
    
    return NextResponse.json(
      {
        uf: 39643, // Valor aproximado de fallback (noviembre 2025)
        fecha: new Date().toISOString(),
        source: 'fallback',
        error: 'No se pudo obtener el valor actualizado. Usa el valor manual.',
      },
      { status: 200 } // Retornamos 200 pero con error en el mensaje
    )
  }
}

