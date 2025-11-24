import { NextResponse } from 'next/server';

// Datos simulados para reportes
const prestamosData = [
  {
    id: 1,
    usuario: { nombre: "María González", numeroUsuario: "EST123456", tipo: "ESTUDIANTE" },
    libro: { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", codigo: "LIB-001" },
    fechaPrestamo: "2024-11-10",
    fechaDevolucion: "2024-11-25",
    estado: "ACTIVO"
  },
  {
    id: 2,
    usuario: { nombre: "Dr. Carlos Rodríguez", numeroUsuario: "PROF789012", tipo: "PROFESOR" },
    libro: { titulo: "El Principito", autor: "Antoine de Saint-Exupéry", codigo: "LIB-002" },
    fechaPrestamo: "2024-10-15",
    fechaDevolucion: "2024-11-14",
    estado: "DEVUELTO"
  },
  {
    id: 3,
    usuario: { nombre: "Juan Pérez", numeroUsuario: "EST234567", tipo: "ESTUDIANTE" },
    libro: { titulo: "1984", autor: "George Orwell", codigo: "LIB-005" },
    fechaPrestamo: "2024-11-01",
    fechaDevolucion: "2024-11-16",
    estado: "VENCIDO"
  },
  {
    id: 4,
    usuario: { nombre: "Ana Martínez", numeroUsuario: "PROF345678", tipo: "PROFESOR" },
    libro: { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", codigo: "LIB-001" },
    fechaPrestamo: "2024-10-20",
    fechaDevolucion: "2024-11-20",
    estado: "DEVUELTO"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const tipoUsuario = searchParams.get('tipoUsuario');
    const tipoLibro = searchParams.get('tipoLibro');

    // Si no hay tipo específico, devolver estadísticas generales
    if (!tipo) {
      const estadisticas = {
        prestamosActivos: prestamosData.filter(p => p.estado === 'ACTIVO').length,
        prestamosVencidos: prestamosData.filter(p => p.estado === 'VENCIDO').length,
        prestamosMes: prestamosData.filter(p => {
          const fecha = new Date(p.fechaPrestamo);
          const ahora = new Date();
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length
      };

      return NextResponse.json({ estadisticas });
    }

    // Filtrar datos según los parámetros
    let datosFiltrados = [...prestamosData];

    if (fechaInicio && fechaFin) {
      datosFiltrados = datosFiltrados.filter(p => {
        const fecha = new Date(p.fechaPrestamo);
        return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
      });
    }

    if (tipoUsuario && tipoUsuario !== 'TODOS') {
      datosFiltrados = datosFiltrados.filter(p => p.usuario.tipo === tipoUsuario);
    }

    // Generar reportes específicos
    switch (tipo) {
      case 'librosMasPrestados':
        const librosPrestamos = {};
        datosFiltrados.forEach(prestamo => {
          const key = prestamo.libro.titulo;
          if (!librosPrestamos[key]) {
            librosPrestamos[key] = {
              titulo: prestamo.libro.titulo,
              autor: prestamo.libro.autor,
              cantidadPrestamos: 0
            };
          }
          librosPrestamos[key].cantidadPrestamos++;
        });

        const librosMasPrestados = Object.values(librosPrestamos)
          .sort((a, b) => b.cantidadPrestamos - a.cantidadPrestamos);

        return NextResponse.json(librosMasPrestados);

      case 'usuariosMasActivos':
        const usuariosPrestamos = {};
        datosFiltrados.forEach(prestamo => {
          const key = prestamo.usuario.numeroUsuario;
          if (!usuariosPrestamos[key]) {
            usuariosPrestamos[key] = {
              nombre: prestamo.usuario.nombre,
              numeroUsuario: prestamo.usuario.numeroUsuario,
              tipo: prestamo.usuario.tipo,
              totalPrestamos: 0
            };
          }
          usuariosPrestamos[key].totalPrestamos++;
        });

        const usuariosMasActivos = Object.values(usuariosPrestamos)
          .sort((a, b) => b.totalPrestamos - a.totalPrestamos);

        return NextResponse.json(usuariosMasActivos);

      case 'prestamosPorFecha':
        const prestamosPorFecha = datosFiltrados.map(prestamo => ({
          fecha: new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES'),
          usuario: prestamo.usuario.nombre,
          libro: prestamo.libro.titulo,
          estado: prestamo.estado
        }));

        return NextResponse.json(prestamosPorFecha);

      default:
        return NextResponse.json(
          { message: 'Tipo de reporte no válido' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error al generar reportes:', error);
    return NextResponse.json(
      { message: 'Error al generar los reportes' },
      { status: 500 }
    );
  }
}