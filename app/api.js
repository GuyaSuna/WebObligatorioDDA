// Cliente API sencillo para estudiantes
const API_BASE_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || "Error en la peticion");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response;
}

const obtenerEstudiantes = () => request("/estudiantes");
const obtenerEstudiante = (id) => request(`/estudiantes/${id}`);
const crearEstudiante = (datosEstudiante) =>
  request("/estudiantes", {
    method: "POST",
    body: JSON.stringify(datosEstudiante)
  });

export { obtenerEstudiantes, obtenerEstudiante, crearEstudiante };
