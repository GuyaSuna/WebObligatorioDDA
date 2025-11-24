import { NextResponse } from 'next/server';

// Simulamos una base de datos en memoria
let usuarios = [
  {
    id: 1,
    numeroUsuario: "EST123456",
    nombre: "María González",
    email: "maria.gonzalez@estudiante.edu.uy",
    fechaRegistro: "2024-01-15",
    tipo: "ESTUDIANTE",
    limiteLibros: 3,
    prestamosActivos: 2,
    activo: true,
    telefono: "099 123 456",
    direccion: "Av. Principal 123"
  },
  {
    id: 2,
    numeroUsuario: "PROF789012",
    nombre: "Dr. Carlos Rodríguez",
    email: "carlos.rodriguez@profesor.edu.uy",
    fechaRegistro: "2023-08-20",
    tipo: "PROFESOR",
    limiteLibros: 5,
    prestamosActivos: 1,
    activo: true,
    telefono: "099 789 012",
    direccion: "Calle Secundaria 456"
  },
  {
    id: 3,
    numeroUsuario: "EST234567",
    nombre: "Juan Pérez",
    email: "juan.perez@estudiante.edu.uy",
    fechaRegistro: "2024-02-10",
    tipo: "ESTUDIANTE",
    limiteLibros: 3,
    prestamosActivos: 0,
    activo: true,
    telefono: "099 234 567",
    direccion: "Av. Libertad 789"
  },
  {
    id: 4,
    numeroUsuario: "PROF345678",
    nombre: "Dra. Ana Martínez",
    email: "ana.martinez@profesor.edu.uy",
    fechaRegistro: "2023-03-05",
    tipo: "PROFESOR",
    limiteLibros: 5,
    prestamosActivos: 3,
    activo: false,
    telefono: "099 345 678",
    direccion: "Calle Nueva 321"
  }
];

let nextId = 5;

export async function GET() {
  try {
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error al cargar los usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validaciones básicas
    if (!data.nombre || !data.email || !data.tipo) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Verificar que el email no exista
    const emailExiste = usuarios.some(usuario => usuario.email === data.email);
    if (emailExiste) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con ese email' },
        { status: 400 }
      );
    }

    // Generar número de usuario si no se proporcionó
    let numeroUsuario = data.numeroUsuario;
    if (!numeroUsuario) {
      const prefix = data.tipo === 'PROFESOR' ? 'PROF' : 'EST';
      const numero = Math.random().toString().substr(2, 6);
      numeroUsuario = `${prefix}${numero}`;
    }

    // Verificar que el número de usuario no exista
    const numeroExiste = usuarios.some(usuario => usuario.numeroUsuario === numeroUsuario);
    if (numeroExiste) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con ese número' },
        { status: 400 }
      );
    }

    // Determinar límite de libros según el tipo
    const limiteLibros = data.tipo === 'PROFESOR' ? 5 : 3;

    const nuevoUsuario = {
      id: nextId++,
      numeroUsuario,
      nombre: data.nombre,
      email: data.email,
      fechaRegistro: new Date().toISOString().split('T')[0],
      tipo: data.tipo,
      limiteLibros,
      prestamosActivos: 0,
      activo: true,
      telefono: data.telefono || '',
      direccion: data.direccion || ''
    };

    usuarios.push(nuevoUsuario);

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { message: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
}