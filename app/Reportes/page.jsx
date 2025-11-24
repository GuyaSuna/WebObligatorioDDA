"use client";
import { tomarPokemones } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function EstadisticasEntrenador() {
  const [pokemones, setPokemones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalCapturados: 0,
    nivelPromedio: 0,
    pokemonMasFuerte: null,
    tipoMasComun: "",
    regionMasExplorada: "",
    rareza: {
      legendarios: 0,
      raros: 0,
      comunes: 0,
    },
  });

  const cargarDatos = async () => {
    try {
      const data = await tomarPokemones();
      setPokemones(data);
      calcularEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar pokemones:", error);
    }
  };

  const calcularEstadisticas = (pokemones) => {
    if (pokemones.length === 0) return;

    const totalCapturados = pokemones.length;

    const nivelPromedio = Math.round(
      pokemones.reduce((sum, p) => sum + p.nivel, 0) / pokemones.length
    );

    const pokemonMasFuerte = pokemones.reduce((strongest, current) => {
      const strongestTotal =
        strongest.estadisticas.hp +
        strongest.estadisticas.ataque +
        strongest.estadisticas.defensa +
        strongest.estadisticas.velocidad;
      const currentTotal =
        current.estadisticas.hp +
        current.estadisticas.ataque +
        current.estadisticas.defensa +
        current.estadisticas.velocidad;
      return currentTotal > strongestTotal ? current : strongest;
    });

    const tiposCount = {};
    pokemones.forEach((pokemon) => {
      pokemon.tipos.forEach((tipo) => {
        tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
      });
    });
    const tipoMasComun = Object.keys(tiposCount).reduce(
      (a, b) => (tiposCount[a] > tiposCount[b] ? a : b),
      ""
    );

    const regionesCount = {};
    pokemones.forEach((pokemon) => {
      regionesCount[pokemon.region] = (regionesCount[pokemon.region] || 0) + 1;
    });
    const regionMasExplorada = Object.keys(regionesCount).reduce(
      (a, b) => (regionesCount[a] > regionesCount[b] ? a : b),
      ""
    );

    const rareza = {
      legendarios: pokemones.filter((p) => p.rareza === "legendario").length,
      raros: pokemones.filter((p) => p.rareza === "raro").length,
      comunes: pokemones.filter((p) => p.rareza === "común").length,
    };

    setEstadisticas({
      totalCapturados,
      nivelPromedio,
      pokemonMasFuerte,
      tipoMasComun,
      regionMasExplorada,
      rareza,
    });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerColorTipo = (tipo) => {
    const colores = {
      grass: "bg-green-500",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-500",
      normal: "bg-gray-500",
      flying: "bg-indigo-400",
      poison: "bg-purple-500",
      ground: "bg-yellow-700",
      rock: "bg-yellow-800",
      bug: "bg-green-700",
      ghost: "bg-purple-700",
      steel: "bg-gray-700",
      fighting: "bg-red-700",
      psychic: "bg-pink-500",
      ice: "bg-blue-300",
      dragon: "bg-indigo-700",
      dark: "bg-gray-900",
      fairy: "bg-pink-300",
    };
    return colores[tipo] || "bg-gray-500";
  };

  const pokemonesPorRegion = pokemones.reduce((acc, pokemon) => {
    acc[pokemon.region] = (acc[pokemon.region] || 0) + 1;
    return acc;
  }, {});

  const pokemonesPorTipo = pokemones.reduce((acc, pokemon) => {
    pokemon.tipos.forEach((tipo) => {
      acc[tipo] = (acc[tipo] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Estadísticas de Entrenador
            </h1>
            <p className="text-xl text-gray-600">
              Analiza tu progreso y logros como entrenador Pokémon
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pokémon Más Fuerte */}
            {estadisticas.pokemonMasFuerte && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Tu Pokémon Más Fuerte
                </h2>
                <div className="flex items-center space-x-4">
                  <img
                    src={estadisticas.pokemonMasFuerte.sprite}
                    alt={estadisticas.pokemonMasFuerte.nombre}
                    className="w-20 h-20"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {estadisticas.pokemonMasFuerte.nombre}
                    </h3>
                    <p className="text-gray-600">
                      Nivel {estadisticas.pokemonMasFuerte.nivel} • #
                      {estadisticas.pokemonMasFuerte.numero}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      {estadisticas.pokemonMasFuerte.tipos.map((tipo) => (
                        <span
                          key={tipo}
                          className={`px-2 py-1 text-xs text-white rounded-full ${obtenerColorTipo(
                            tipo
                          )}`}
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <span>
                        HP: {estadisticas.pokemonMasFuerte.estadisticas.hp}
                      </span>
                      <span>
                        ATK: {estadisticas.pokemonMasFuerte.estadisticas.ataque}
                      </span>
                      <span>
                        DEF:{" "}
                        {estadisticas.pokemonMasFuerte.estadisticas.defensa}
                      </span>
                      <span>
                        SPD:{" "}
                        {estadisticas.pokemonMasFuerte.estadisticas.velocidad}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Distribución por Rareza */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Distribución por Rareza
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-600 font-medium">
                    Legendarios
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{
                          width: `${
                            (estadisticas.rareza.legendarios /
                              estadisticas.totalCapturados) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {estadisticas.rareza.legendarios}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 font-medium">Raros</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full"
                        style={{
                          width: `${
                            (estadisticas.rareza.raros /
                              estadisticas.totalCapturados) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {estadisticas.rareza.raros}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">Comunes</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${
                            (estadisticas.rareza.comunes /
                              estadisticas.totalCapturados) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {estadisticas.rareza.comunes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pokémon por Región */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Exploración por Región
              </h2>
              <div className="space-y-3">
                {Object.entries(pokemonesPorRegion)
                  .sort(([, a], [, b]) => b - a)
                  .map(([region, count]) => (
                    <div
                      key={region}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">{region}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (count / estadisticas.totalCapturados) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tipos Favoritos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tipos Más Capturados
              </h2>
              <div className="space-y-2">
                {Object.entries(pokemonesPorTipo)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([tipo, count]) => (
                    <div
                      key={tipo}
                      className="flex justify-between items-center"
                    >
                      <span
                        className={`px-2 py-1 text-xs text-white rounded-full ${obtenerColorTipo(
                          tipo
                        )}`}
                      >
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Logros */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Logros Desbloqueados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  estadisticas.totalCapturados >= 10
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl"></span>
                  <p className="font-medium mt-2">Coleccionista Novato</p>
                  <p className="text-sm text-gray-600">Captura 10 Pokémon</p>
                  <p className="text-xs mt-1">
                    {estadisticas.totalCapturados >= 10
                      ? "¡Desbloqueado!"
                      : `${estadisticas.totalCapturados}/10`}
                  </p>
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border-2 ${
                  estadisticas.rareza.legendarios >= 1
                    ? "bg-purple-50 border-purple-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl"></span>
                  <p className="font-medium mt-2">Leyenda Viviente</p>
                  <p className="text-sm text-gray-600">
                    Captura 1 Pokémon Legendario
                  </p>
                  <p className="text-xs mt-1">
                    {estadisticas.rareza.legendarios >= 1
                      ? "¡Desbloqueado!"
                      : `${estadisticas.rareza.legendarios}/1`}
                  </p>
                </div>
              </div>
              <div
                className={`p-4 rounded-lg border-2 ${
                  Object.keys(pokemonesPorRegion).length >= 3
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="text-center">
                  <span className="text-2xl"></span>
                  <p className="font-medium mt-2">Explorador</p>
                  <p className="text-sm text-gray-600">Explora 3 regiones</p>
                  <p className="text-xs mt-1">
                    {Object.keys(pokemonesPorRegion).length >= 3
                      ? "¡Desbloqueado!"
                      : `${Object.keys(pokemonesPorRegion).length}/3`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
