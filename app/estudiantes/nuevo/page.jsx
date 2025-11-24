'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearEstudiante } from '../../api';

export default function NuevoEstudiantePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    carrera: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await crearEstudiante(formData);
      router.push('/estudiantes');
    } catch (err) {
      setError(err.message || 'No se pudo crear el estudiante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nuevo Estudiante</h1>
        <a href="/estudiantes" className="btn btn-secondary">Volver</a>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            className="input w-full"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="input w-full"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Carrera</label>
          <input
            className="input w-full"
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            placeholder="Carrera o programa"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/estudiantes')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
