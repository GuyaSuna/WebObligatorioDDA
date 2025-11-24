'use client';

import { useEffect, useState } from 'react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
        setLoading(false);
      });
  }, []);

  const toggleUsuario = async (id, activo) => {
    try {
      await fetch(`/api/usuarios/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo })
      });
      setUsuarios(usuarios.map(u =>
        u.id === id ? { ...u, activo: !activo } : u
      ));
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideFiltro = usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                          usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
                          usuario.numeroUsuario.toLowerCase().includes(filtro.toLowerCase());
    const coincideTipo = tipoFiltro === 'TODOS' || usuario.tipo === tipoFiltro;
    return coincideFiltro && coincideTipo;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <a href="/usuarios/nuevo" className="btn btn-primary">
          👤 Registrar Usuario
        </a>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar usuario</label>
            <input
              type="text"
              placeholder="Nombre, email o número..."
              className="input"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filtrar por tipo</label>
            <select
              className="select"
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="ESTUDIANTE">Estudiantes</option>
              <option value="PROFESOR">Profesores</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Lista de Usuarios ({usuariosFiltrados.length})
        </h2>

        {usuariosFiltrados.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No se encontraron usuarios con los filtros aplicados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">N° Usuario</th>
                  <th className="text-left py-2 px-4">Nombre</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Tipo</th>
                  <th className="text-left py-2 px-4">Préstamos</th>
                  <th className="text-left py-2 px-4">Límite</th>
                  <th className="text-left py-2 px-4">Registro</th>
                  <th className="text-left py-2 px-4">Estado</th>
                  <th className="text-left py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-mono text-sm">{usuario.numeroUsuario}</td>
                    <td className="py-2 px-4 font-medium">{usuario.nombre}</td>
                    <td className="py-2 px-4">{usuario.email}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.tipo === 'PROFESOR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.tipo === 'PROFESOR' ? '👨‍🏫 Profesor' : '🎓 Estudiante'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.prestamosActivos > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.prestamosActivos}
                      </span>
                    </td>
                    <td className="py-2 px-4">{usuario.limiteLibros}</td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <a
                          href={`/usuarios/${usuario.id}/editar`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️ Editar
                        </a>
                        <button
                          onClick={() => toggleUsuario(usuario.id, usuario.activo)}
                          className={`text-sm ${
                            usuario.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {usuario.activo ? '🚫 Desactivar' : '✅ Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}