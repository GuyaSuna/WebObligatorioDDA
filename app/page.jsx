'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setEstadisticas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar estadísticas:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard - Biblioteca Digital</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-blue-600">{estadisticas?.totalLibros || 0}</h2>
          <p className="text-gray-600">Total de Libros</p>
        </div>

        <div className="card text-center">
          <h2 className="text-2xl font-bold text-green-600">{estadisticas?.totalUsuarios || 0}</h2>
          <p className="text-gray-600">Total de Usuarios</p>
        </div>

        <div className="card text-center">
          <h2 className="text-2xl font-bold text-orange-600">{estadisticas?.prestamosActivos || 0}</h2>
          <p className="text-gray-600">Préstamos Activos</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Libros Más Prestados</h2>
        {estadisticas?.librosMasPrestados && estadisticas.librosMasPrestados.length > 0 ? (
          <div className="space-y-3">
            {estadisticas.librosMasPrestados.map((libro, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h3 className="font-medium">{libro.titulo}</h3>
                  <p className="text-sm text-gray-600">por {libro.autor}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {libro.cantidadPrestamos} préstamos
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay datos de préstamos disponibles</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <a href="/libros/nuevo" className="btn btn-primary w-full block text-center">
              ➕ Agregar Nuevo Libro
            </a>
            <a href="/usuarios/nuevo" className="btn btn-secondary w-full block text-center">
              👤 Registrar Usuario
            </a>
            <a href="/prestamos/nuevo" className="btn btn-secondary w-full block text-center">
              📖 Nuevo Préstamo
            </a>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Sistema de Biblioteca</h2>
          <p className="text-gray-600 mb-4">
            Bienvenido al sistema de gestión de biblioteca digital. Aquí puedes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Gestionar libros físicos y digitales</li>
            <li>Administrar usuarios (estudiantes y profesores)</li>
            <li>Controlar préstamos y devoluciones</li>
            <li>Generar reportes y estadísticas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}