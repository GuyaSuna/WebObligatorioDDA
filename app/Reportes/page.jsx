'use client';

import { useEffect, useState } from 'react';

export default function ReportesPage() {
  const [reportes, setReportes] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    tipoUsuario: 'TODOS',
    tipoLibro: 'TODOS'
  });

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const response = await fetch('/api/reportes');
      const data = await response.json();
      setReportes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setLoading(false);
    }
  };

  const generarReporte = async (tipo) => {
    try {
      const params = new URLSearchParams({
        tipo,
        ...filtros
      });

      const response = await fetch(`/api/reportes?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReportes(prev => ({
          ...prev,
          [tipo]: data
        }));
      } else {
        alert(`Error al generar reporte: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      alert('Error al generar el reporte');
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando reportes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Reportes y Estadísticas</h1>

      {/* Filtros */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros de Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha inicio</label>
            <input
              type="date"
              name="fechaInicio"
              className="input"
              value={filtros.fechaInicio}
              onChange={handleFiltroChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha fin</label>
            <input
              type="date"
              name="fechaFin"
              className="input"
              value={filtros.fechaFin}
              onChange={handleFiltroChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de usuario</label>
            <select
              name="tipoUsuario"
              className="select"
              value={filtros.tipoUsuario}
              onChange={handleFiltroChange}
            >
              <option value="TODOS">Todos</option>
              <option value="ESTUDIANTE">Estudiantes</option>
              <option value="PROFESOR">Profesores</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de libro</label>
            <select
              name="tipoLibro"
              className="select"
              value={filtros.tipoLibro}
              onChange={handleFiltroChange}
            >
              <option value="TODOS">Todos</option>
              <option value="FISICO">Físicos</option>
              <option value="DIGITAL">Digitales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reportes de Préstamos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Libros Más Prestados</h2>
            <button
              onClick={() => generarReporte('librosMasPrestados')}
              className="btn btn-primary btn-sm"
            >
              📊 Generar
            </button>
          </div>

          {reportes.librosMasPrestados ? (
            <div className="space-y-3">
              {reportes.librosMasPrestados.slice(0, 5).map((libro, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">{libro.titulo}</h3>
                    <p className="text-sm text-gray-600">{libro.autor}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {libro.cantidadPrestamos} préstamos
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Haz clic en "Generar" para ver el reporte</p>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Usuarios Más Activos</h2>
            <button
              onClick={() => generarReporte('usuariosMasActivos')}
              className="btn btn-primary btn-sm"
            >
              📊 Generar
            </button>
          </div>

          {reportes.usuariosMasActivos ? (
            <div className="space-y-3">
              {reportes.usuariosMasActivos.slice(0, 5).map((usuario, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      {usuario.numeroUsuario} ({usuario.tipo})
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {usuario.totalPrestamos} préstamos
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Haz clic en "Generar" para ver el reporte</p>
          )}
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Préstamos Activos</h3>
          <p className="text-3xl font-bold text-blue-600">{reportes.estadisticas?.prestamosActivos || 0}</p>
          <p className="text-sm text-gray-600">En este momento</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Préstamos Vencidos</h3>
          <p className="text-3xl font-bold text-red-600">{reportes.estadisticas?.prestamosVencidos || 0}</p>
          <p className="text-sm text-gray-600">Requieren atención</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold mb-2">Total del Mes</h3>
          <p className="text-3xl font-bold text-green-600">{reportes.estadisticas?.prestamosMes || 0}</p>
          <p className="text-sm text-gray-600">Préstamos este mes</p>
        </div>
      </div>

      {/* Reporte de Préstamos por Fecha */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Préstamos por Fecha</h2>
          <button
            onClick={() => generarReporte('prestamosPorFecha')}
            className="btn btn-primary"
          >
            📊 Generar Reporte Detallado
          </button>
        </div>

        {reportes.prestamosPorFecha ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Fecha</th>
                  <th className="text-left py-2 px-4">Usuario</th>
                  <th className="text-left py-2 px-4">Libro</th>
                  <th className="text-left py-2 px-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reportes.prestamosPorFecha.map((prestamo, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{prestamo.fecha}</td>
                    <td className="py-2 px-4">{prestamo.usuario}</td>
                    <td className="py-2 px-4">{prestamo.libro}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prestamo.estado === 'ACTIVO' ? 'bg-blue-100 text-blue-800' :
                        prestamo.estado === 'DEVUELTO' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prestamo.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Selecciona un rango de fechas y haz clic en "Generar" para ver los préstamos</p>
        )}
      </div>
    </div>
  );
}