import "./globals.css";

export const metadata = {
  title: "Sistema de Biblioteca Digital",
  description: "Gestión de libros y préstamos de biblioteca",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">📚 Biblioteca Digital</h1>
            <div className="space-x-4">
              <a href="/" className="hover:underline">Inicio</a>
              <a href="/libros" className="hover:underline">Libros</a>
              <a href="/usuarios" className="hover:underline">Usuarios</a>
              <a href="/prestamos" className="hover:underline">Préstamos</a>
              <a href="/reportes" className="hover:underline">Reportes</a>
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