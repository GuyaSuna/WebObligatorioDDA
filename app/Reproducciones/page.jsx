"use client";
import { tomarReproducciones, crearReproduccion, tomarContenidos, tomarUsuarios } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function Reproducciones() {
  const [reproducciones, setReproducciones] = useState([]);
  const [contenidos, setContenidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    usuarioId: "",
    contenidoId: "",
    fechaHora: "",
    duracionReproducida: "",
    calificacion: ""
  });

  const cargarDatos = async () => {
    try {
      const [repData, contData, userdata] = await Promise.all([
        tomarReproducciones(),
        tomarContenidos(),
        tomarUsuarios()
      ]);
      setReproducciones(repData);
      setContenidos(contData);
      setUsuarios(userdata);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const reproduccionData = {
        ...formulario,
        fechaHora: formulario.fechaHora || new Date().toISOString()
      };
      await crearReproduccion(reproduccionData);
      await cargarDatos();
      resetearFormulario();
    } catch (error) {
      console.error("Error al registrar reproducción:", error);
      alert("Error al registrar reproducción. Verifique que el usuario tenga permisos para este contenido.");
    }
  };

  const resetearFormulario = () => {
    setFormulario({
      usuarioId: "",
      contenidoId: "",
      fechaHora: "",
      duracionReproducida: "",
      calificacion: ""
    });
    setMostrarFormulario(false);
  };

  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id == usuarioId);
    return usuario ? usuario.nombre : "Usuario desconocido";
  };

  const obtenerTituloContenido = (contenidoId) => {
    const contenido = contenidos.find(c => c.id == contenidoId);
    return contenido ? contenido.titulo : "Contenido desconocido";
  };

  const validarAccesoContenido = (usuarioId, contenidoId) => {
    const usuario = usuarios.find(u => u.id == usuarioId);
    const contenido = contenidos.find(c => c.id == contenidoId);

    if (!usuario || !contenido) return false;
    if (contenido.exclusivoPremium && usuario.tipoUsuario !== 'premium') {
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Registro de Reproducciones</h1>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {mostrarFormulario ? "Cancelar" : "Nueva Reproducción"}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Registrar Nueva Reproducción</h2>
            <form onSubmit={manejarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Usuario
                </label>
                <select
                  name="usuarioId"
                  value={formulario.usuarioId}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} ({usuario.tipoUsuario})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Contenido
                </label>
                <select
                  name="contenidoId"
                  value={formulario.contenidoId}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar contenido</option>
                  {contenidos.map((contenido) => (
                    <option
                      key={contenido.id}
                      value={contenido.id}
                      disabled={formulario.usuarioId && !validarAccesoContenido(formulario.usuarioId, contenido.id)}
                    >
                      {contenido.titulo} {contenido.exclusivoPremium ? "(Premium)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  name="fechaHora"
                  value={formulario.fechaHora}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duración Reproducida (minutos)
                </label>
                <input
                  type="number"
                  name="duracionReproducida"
                  value={formulario.duracionReproducida}
                  onChange={manejarCambioFormulario}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Calificación (1-5 estrellas)
                </label>
                <select
                  name="calificacion"
                  value={formulario.calificacion}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar calificación</option>
                  <option value="1">1 estrella</option>
                  <option value="2">2 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="5">5 estrellas</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Registrar Reproducción
                </button>
                <button
                  type="button"
                  onClick={resetearFormulario}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Historial de Reproducciones</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contenido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reproducciones.map((reproduccion, index) => (
                  <tr key={reproduccion.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {obtenerNombreUsuario(reproduccion.usuarioId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {obtenerTituloContenido(reproduccion.contenidoId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reproduccion.fechaHora ? new Date(reproduccion.fechaHora).toLocaleString() : "No disponible"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reproduccion.duracionReproducida} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < reproduccion.calificacion ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({reproduccion.calificacion}/5)</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reproducciones.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay reproducciones registradas</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}