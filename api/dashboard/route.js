import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulamos datos de ejemplo para el dashboard
    const estadisticas = {
      totalLibros: 1250,
      totalUsuarios: 345,
      prestamosActivos: 89,
      librosMasPrestados: [
        {
          titulo: "Cien años de soledad",
          autor: "Gabriel García Márquez",
          cantidadPrestamos: 15
        },
        {
          titulo: "El Principito",
          autor: "Antoine de Saint-Exupéry",
          cantidadPrestamos: 12
        },
        {
          titulo: "1984",
          autor: "George Orwell",
          cantidadPrestamos: 10
        },
        {
          titulo: "Don Quijote de la Mancha",
          autor: "Miguel de Cervantes",
          cantidadPrestamos: 8
        },
        {
          titulo: "Crónica de una muerte anunciada",
          autor: "Gabriel García Márquez",
          cantidadPrestamos: 7
        }
      ]
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return NextResponse.json(
      { message: 'Error al cargar las estadísticas' },
      { status: 500 }
    );
  }
}