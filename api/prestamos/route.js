import { NextResponse } from 'next/server';

// Simulamos una base de datos en memoria
let prestamos = [
  {
    id: 1,
    usuario: {
      numeroUsuario: "EST123456",
      nombre: "María González",
      tipo: "ESTUDIANTE"
    },
    libro: {
      codigo: "LIB-001",
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      tipo: "FISICO"
    },
    fechaPrestamo: "2024-11-10",
    fechaDevolucion: "2024-11-25",
    estado: "ACTIVO",
    renovaciones: 0
  },
  {
    id: 2,
    usuario: {
      numeroUsuario: "PROF789012",
      nombre: "Dr. Carlos Rodríguez",
      tipo: "PROFESOR"
    },
    libro: {
      codigo: "LIB-002",
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      tipo: "FISICO"
    },
    fechaPrestamo: "2024-10-15",
    fechaDevolucion: "2024-11-14",
    fechaDevolucionReal: "2024-11-12",
    estado: "DEVUELTO",
    renovaciones: 1
  },
  {
    id: 3,
    usuario: {
      numeroUsuario: "EST234567",
      nombre: "Juan Pérez",
      tipo: "ESTUDIANTE"
    },
    libro: {
      codigo: "LIB-003",
      titulo: "Algoritmos y Estructuras de Datos",
      autor: "Thomas H. Cormen",
      tipo: "DIGITAL"
    },
    fechaPrestamo: "2024-11-01",
    fechaDevolucion: "2024-11-16",
    estado: "VENCIDO",
    renovaciones: 2
  }
];

let nextId = 4;

// Simulamos las listas de usuarios y libros (normalmente vendrían de la base de datos)
const usuarios = [
  {
    id: 1,
    numeroUsuario: "EST123456",
    nombre: "María González",
    tipo: "ESTUDIANTE",
    limiteLibros: 3,
    prestamosActivos: 1
  },
  {
    id: 2,
    numeroUsuario: "PROF789012",
    nombre: "Dr. Carlos Rodríguez",
    tipo: "PROFESOR",
    limiteLibros: 5,
    prestamosActivos: 0
  },
  {
    id: 3,
    numeroUsuario: "EST234567",
    nombre: "Juan Pérez",
    tipo: "ESTUDIANTE",
    limiteLibros: 3,
    prestamosActivos: 1
  }
];

const libros = [
  {
    id: 1,
    codigo: "LIB-001",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    tipo: "FISICO",
    disponible: false
  },
  {
    id: 4,
    codigo: "LIB-004",
    titulo: "Historia del Arte",
    autor: "Ernst Gombrich",
    tipo: "FISICO",
    disponible: true
  }
];

export async function GET() {
  try {
    // Determinar estado actual basado en fechas
    const prestamosConEstado = prestamos.map(prestamo => {
      if (prestamo.estado === 'DEVUELTO') return prestamo;

      const hoy = new Date();
      const fechaLimite = new Date(prestamo.fechaDevolucion);

      if (hoy > fechaLimite && prestamo.estado === 'ACTIVO') {
        return { ...prestamo, estado: 'VENCIDO' };
      }

      return prestamo;
    });

    return NextResponse.json(prestamosConEstado);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    return NextResponse.json(
      { message: 'Error al cargar los préstamos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { usuarioId, libroId, fechaDevolucion } = await request.json();

    // Validaciones básicas
    if (!usuarioId || !libroId) {
      return NextResponse.json(
        { message: 'Usuario y libro son obligatorios' },
        { status: 400 }
      );
    }

    // Buscar usuario y libro
    const usuario = usuarios.find(u => u.id === usuarioId);
    const libro = libros.find(l => l.id === libroId);

    if (!usuario) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (!libro) {
      return NextResponse.json(
        { message: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    if (!libro.disponible) {
      return NextResponse.json(
        { message: 'El libro no está disponible' },
        { status: 400 }
      );
    }

    // Verificar límite de préstamos
    if (usuario.prestamosActivos >= usuario.limiteLibros) {
      return NextResponse.json(
        { message: `El usuario ha alcanzado el límite de ${usuario.limiteLibros} préstamos` },
        { status: 400 }
      );
    }

    const nuevoPrestamo = {
      id: nextId++,
      usuario: {
        numeroUsuario: usuario.numeroUsuario,
        nombre: usuario.nombre,
        tipo: usuario.tipo
      },
      libro: {
        codigo: libro.codigo,
        titulo: libro.titulo,
        autor: libro.autor,
        tipo: libro.tipo
      },
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucion: fechaDevolucion,
      estado: 'ACTIVO',
      renovaciones: 0
    };

    prestamos.push(nuevoPrestamo);

    // Actualizar disponibilidad del libro
    libro.disponible = false;

    // Incrementar préstamos activos del usuario
    usuario.prestamosActivos++;

    return NextResponse.json(nuevoPrestamo, { status: 201 });
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    return NextResponse.json(
      { message: 'Error al crear el préstamo' },
      { status: 500 }
    );
  }
}