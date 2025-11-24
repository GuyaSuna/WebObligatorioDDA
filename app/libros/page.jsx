'use client';

import { useEffect, useState } from 'react';

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  useEffect(() => {
    fetch('/api/libros')
      .then(res => res.json())
      .then(data => {
        setLibros(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar libros:', error);
        setLoading(false);
      });
  }, []);

  const eliminarLibro = async (id) => {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await fetch(`/api/libros/${id}`, { method: 'DELETE' });
        setLibros(libros.filter(libro => libro.id !== id));
      } catch (error) {
        console.error('Error al eliminar libro:', error);
        alert('Error al eliminar el libro');
      }
    }
  };

  const librosFiltrados = libros.filter(libro => {
    const coincideFiltro = libro.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
                          libro.autor.toLowerCase().includes(filtro.toLowerCase()) ||
                          libro.codigo.toLowerCase().includes(filtro.toLowerCase());
    const coincideTipo = tipoFiltro === 'TODOS' || libro.tipo === tipoFiltro;
    return coincideFiltro && coincideTipo;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando libros...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Libros</h1>
        <a href="/libros/nuevo" className="btn btn-primary">
          ➕ Agregar Libro
        </a>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar libro</label>
            <input
              type="text"
              placeholder="Título, autor o código..."
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
              <option value="FISICO">Físico</option>
              <option value="DIGITAL">Digital</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Lista de Libros ({librosFiltrados.length})
        </h2>

        {librosFiltrados.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No se encontraron libros con los filtros aplicados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Código</th>
                  <th className="text-left py-2 px-4">Título</th>
                  <th className="text-left py-2 px-4">Autor</th>
                  <th className="text-left py-2 px-4">Género</th>
                  <th className="text-left py-2 px-4">Año</th>
                  <th className="text-left py-2 px-4">Tipo</th>
                  <th className="text-left py-2 px-4">Estado</th>
                  <th className="text-left py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {librosFiltrados.map((libro) => (
                  <tr key={libro.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-mono text-sm">{libro.codigo}</td>
                    <td className="py-2 px-4 font-medium">{libro.titulo}</td>
                    <td className="py-2 px-4">{libro.autor}</td>
                    <td className="py-2 px-4">{libro.genero}</td>
                    <td className="py-2 px-4">{libro.año}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        libro.tipo === 'DIGITAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {libro.tipo === 'DIGITAL' ? '💾 Digital' : '📚 Físico'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        libro.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {libro.disponible ? '✅ Disponible' : '❌ Prestado'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <a
                          href={`/libros/${libro.id}/editar`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️ Editar
                        </a>
                        <button
                          onClick={() => eliminarLibro(libro.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Eliminar
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