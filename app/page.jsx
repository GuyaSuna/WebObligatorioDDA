'use client';

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Gestor de Estudiantes</h1>
        <p className="text-gray-600"></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/estudiantes" className="card hover:shadow-md transition text-center">
            <h2 className="text-xl font-semibold">Lista</h2>
            <p className="text-sm text-gray-600">Todos los estudiantes cargados</p>
          </a>
          <a href="/estudiantes/nuevo" className="card hover:shadow-md transition text-center">
            <h2 className="text-xl font-semibold">Crear</h2>
            <p className="text-sm text-gray-600">Alta rapida de estudiante</p>
          </a>
          <a href="/estudiantes/1" className="card hover:shadow-md transition text-center">
            <h2 className="text-xl font-semibold">Detalle</h2>
            <p className="text-sm text-gray-600">Ejemplo: estudiante con ID 1</p>
          </a>
        </div>
      </div>
    </div>
  );
}
