'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevoPrestamoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [busquedaLibro, setBusquedaLibro] = useState('');

  useEffect(() => {
    // Cargar usuarios activos
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data.filter(u => u.activo)))
      .catch(error => console.error('Error al cargar usuarios:', error));

    // Cargar libros disponibles
    fetch('/api/libros')
      .then(res => res.json())
      .then(data => setLibros(data.filter(l => l.disponible)))
      .catch(error => console.error('Error al cargar libros:', error));
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    usuario.numeroUsuario.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  const librosFiltrados = libros.filter(libro =>
    libro.titulo.toLowerCase().includes(busquedaLibro.toLowerCase()) ||
    libro.codigo.toLowerCase().includes(busquedaLibro.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busquedaLibro.toLowerCase())
  );

  const puedePrestar = (usuario) => {
    return usuario.prestamosActivos < usuario.limiteLibros;
  };

  const calcularFechaDevolucion = (tipo) => {
    const fecha = new Date();
    const dias = tipo === 'PROFESOR' ? 30 : 15;
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioSeleccionado || !libroSeleccionado) {
      alert('Debe seleccionar un usuario y un libro');
      return;
    }

    if (!puedePrestar(usuarioSeleccionado)) {
      alert(`El usuario ha alcanzado el límite de ${usuarioSeleccionado.limiteLibros} libros`);
      return;
    }

    setLoading(true);

    try {
      const prestamoData = {
        usuarioId: usuarioSeleccionado.id,
        libroId: libroSeleccionado.id,
        fechaDevolucion: calcularFechaDevolucion(usuarioSeleccionado.tipo)
      };

      const response = await fetch('/api/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestamoData),
      });

      if (response.ok) {
        alert('Préstamo registrado exitosamente');
        router.push('/prestamos');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo registrar el préstamo'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar el préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary mr-4"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold">Registrar Nuevo Préstamo</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Usuario */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">1. Seleccionar Usuario</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Buscar usuario
              </label>
              <input
                type="text"
                className="input"
                placeholder="Nombre, número de usuario o email..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
              />
            </div>

            {usuarioSeleccionado ? (
              <div className="p-4 bg-blue-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-blue-900">{usuarioSeleccionado.nombre}</h3>
                    <p className="text-blue-700 text-sm">
                      {usuarioSeleccionado.numeroUsuario} ({usuarioSeleccionado.tipo})
                    </p>
                    <p className="text-blue-600 text-sm">
                      Préstamos activos: {usuarioSeleccionado.prestamosActivos}/{usuarioSeleccionado.limiteLibros}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUsuarioSeleccionado(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕ Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {usuariosFiltrados.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No se encontraron usuarios
                  </p>
                ) : (
                  <div className="space-y-2">
                    {usuariosFiltrados.map((usuario) => (
                      <div
                        key={usuario.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          !puedePrestar(usuario) ? 'opacity-50' : ''
                        }`}
                        onClick={() => puedePrestar(usuario) && setUsuarioSeleccionado(usuario)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{usuario.nombre}</h3>
                            <p className="text-sm text-gray-600">
                              {usuario.numeroUsuario} ({usuario.tipo})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              puedePrestar(usuario) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {usuario.prestamosActivos}/{usuario.limiteLibros}
                            </span>
                          </div>
                        </div>
                        {!puedePrestar(usuario) && (
                          <p className="text-xs text-red-600 mt-1">
                            ⚠️ Límite de préstamos alcanzado
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selección de Libro */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">2. Seleccionar Libro</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Buscar libro
              </label>
              <input
                type="text"
                className="input"
                placeholder="Título, código o autor..."
                value={busquedaLibro}
                onChange={(e) => setBusquedaLibro(e.target.value)}
              />
            </div>

            {libroSeleccionado ? (
              <div className="p-4 bg-green-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-green-900">{libroSeleccionado.titulo}</h3>
                    <p className="text-green-700 text-sm">
                      {libroSeleccionado.codigo} - {libroSeleccionado.autor}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                      libroSeleccionado.tipo === 'DIGITAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {libroSeleccionado.tipo === 'DIGITAL' ? '💾 Digital' : '📚 Físico'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLibroSeleccionado(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕ Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {librosFiltrados.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No se encontraron libros disponibles
                  </p>
                ) : (
                  <div className="space-y-2">
                    {librosFiltrados.map((libro) => (
                      <div
                        key={libro.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setLibroSeleccionado(libro)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{libro.titulo}</h3>
                            <p className="text-sm text-gray-600">
                              {libro.codigo} - {libro.autor}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            libro.tipo === 'DIGITAL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {libro.tipo === 'DIGITAL' ? '💾 Digital' : '📚 Físico'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resumen del Préstamo */}
          {usuarioSeleccionado && libroSeleccionado && (
            <div className="card bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">3. Resumen del Préstamo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">📅 Fechas</h3>
                  <p className="text-sm">
                    <strong>Préstamo:</strong> {new Date().toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-sm">
                    <strong>Devolución:</strong> {new Date(calcularFechaDevolucion(usuarioSeleccionado.tipo)).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Duración: {usuarioSeleccionado.tipo === 'PROFESOR' ? '30' : '15'} días
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">📋 Condiciones</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Máximo 2 renovaciones permitidas</li>
                    <li>• Multa por retraso: $10 por día</li>
                    <li>• Notificación 3 días antes del vencimiento</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/prestamos')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !usuarioSeleccionado || !libroSeleccionado}
              className="btn btn-primary"
            >
              {loading ? 'Registrando...' : 'Registrar Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}