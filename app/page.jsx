"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { tomarUsuarios, tomarContenidos, tomarReproducciones } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalContenidos: 0,
    totalReproducciones: 0,
    usuariosPremium: 0
  });

  const cargarEstadisticas = async () => {
    try {
      const [usuarios, contenidos, reproducciones] = await Promise.all([
        tomarUsuarios(),
        tomarContenidos(),
        tomarReproducciones()
      ]);

      const usuariosPremium = usuarios.filter(u => u.tipoUsuario === 'premium').length;

      setStats({
        totalUsuarios: usuarios.length,
        totalContenidos: contenidos.length,
        totalReproducciones: reproducciones.length,
        usuariosPremium
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
      title: "Gestión de Entrenadores",
      description: "Administrar entrenadores estándar y premium",
      href: "/Usuarios",
      icon: "👥",
      color: "bg-blue-500"
    },
    {
      title: "Gestión de Pokémon",
      description: "Administrar Pokémon disponibles",
      href: "/Contenidos",
      icon: "⚡",
      color: "bg-green-500"
    },
    {
      title: "Registro de Batallas",
      description: "Registrar y ver batallas Pokémon",
      href: "/Reproducciones",
      icon: "⚔️",
      color: "bg-purple-500"
    },
    {
      title: "Reportes y Estadísticas",
      description: "Ver reportes y análisis de datos",
      href: "/Reportes",
      icon: "📊",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            PokéCenter Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Gestión de Entrenadores y Pokémon
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Entrenadores</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsuarios}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Entrenadores Premium</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.usuariosPremium}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Pokémon</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalContenidos}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Batallas</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalReproducciones}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">⚔️</span>
              </div>
            </div>
          </div>
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
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  <span>Acceder</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Información del Sistema */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Gestión de Entrenadores</h3>
              <p className="text-gray-600 text-sm">
                Administre entrenadores estándar y premium con diferentes niveles de acceso
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Pokédex Digital</h3>
              <p className="text-gray-600 text-sm">
                Gestione Pokémon con tipos, rareza y acceso exclusivo para entrenadores premium
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-700 mb-2">Analytics y Reportes</h3>
              <p className="text-gray-600 text-sm">
                Obtenga insights detallados sobre batallas y preferencias de los entrenadores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
