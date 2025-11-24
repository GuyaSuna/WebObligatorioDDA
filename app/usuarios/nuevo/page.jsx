'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numeroUsuario: '',
    nombre: '',
    email: '',
    tipo: 'ESTUDIANTE',
    telefono: '',
    direccion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Usuario registrado exitosamente');
        router.push('/usuarios');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo registrar el usuario'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateNumeroUsuario = () => {
    const prefix = formData.tipo === 'PROFESOR' ? 'PROF' : 'EST';
    const numero = Math.random().toString().substr(2, 6);
    setFormData(prev => ({
      ...prev,
      numeroUsuario: `${prefix}${numero}`
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary mr-4"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold">Registrar Nuevo Usuario</h1>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de usuario *
              </label>
              <select
                name="tipo"
                required
                className="select"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="ESTUDIANTE">🎓 Estudiante</option>
                <option value="PROFESOR">👨‍🏫 Profesor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Número de usuario *
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="numeroUsuario"
                  required
                  className="input flex-1"
                  value={formData.numeroUsuario}
                  onChange={handleChange}
                  placeholder="EST123456 o PROF123456"
                />
                <button
                  type="button"
                  onClick={generateNumeroUsuario}
                  className="ml-2 btn btn-secondary"
                >
                  🎲
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Se generará automáticamente según el tipo si está vacío
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="nombre"
                required
                className="input"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Correo electrónico *
              </label>
              <input
                type="email"
                name="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
                placeholder="juan.perez@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="telefono"
                className="input"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="099 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Dirección (opcional)
              </label>
              <input
                type="text"
                name="direccion"
                className="input"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Av. Principal 123"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              Límites de préstamo por tipo de usuario:
            </h3>
            <ul className="text-sm text-blue-800">
              <li>🎓 <strong>Estudiantes:</strong> Máximo 3 libros simultáneos, 15 días de préstamo</li>
              <li>👨‍🏫 <strong>Profesores:</strong> Máximo 5 libros simultáneos, 30 días de préstamo</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/usuarios')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}