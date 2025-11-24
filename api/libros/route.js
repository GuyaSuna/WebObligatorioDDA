import { NextResponse } from 'next/server';

// Simulamos una base de datos en memoria
let libros = [
  {
    id: 1,
    codigo: "LIB-001",
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    genero: "Literatura",
    año: 1967,
    tipo: "FISICO",
    disponible: true,
    ubicacion: "Estante A, Sección 1, Nivel 2"
  },
  {
    id: 2,
    codigo: "LIB-002",
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    genero: "Literatura",
    año: 1943,
    tipo: "FISICO",
    disponible: false,
    ubicacion: "Estante A, Sección 1, Nivel 3"
  },
  {
    id: 3,
    codigo: "LIB-003",
    titulo: "Algoritmos y Estructuras de Datos",
    autor: "Thomas H. Cormen",
    genero: "Tecnología",
    año: 2009,
    tipo: "DIGITAL",
    disponible: true
  },
  {
    id: 4,
    codigo: "LIB-004",
    titulo: "Historia del Arte",
    autor: "Ernst Gombrich",
    genero: "Arte",
    año: 1950,
    tipo: "FISICO",
    disponible: true,
    ubicacion: "Estante B, Sección 2, Nivel 1"
  }
];

let nextId = 5;

export async function GET() {
  try {
    return NextResponse.json(libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return NextResponse.json(
      { message: 'Error al cargar los libros' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validaciones básicas
    if (!data.codigo || !data.titulo || !data.autor || !data.genero || !data.año) {
      return NextResponse.json(
        { message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Verificar que el código no exista
    const codigoExiste = libros.some(libro => libro.codigo === data.codigo);
    if (codigoExiste) {
      return NextResponse.json(
        { message: 'Ya existe un libro con ese código' },
        { status: 400 }
      );
    }

    const nuevoLibro = {
      id: nextId++,
      codigo: data.codigo,
      titulo: data.titulo,
      autor: data.autor,
      genero: data.genero,
      año: parseInt(data.año),
      tipo: data.tipo || 'FISICO',
      disponible: true,
      ubicacion: data.ubicacion || '',
      descripcion: data.descripcion || ''
    };

    libros.push(nuevoLibro);

    return NextResponse.json(nuevoLibro, { status: 201 });
  } catch (error) {
    console.error('Error al crear libro:', error);
    return NextResponse.json(
      { message: 'Error al crear el libro' },
      { status: 500 }
    );
  }
}