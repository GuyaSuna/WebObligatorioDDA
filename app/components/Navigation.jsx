import Link from "next/link";

export default function Navigation() {

  const navItems = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/Usuarios", label: "Entrenadores", icon: "👥" },
    { href: "/Contenidos", label: "Pokémon", icon: "⚡" },
    { href: "/Reproducciones", label: "Batallas", icon: "⚔️" },
    { href: "/Reportes", label: "Reportes", icon: "📊" }
  ];

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            PokéCenter
          </Link>
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}