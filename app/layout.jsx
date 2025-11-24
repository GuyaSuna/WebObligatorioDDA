import "./globals.css";

export const metadata = {
  title: "Gestor de Estudiantes",
  description: "Listado, alta y detalle de estudiantes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Gestor de Estudiantes</h1>
            <div className="space-x-4">
              <a href="/" className="hover:underline">Inicio</a>
              <a href="/estudiantes" className="hover:underline">Estudiantes</a>
              <a href="/estudiantes/nuevo" className="hover:underline">Nuevo</a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
