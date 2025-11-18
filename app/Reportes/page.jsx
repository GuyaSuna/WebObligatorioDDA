"use client";
import { obtenerReportes, tomarContenidos, tomarUsuarios } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function Reportes() {
  const [contenidosPopulares, setContenidosPopulares] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [reproduccionesUsuario, setReproduccionesUsuario] = useState([]);
  const [promedioCalificaciones, setPromedioCalificaciones] = useState([]);
  const [contenidosFecha, setContenidosFecha] = useState([]);

  const [filtros, setFiltros] = useState({
    minReproducciones: 5,
    tipoUsuario: "todos",
    fechaDesde: "",
    fechaHasta: "",
    usuarioId: "",
    contenidoId: "",
    fechaEspecifica: ""
  });

  const [usuarios, setUsuarios] = useState([]);
  const [contenidos, setContenidos] = useState([]);

  const cargarDatosBasicos = async () => {
    try {
      const [usuariosData, contenidosData] = await Promise.all([
        tomarUsuarios(),
        tomarContenidos()
      ]);
      setUsuarios(usuariosData);
      setContenidos(contenidosData);
    } catch (error) {
      console.error("Error al cargar datos básicos:", error);
    }
  };

  useEffect(() => {
    cargarDatosBasicos();
  }, []);

  const manejarCambioFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buscarContenidosPopulares = async () => {
    try {
      const data = await obtenerReportes(`contenidos-populares?min=${filtros.minReproducciones}`);
      setContenidosPopulares(data);
    } catch (error) {
      console.error("Error al obtener contenidos populares:", error);
      setContenidosPopulares([]);
    }
  };

  const buscarUsuarios = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.tipoUsuario !== "todos") params.append("tipo", filtros.tipoUsuario);
      if (filtros.fechaDesde) params.append("fechaDesde", filtros.fechaDesde);
      if (filtros.fechaHasta) params.append("fechaHasta", filtros.fechaHasta);

      const data = await obtenerReportes(`usuarios?${params.toString()}`);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsuariosFiltrados([]);
    }
  };

  const buscarReproduccionesUsuario = async () => {
    if (!filtros.usuarioId) {
      alert("Seleccione un usuario");
      return;
    }
    try {
      const data = await obtenerReportes(`reproducciones-usuario/${filtros.usuarioId}`);
      setReproduccionesUsuario(data);
    } catch (error) {
      console.error("Error al obtener reproducciones del usuario:", error);
      setReproduccionesUsuario([]);
    }
  };

  const buscarPromedioCalificaciones = async () => {
    if (!filtros.contenidoId) {
      alert("Seleccione un contenido");
      return;
    }
    try {
      const data = await obtenerReportes(`promedio-calificaciones/${filtros.contenidoId}`);
      setPromedioCalificaciones(data);
    } catch (error) {
      console.error("Error al obtener promedio de calificaciones:", error);
      setPromedioCalificaciones([]);
    }
  };

  const buscarContenidosFecha = async () => {
    if (!filtros.fechaEspecifica) {
      alert("Seleccione una fecha");
      return;
    }
    try {
      const data = await obtenerReportes(`contenidos-fecha?fecha=${filtros.fechaEspecifica}`);
      setContenidosFecha(data);
    } catch (error) {
      console.error("Error al obtener contenidos por fecha:", error);
      setContenidosFecha([]);
    }
  };

  const obtenerNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find(u => u.id == usuarioId);
    return usuario ? usuario.nombre : "Usuario desconocido";
  };

  const obtenerTituloContenido = (contenidoId) => {
    const contenido = contenidos.find(c => c.id == contenidoId);
    return contenido ? contenido.titulo : "Contenido desconocido";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reportes y Estadísticas</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contenidos Populares */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Contenidos Populares</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                name="minReproducciones"
                value={filtros.minReproducciones}
                onChange={manejarCambioFiltro}
                placeholder="Mín. reproducciones"
                className="px-3 py-2 border border-gray-300 rounded-md"
                min="1"
              />
              <button
                onClick={buscarContenidosPopulares}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Buscar
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {contenidosPopulares.length > 0 ? (
                <ul className="space-y-2">
                  {contenidosPopulares.map((contenido, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">{contenido.titulo}</span>
                      <span className="text-gray-600 ml-2">
                        ({contenido.reproducciones} reproducciones)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Filtro de Usuarios */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Usuarios por Tipo y Fecha</h2>
            <div className="space-y-4 mb-4">
              <select
                name="tipoUsuario"
                value={filtros.tipoUsuario}
                onChange={manejarCambioFiltro}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="todos">Todos los usuarios</option>
                <option value="estandar">Solo Estándar</option>
                <option value="premium">Solo Premium</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="fechaDesde"
                  value={filtros.fechaDesde}
                  onChange={manejarCambioFiltro}
                  placeholder="Desde"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  name="fechaHasta"
                  value={filtros.fechaHasta}
                  onChange={manejarCambioFiltro}
                  placeholder="Hasta"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                onClick={buscarUsuarios}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Buscar Usuarios
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {usuariosFiltrados.length > 0 ? (
                <ul className="space-y-2">
                  {usuariosFiltrados.map((usuario, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">{usuario.nombre}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        usuario.tipoUsuario === 'premium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {usuario.tipoUsuario}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Reproducciones por Usuario */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reproducciones por Usuario</h2>
            <div className="flex gap-4 mb-4">
              <select
                name="usuarioId"
                value={filtros.usuarioId}
                onChange={manejarCambioFiltro}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
              <button
                onClick={buscarReproduccionesUsuario}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
              >
                Ver
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {reproduccionesUsuario.length > 0 ? (
                <ul className="space-y-2">
                  {reproduccionesUsuario.map((reproduccion, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium">{obtenerTituloContenido(reproduccion.contenidoId)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(reproduccion.fechaHora).toLocaleString()} -
                        Calificación: {reproduccion.calificacion}/5
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>

          {/* Promedio de Calificaciones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Promedio de Calificaciones</h2>
            <div className="flex gap-4 mb-4">
              <select
                name="contenidoId"
                value={filtros.contenidoId}
                onChange={manejarCambioFiltro}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar contenido</option>
                {contenidos.map((contenido) => (
                  <option key={contenido.id} value={contenido.id}>
                    {contenido.titulo}
                  </option>
                ))}
              </select>
              <button
                onClick={buscarPromedioCalificaciones}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
              >
                Calcular
              </button>
            </div>
            {promedioCalificaciones && promedioCalificaciones.promedio && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-semibold">
                  Promedio: {parseFloat(promedioCalificaciones.promedio).toFixed(2)}/5
                </div>
                <div className="text-sm text-gray-600">
                  Basado en {promedioCalificaciones.totalCalificaciones} calificaciones
                </div>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(promedioCalificaciones.promedio) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contenidos por Fecha */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Contenidos Reproducidos en Fecha Específica</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="date"
                name="fechaEspecifica"
                value={filtros.fechaEspecifica}
                onChange={manejarCambioFiltro}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={buscarContenidosFecha}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Buscar
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {contenidosFecha.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contenidosFecha.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{obtenerTituloContenido(item.contenidoId)}</div>
                      <div className="text-sm text-gray-600">
                        Usuario: {obtenerNombreUsuario(item.usuarioId)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Hora: {new Date(item.fechaHora).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}