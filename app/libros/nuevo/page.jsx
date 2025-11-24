'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoLibroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    autor: '',
    genero: '',
    año: new Date().getFullYear(),
    tipo: 'FISICO',
    ubicacion: '',
    descripcion: ''
  });

  const generos = [
    'Ficción', 'No Ficción', 'Ciencia', 'Historia', 'Biografía',
    'Tecnología', 'Arte', 'Filosofía', 'Literatura', 'Educación',
    'Medicina', 'Derecho', 'Economía', 'Psicología', 'Otros'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/libros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Libro agregado exitosamente');
        router.push('/libros');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo agregar el libro'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar el libro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'año' ? parseInt(value) || 0 : value
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
          <h1 className="text-3xl font-bold">Agregar Nuevo Libro</h1>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Código del libro *
              </label>
              <input
                type="text"
                name="codigo"
                required
                className="input"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="LIB-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de libro *
              </label>
              <select
                name="tipo"
                required
                className="select"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="FISICO">📚 Físico</option>
                <option value="DIGITAL">💾 Digital</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Título del libro *
              </label>
              <input
                type="text"
                name="titulo"
                required
                className="input"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="El título del libro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Autor *
              </label>
              <input
                type="text"
                name="autor"
                required
                className="input"
                value={formData.autor}
                onChange={handleChange}
                placeholder="Nombre del autor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Género *
              </label>
              <select
                name="genero"
                required
                className="select"
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="">Seleccionar género</option>
                {generos.map(genero => (
                  <option key={genero} value={genero}>{genero}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Año de publicación *
              </label>
              <input
                type="number"
                name="año"
                required
                min="1000"
                max={new Date().getFullYear()}
                className="input"
                value={formData.año}
                onChange={handleChange}
              />
            </div>


            {formData.tipo === 'FISICO' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Ubicación física
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  className="input"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Estante A, Sección 3, Nivel 2"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Descripción (opcional)
              </label>
              <textarea
                name="descripcion"
                rows={3}
                className="input"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Breve descripción del contenido del libro"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/libros')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Agregar Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}