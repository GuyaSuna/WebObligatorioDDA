'use client';

import { useEffect, useState } from 'react';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

  useEffect(() => {
    fetch('/api/prestamos')
      .then(res => res.json())
      .then(data => {
        setPrestamos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar préstamos:', error);
        setLoading(false);
      });
  }, []);

  const marcarDevuelto = async (id) => {
    try {
      await fetch(`/api/prestamos/${id}/devolver`, { method: 'PUT' });
      setPrestamos(prestamos.map(p =>
        p.id === id ? {
          ...p,
          estado: 'DEVUELTO',
          fechaDevolucionReal: new Date().toISOString().split('T')[0]
        } : p
      ));
    } catch (error) {
      console.error('Error al marcar devolución:', error);
      alert('Error al procesar la devolución');
    }
  };

  const renovarPrestamo = async (id) => {
    try {
      const response = await fetch(`/api/prestamos/${id}/renovar`, { method: 'PUT' });
      if (response.ok) {
        const prestamoActualizado = await response.json();
        setPrestamos(prestamos.map(p =>
          p.id === id ? prestamoActualizado : p
        ));
        alert('Préstamo renovado exitosamente');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error al renovar préstamo:', error);
      alert('Error al renovar el préstamo');
    }
  };

  const diasRestantes = (fechaDevolucion) => {
    const hoy = new Date();
    const fechaLimite = new Date(fechaDevolucion);
    const diferencia = Math.ceil((fechaLimite.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferencia;
  };

  const prestamosFiltrados = prestamos.filter(prestamo => {
    const coincideFiltro = prestamo.usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                          prestamo.usuario.numeroUsuario.toLowerCase().includes(filtro.toLowerCase()) ||
                          prestamo.libro.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
                          prestamo.libro.codigo.toLowerCase().includes(filtro.toLowerCase());
    const coincideEstado = estadoFiltro === 'TODOS' || prestamo.estado === estadoFiltro;
    return coincideFiltro && coincideEstado;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando préstamos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Préstamos</h1>
        <a href="/prestamos/nuevo" className="btn btn-primary">
          📖 Nuevo Préstamo
        </a>
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar préstamo</label>
            <input
              type="text"
              placeholder="Usuario, libro o código..."
              className="input"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filtrar por estado</label>
            <select
              className="select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="VENCIDO">Vencidos</option>
              <option value="DEVUELTO">Devueltos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Lista de Préstamos ({prestamosFiltrados.length})
        </h2>

        {prestamosFiltrados.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No se encontraron préstamos con los filtros aplicados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Usuario</th>
                  <th className="text-left py-2 px-4">Libro</th>
                  <th className="text-left py-2 px-4">Prestado</th>
                  <th className="text-left py-2 px-4">Vencimiento</th>
                  <th className="text-left py-2 px-4">Estado</th>
                  <th className="text-left py-2 px-4">Renovaciones</th>
                  <th className="text-left py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {prestamosFiltrados.map((prestamo) => (
                  <tr key={prestamo.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <div>
                        <div className="font-medium">{prestamo.usuario.nombre}</div>
                        <div className="text-sm text-gray-600">
                          {prestamo.usuario.numeroUsuario} ({prestamo.usuario.tipo})
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div>
                        <div className="font-medium">{prestamo.libro.titulo}</div>
                        <div className="text-sm text-gray-600">
                          {prestamo.libro.codigo} - {prestamo.libro.autor}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(prestamo.fechaDevolucion).toLocaleDateString('es-ES')}
                      {prestamo.estado === 'ACTIVO' && (
                        <div className={`text-xs ${
                          diasRestantes(prestamo.fechaDevolucion) < 0 ? 'text-red-600' :
                          diasRestantes(prestamo.fechaDevolucion) <= 3 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {diasRestantes(prestamo.fechaDevolucion) < 0
                            ? `Vencido hace ${Math.abs(diasRestantes(prestamo.fechaDevolucion))} días`
                            : `${diasRestantes(prestamo.fechaDevolucion)} días restantes`
                          }
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prestamo.estado === 'ACTIVO' ? 'bg-blue-100 text-blue-800' :
                        prestamo.estado === 'DEVUELTO' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prestamo.estado === 'ACTIVO' ? '🔄 Activo' :
                         prestamo.estado === 'DEVUELTO' ? '✅ Devuelto' :
                         '⚠️ Vencido'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {prestamo.renovaciones}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        {prestamo.estado === 'ACTIVO' && (
                          <>
                            <button
                              onClick={() => marcarDevuelto(prestamo.id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              📥 Devolver
                            </button>
                            {prestamo.renovaciones < 2 && (
                              <button
                                onClick={() => renovarPrestamo(prestamo.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                🔄 Renovar
                              </button>
                            )}
                          </>
                        )}
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