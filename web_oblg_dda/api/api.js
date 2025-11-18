const URL = "http://localhost:5000";

async function tomarUsuarios() {
  const respuesta = await fetch(`${URL}/usuarios`);
  const datos = await respuesta.json();
  return datos;
}

async function crearUsuario(usuario) {
  const respuesta = await fetch(`${URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  });

  if (!respuesta.ok) throw new Error("Nope, no se pudo crear usuario jiji");

  return await respuesta.json();
}

async function actualizarUsuario(id, usuarioActualizado) {
  const respuesta = await fetch(`${URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuarioActualizado),
  });

  if (!respuesta.ok) throw new Error("Error al actualizar usuario");

  return await respuesta.json();
}

async function eliminarUsuario(id) {
  const respuesta = await fetch(`${URL}/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) throw new Error("Error al eliminar usuario");

  return await respuesta.json();
}

export { URL, tomarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario };
