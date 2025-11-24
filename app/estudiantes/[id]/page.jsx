'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obtenerEstudiante } from '../../api';

export default function EstudianteDetalle() {
  const params = useParams();
  const id = params?.id;
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('ID no proporcionado');
      setLoading(false);
      return;
    }
    obtenerEstudiante(id)
      .then(data => setEstudiante(data))
      .catch(err => setError(err.message || 'Error al cargar estudiante'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detalle de estudiante</h1>
        <a href="/estudiantes" className="btn btn-secondary">Volver</a>
      </div>

      {loading && <div className="card">Cargando...</div>}
      {error && <div className="card text-red-600">{error}</div>}

      {!loading && !error && estudiante && (
        <div className="card space-y-2">
          <div>
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-semibold">{estudiante.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-semibold">{estudiante.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{estudiante.email || 'Sin email'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Carrera</p>
            <p className="font-semibold">{estudiante.carrera || 'Sin carrera'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Datos completos</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(estudiante, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
