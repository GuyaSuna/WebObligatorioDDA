const URL = "https://pokeapi.co/api/v2";
const LOCAL_STORAGE_KEY = "pokemon_app_data";

// Simulamos datos locales para las funciones CRUD
let localData = {
  entrenadores: [
    { id: 1, nombre: "Ash Ketchum", email: "ash@pokemon.com", fechaRegistro: "2024-01-15", tipoUsuario: "premium" },
    { id: 2, nombre: "Misty", email: "misty@pokemon.com", fechaRegistro: "2024-02-10", tipoUsuario: "estandar" },
    { id: 3, nombre: "Brock", email: "brock@pokemon.com", fechaRegistro: "2024-01-20", tipoUsuario: "premium" }
  ],
  batallas: [
    { id: 1, entrenadorId: 1, pokemonId: 25, fechaHora: "2024-11-15T10:30:00", duracionBatalla: 15, resultado: 5 },
    { id: 2, entrenadorId: 2, pokemonId: 54, fechaHora: "2024-11-14T14:15:00", duracionBatalla: 20, resultado: 4 }
  ]
};

// Cargar datos del localStorage si existen
function cargarDatosLocales() {
  const datos = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (datos) {
    localData = JSON.parse(datos);
  }
}

// Guardar datos en localStorage
function guardarDatosLocales() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
}

async function tomarUsuarios() {
  cargarDatosLocales();
  return localData.entrenadores;
}

async function crearUsuario(usuario) {
  cargarDatosLocales();
  const nuevoId = Math.max(...localData.entrenadores.map(e => e.id), 0) + 1;
  const nuevoEntrenador = { ...usuario, id: nuevoId };
  localData.entrenadores.push(nuevoEntrenador);
  guardarDatosLocales();
  return nuevoEntrenador;
}

async function actualizarUsuario(id, usuarioActualizado) {
  cargarDatosLocales();
  const index = localData.entrenadores.findIndex(e => e.id == id);
  if (index !== -1) {
    localData.entrenadores[index] = { ...localData.entrenadores[index], ...usuarioActualizado };
    guardarDatosLocales();
    return localData.entrenadores[index];
  }
  throw new Error("Entrenador no encontrado");
}

async function eliminarUsuario(id) {
  cargarDatosLocales();
  const index = localData.entrenadores.findIndex(e => e.id == id);
  if (index !== -1) {
    const eliminado = localData.entrenadores.splice(index, 1)[0];
    guardarDatosLocales();
    return eliminado;
  }
  throw new Error("Entrenador no encontrado");
}

async function tomarContenidos() {
  // Simulamos obtener una lista de Pokémon desde PokeAPI
  const respuesta = await fetch(`${URL}/pokemon?limit=50`);
  const datos = await respuesta.json();

  // Transformamos los datos para que coincidan con nuestro modelo
  const pokemonList = await Promise.all(
    datos.results.slice(0, 20).map(async (pokemon, index) => {
      const detailResponse = await fetch(pokemon.url);
      const detail = await detailResponse.json();

      return {
        id: detail.id,
        titulo: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
        descripcion: `Un Pokémon de tipo ${detail.types.map(t => t.type.name).join('/')}`,
        categoria: detail.types[0].type.name,
        duracion: Math.floor(Math.random() * 60) + 30, // Duración simulada de batalla
        anoEstreno: 1996 + Math.floor(Math.random() * 28), // Años aleatorios desde 1996
        precio: (Math.random() * 50 + 10).toFixed(2),
        imagenPortada: detail.sprites.front_default,
        enlaceTrailer: `https://pokemon.com/${detail.name}`,
        exclusivoPremium: detail.base_experience > 150 // Los más raros son premium
      };
    })
  );

  return pokemonList;
}

async function crearContenido(contenido) {
  // Simular creación de contenido personalizado
  const nuevoContenido = {
    id: Date.now(), // ID temporal
    ...contenido,
    custom: true // Marcar como contenido personalizado
  };
  return nuevoContenido;
}

async function actualizarContenido(id, contenidoActualizado) {
  // Simular actualización de contenido
  return { id, ...contenidoActualizado };
}

async function eliminarContenido(id) {
  // Simular eliminación de contenido
  return { message: `Pokémon con ID ${id} eliminado` };
}

async function tomarReproducciones() {
  cargarDatosLocales();
  return localData.batallas;
}

async function crearReproduccion(reproduccion) {
  cargarDatosLocales();
  const nuevoId = Math.max(...localData.batallas.map(b => b.id), 0) + 1;
  const nuevaBatalla = { ...reproduccion, id: nuevoId };
  localData.batallas.push(nuevaBatalla);
  guardarDatosLocales();
  return nuevaBatalla;
}

async function obtenerReportes(endpoint) {
  // Simular reportes basados en datos locales
  cargarDatosLocales();

  if (endpoint.includes('contenidos-populares')) {
    // Pokémon más utilizados en batallas
    const pokemonBatallas = {};
    localData.batallas.forEach(batalla => {
      pokemonBatallas[batalla.pokemonId] = (pokemonBatallas[batalla.pokemonId] || 0) + 1;
    });

    return Object.entries(pokemonBatallas)
      .map(([id, count]) => ({
        id: parseInt(id),
        titulo: `Pokémon #${id}`,
        reproducciones: count
      }))
      .filter(p => p.reproducciones >= 1);
  }

  if (endpoint.includes('usuarios')) {
    return localData.entrenadores;
  }

  if (endpoint.includes('reproducciones-usuario')) {
    const userId = endpoint.split('/').pop();
    return localData.batallas.filter(b => b.entrenadorId == userId);
  }

  return [];
}

export {
  URL,
  tomarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  tomarContenidos,
  crearContenido,
  actualizarContenido,
  eliminarContenido,
  tomarReproducciones,
  crearReproduccion,
  obtenerReportes
};
