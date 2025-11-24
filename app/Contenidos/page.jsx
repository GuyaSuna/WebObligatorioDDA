"use client";
import { tomarPokemones } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function CentroPokemon() {
  const [pokemones, setPokemones] = useState([]);

  const cargarPokemones = async () => {
    try {
      const data = await tomarPokemones();
      setPokemones(data);
    } catch (error) {
      console.error("Error al cargar pokemones:", error);
    }
  };

  useEffect(() => {
    cargarPokemones();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {" "}
              Centro Pokémon
            </h1>
            <p className="text-xl text-gray-600">
              Cuidado profesional y gestión de la salud de tus Pokémon
            </p>
          </div>

          {/* Lista de Pokémon en el Centro */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">
              Pacientes en el Centro Pokémon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {pokemones.map((pokemon) => {
                const estadoSalud =
                  pokemon.estadisticas.hp > 70
                    ? "saludable"
                    : pokemon.estadisticas.hp > 40
                    ? "cuidado"
                    : "critico";
                const colorEstado =
                  estadoSalud === "saludable"
                    ? "bg-green-100 text-green-800"
                    : estadoSalud === "cuidado"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800";

                return (
                  <div
                    key={pokemon.id}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                  >
                    <div className="text-center mb-4">
                      <img
                        className="h-20 w-20 mx-auto mb-3"
                        src={pokemon.sprite}
                        alt={pokemon.nombre}
                      />
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {pokemon.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        #{pokemon.numero.toString().padStart(3, "0")} • Nivel{" "}
                        {pokemon.nivel}
                      </p>
                    </div>

                    {/* Barras de Estadísticas */}
                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>HP</span>
                          <span>{pokemon.estadisticas.hp}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              pokemon.estadisticas.hp > 70
                                ? "bg-green-500"
                                : pokemon.estadisticas.hp > 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                pokemon.estadisticas.hp,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Ataque</span>
                          <span>{pokemon.estadisticas.ataque}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full bg-red-400"
                            style={{
                              width: `${Math.min(
                                pokemon.estadisticas.ataque / 1.5,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Defensa</span>
                          <span>{pokemon.estadisticas.defensa}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full bg-blue-400"
                            style={{
                              width: `${Math.min(
                                pokemon.estadisticas.defensa / 1.5,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Estado de Salud */}
                    <div className="text-center">
                      <span
                        className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${colorEstado}`}
                      >
                        {estadoSalud === "saludable"
                          ? "💚 Saludable"
                          : estadoSalud === "cuidado"
                          ? "🟡 Necesita Cuidado"
                          : "🔴 Estado Crítico"}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        {pokemon.entrenador}
                      </p>
                      <p className="text-xs text-gray-500">{pokemon.region}</p>
                    </div>

                    {/* Tipos */}
                    <div className="flex flex-wrap gap-1 justify-center mt-3">
                      {pokemon.tipos.slice(0, 2).map((tipo) => (
                        <span
                          key={tipo}
                          className="px-2 py-1 text-xs text-white rounded-full bg-gray-500"
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {pokemones.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Cargando pacientes del Centro Pokémon...
                </p>
              </div>
            )}
          </div>

          {/* Servicios del Centro Pokémon */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🩺</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cuidados Médicos
                </h3>
                <p className="text-gray-600 text-sm">
                  Atención médica profesional para mantener a tus Pokémon en
                  perfecto estado de salud
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏃‍♀️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Entrenamiento
                </h3>
                <p className="text-gray-600 text-sm">
                  Programas de entrenamiento personalizados para mejorar las
                  estadísticas de tus Pokémon
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Medicina Pokémon
                </h3>
                <p className="text-gray-600 text-sm">
                  Medicamentos y pociones especializadas para la recuperación
                  rápida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
