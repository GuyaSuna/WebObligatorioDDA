'use client';

import { useEffect, useState } from 'react';
import { obtenerEstudiantes } from '../api';

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstudiantes()
      .then(data => setEstudiantes(data || []))
      .catch(err => setError(err.message || 'Error al cargar estudiantes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Estudiantes</h1>
          <p className="text-gray-600">Listado simple de estudiantes.</p>
        </div>
        <a href="/estudiantes/nuevo" className="btn btn-primary">Nuevo estudiante</a>
      </div>

      {loading && <div className="card">Cargando estudiantes...</div>}
      {error && <div className="card text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="card">
          {estudiantes.length === 0 ? (
            <p className="text-gray-600">Aun no hay estudiantes cargados.</p>
          ) : (
            <div className="divide-y">
              {estudiantes.map((estudiante) => (
                <a
                  key={estudiante.id}
                  href={`/estudiantes/${estudiante.id}`}
                  className="flex justify-between items-center py-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold">{estudiante.nombre}</p>
                    <p className="text-sm text-gray-600">{estudiante.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {estudiante.carrera || 'Sin carrera'}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
