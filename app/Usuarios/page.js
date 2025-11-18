"use client";
import { tomarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    fechaRegistro: "",
    tipoUsuario: "estandar",
    fechaInicioPremium: ""
  });

  const cargarUsuarios = async () => {
    try {
      const data = await tomarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
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
      if (usuarioEnEdicion) {
        await actualizarUsuario(usuarioEnEdicion.id, formulario);
      } else {
        await crearUsuario({
          ...formulario,
          fechaRegistro: formulario.fechaRegistro || new Date().toISOString().split('T')[0]
        });
      }
      await cargarUsuarios();
      resetearFormulario();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const manejarEditar = (usuario) => {
    setUsuarioEnEdicion(usuario);
    setFormulario({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      fechaRegistro: usuario.fechaRegistro || "",
      tipoUsuario: usuario.tipoUsuario || "estandar",
      fechaInicioPremium: usuario.fechaInicioPremium || ""
    });
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await eliminarUsuario(id);
        await cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  const resetearFormulario = () => {
    setFormulario({
      nombre: "",
      email: "",
      fechaRegistro: "",
      tipoUsuario: "estandar",
      fechaInicioPremium: ""
    });
    setUsuarioEnEdicion(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {mostrarFormulario ? "Cancelar" : "Nuevo Usuario"}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {usuarioEnEdicion ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={manejarSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha de Registro
                </label>
                <input
                  type="date"
                  name="fechaRegistro"
                  value={formulario.fechaRegistro}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tipo de Usuario
                </label>
                <select
                  name="tipoUsuario"
                  value={formulario.tipoUsuario}
                  onChange={manejarCambioFormulario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="estandar">Estándar</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              {formulario.tipoUsuario === "premium" && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Fecha de Inicio Premium
                  </label>
                  <input
                    type="date"
                    name="fechaInicioPremium"
                    value={formulario.fechaInicioPremium}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {usuarioEnEdicion ? "Actualizar" : "Crear"} Usuario
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
          <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Lista de Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        usuario.tipoUsuario === 'premium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {usuario.tipoUsuario === 'premium' ? 'Premium' : 'Estándar'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {usuario.fechaRegistro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => manejarEditar(usuario)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(usuario.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuarios.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay usuarios registrados</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
