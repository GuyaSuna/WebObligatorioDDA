"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { tomarPokemones } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPokemones: 0,
    pokemonesLegendarios: 0,
    pokemonesRaros: 0,
    pokemonesComunes: 0,
  });

  const cargarEstadisticas = async () => {
    try {
      const pokemones = await tomarPokemones();

      const pokemonesLegendarios = pokemones.filter(
        (p) => p.rareza === "legendario"
      ).length;
      const pokemonesRaros = pokemones.filter(
        (p) => p.rareza === "raro"
      ).length;
      const pokemonesComunes = pokemones.filter(
        (p) => p.rareza === "común"
      ).length;

      setStats({
        totalPokemones: pokemones.length,
        pokemonesLegendarios,
        pokemonesRaros,
        pokemonesComunes,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const menuItems = [
    {
      title: "Pokédex",
      description: "Explorar y gestionar todos los Pokémon capturados",
      href: "/Usuarios",
      icon: "📱",
      color: "bg-blue-500",
    },
    {
      title: "Centro Pokémon",
      description: "Cuidado y gestión de tus Pokémon",
      href: "/Contenidos",
      icon: "🏥",
      color: "bg-green-500",
    },
    {
      title: "Arena de Batalla",
      description: "Registros de combates y entrenamientos",
      href: "/Reproducciones",
      icon: "⚔️",
      color: "bg-purple-500",
    },
    {
      title: "Estadísticas de Entrenador",
      description: "Analiza tu progreso como entrenador",
      href: "/Reportes",
      icon: "📊",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Dashboard de Entrenador Pokémon
          </h1>
          <p className="text-xl text-gray-600">
            Centro de Control para tu Aventura Pokémon
          </p>
        </div>

        {/* Menú de Navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`${item.color} p-4 rounded-lg mr-4`}>
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Acceder</span>
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
