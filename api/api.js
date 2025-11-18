const LOCAL_STORAGE_KEY = "ejemplo_usuarios_app";

// Simulamos datos locales solo para usuarios
let localData = {
  usuarios: [
    { id: 1, nombre: "Juan Pérez", email: "juan@email.com", fechaRegistro: "2024-01-15", tipoUsuario: "premium" },
    { id: 2, nombre: "María García", email: "maria@email.com", fechaRegistro: "2024-02-10", tipoUsuario: "estandar" },
    { id: 3, nombre: "Carlos López", email: "carlos@email.com", fechaRegistro: "2024-01-20", tipoUsuario: "premium" }
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
  return localData.usuarios;
}

async function crearUsuario(usuario) {
  cargarDatosLocales();
  const nuevoId = Math.max(...localData.usuarios.map(u => u.id), 0) + 1;
  const nuevoUsuario = { ...usuario, id: nuevoId };
  localData.usuarios.push(nuevoUsuario);
  guardarDatosLocales();
  return nuevoUsuario;
}

async function actualizarUsuario(id, usuarioActualizado) {
  cargarDatosLocales();
  const index = localData.usuarios.findIndex(u => u.id == id);
  if (index !== -1) {
    localData.usuarios[index] = { ...localData.usuarios[index], ...usuarioActualizado };
    guardarDatosLocales();
    return localData.usuarios[index];
  }
  throw new Error("Usuario no encontrado");
}

async function eliminarUsuario(id) {
  cargarDatosLocales();
  const index = localData.usuarios.findIndex(u => u.id == id);
  if (index !== -1) {
    const eliminado = localData.usuarios.splice(index, 1)[0];
    guardarDatosLocales();
    return eliminado;
  }
  throw new Error("Usuario no encontrado");
}

export {
  tomarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
