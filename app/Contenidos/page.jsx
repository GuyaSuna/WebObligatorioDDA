"use client";
import { tomarContenidos, crearContenido, actualizarContenido, eliminarContenido } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function Contenidos() {
  const [contenidos, setContenidos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contenidoEnEdicion, setContenidoEnEdicion] = useState(null);
  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    duracion: "",
    anoEstreno: "",
    precio: "",
    imagenPortada: "",
    enlaceTrailer: "",
    exclusivoPremium: false
  });

  const cargarContenidos = async () => {
    try {
      const data = await tomarContenidos();
      setContenidos(data);
    } catch (error) {
      console.error("Error al cargar contenidos:", error);
    }
  };

  useEffect(() => {
    cargarContenidos();
  }, []);

  const manejarCambioFormulario = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (contenidoEnEdicion) {
        await actualizarContenido(contenidoEnEdicion.id, formulario);
      } else {
        await crearContenido(formulario);
      }
      await cargarContenidos();
      resetearFormulario();
    } catch (error) {
      console.error("Error al guardar contenido:", error);
    }
  };

  const manejarEditar = (contenido) => {
    setContenidoEnEdicion(contenido);
    setFormulario(contenido);
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id) => {
    if (confirm("¿Está seguro de eliminar este contenido?")) {
      try {
        await eliminarContenido(id);
        await cargarContenidos();
      } catch (error) {
        console.error("Error al eliminar contenido:", error);
      }
    }
  };

  const resetearFormulario = () => {
    setFormulario({
      titulo: "",
      descripcion: "",
      categoria: "",
      duracion: "",
      anoEstreno: "",
      precio: "",
      imagenPortada: "",
      enlaceTrailer: "",
      exclusivoPremium: false
    });
    setContenidoEnEdicion(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Contenidos</h1>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {mostrarFormulario ? "Cancelar" : "Nuevo Contenido"}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {contenidoEnEdicion ? "Editar Contenido" : "Nuevo Contenido"}
            </h2>
            <form onSubmit={manejarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={formulario.categoria}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="accion">Acción</option>
                  <option value="drama">Drama</option>
                  <option value="comedia">Comedia</option>
                  <option value="terror">Terror</option>
                  <option value="ciencia-ficcion">Ciencia Ficción</option>
                  <option value="romance">Romance</option>
                  <option value="documentales">Documentales</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  name="duracion"
                  value={formulario.duracion}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Año de Estreno
                </label>
                <input
                  type="number"
                  name="anoEstreno"
                  value={formulario.anoEstreno}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={formulario.precio}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagen de Portada (URL)
                </label>
                <input
                  type="url"
                  name="imagenPortada"
                  value={formulario.imagenPortada}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={manejarCambioFormulario}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enlace de Trailer
                </label>
                <input
                  type="url"
                  name="enlaceTrailer"
                  value={formulario.enlaceTrailer}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="exclusivoPremium"
                  checked={formulario.exclusivoPremium}
                  onChange={manejarCambioFormulario}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold">
                  Exclusivo Premium
                </label>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {contenidoEnEdicion ? "Actualizar" : "Crear"} Contenido
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
          <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Lista de Contenidos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Premium
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contenidos.map((contenido) => (
                  <tr key={contenido.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {contenido.imagenPortada && (
                          <img
                            className="h-10 w-10 rounded object-cover mr-3"
                            src={contenido.imagenPortada}
                            alt={contenido.titulo}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contenido.titulo}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contenido.descripcion?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contenido.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contenido.duracion} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contenido.anoEstreno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${contenido.precio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        contenido.exclusivoPremium
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {contenido.exclusivoPremium ? 'Premium' : 'Estándar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => manejarEditar(contenido)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(contenido.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contenidos.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay contenidos registrados</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}