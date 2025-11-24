"use client";
import { tomarPokemones } from "../../api/api";
import { useEffect, useState } from "react";
import Navigation from "../components/Navigation";

export default function ArenaDeBatalla() {
  const [pokemones, setPokemones] = useState([]);
  const [batallas, setBatallas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    pokemon1: "",
    pokemon2: "",
    ganador: "",
    duracion: "",
    lugar: "Centro Pokémon",
    tipo: "entrenamiento",
  });

  // Generar algunas batallas simuladas
  const generarBatallasSimuladas = (pokemones) => {
    if (pokemones.length < 2) return [];

    const batallasSimuladas = [];
    for (let i = 0; i < 8; i++) {
      const pokemon1 = pokemones[Math.floor(Math.random() * pokemones.length)];
      const pokemon2 = pokemones[Math.floor(Math.random() * pokemones.length)];

      if (pokemon1.id !== pokemon2.id) {
        // Determinar ganador basado en estadísticas
        const poder1 =
          pokemon1.estadisticas.hp +
          pokemon1.estadisticas.ataque +
          pokemon1.estadisticas.defensa;
        const poder2 =
          pokemon2.estadisticas.hp +
          pokemon2.estadisticas.ataque +
          pokemon2.estadisticas.defensa;
        const ganador = poder1 > poder2 ? pokemon1 : pokemon2;

        batallasSimuladas.push({
          id: i + 1,
          pokemon1: pokemon1,
          pokemon2: pokemon2,
          ganador: ganador,
          duracion: Math.floor(Math.random() * 30) + 5, // 5-35 minutos
          fecha: new Date(
            Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
          lugar: [
            "Centro Pokémon",
            "Gimnasio de Pueblo Paleta",
            "Liga Pokémon",
            "Ruta 1",
          ][Math.floor(Math.random() * 4)],
          tipo: ["entrenamiento", "gimnasio", "liga", "amistoso"][
            Math.floor(Math.random() * 4)
          ],
        });
      }
    }
    return batallasSimuladas;
  };

  const cargarDatos = async () => {
    try {
      const pokemonData = await tomarPokemones();
      setPokemones(pokemonData);
      const batallasSimuladas = generarBatallasSimuladas(pokemonData);
      setBatallas(batallasSimuladas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formulario.pokemon1 || !formulario.pokemon2 || !formulario.ganador) {
        alert("Debe seleccionar ambos Pokémon y un ganador");
        return;
      }

      const pokemon1 = pokemones.find((p) => p.id == formulario.pokemon1);
      const pokemon2 = pokemones.find((p) => p.id == formulario.pokemon2);
      const ganador = pokemones.find((p) => p.id == formulario.ganador);

      const nuevaBatalla = {
        id: batallas.length + 1,
        pokemon1,
        pokemon2,
        ganador,
        duracion: parseInt(formulario.duracion) || 15,
        fecha: new Date().toLocaleDateString(),
        lugar: formulario.lugar,
        tipo: formulario.tipo,
      };

      setBatallas((prev) => [nuevaBatalla, ...prev]);
      resetearFormulario();
    } catch (error) {
      console.error("Error al registrar batalla:", error);
    }
  };

  const resetearFormulario = () => {
    setFormulario({
      pokemon1: "",
      pokemon2: "",
      ganador: "",
      duracion: "",
      lugar: "Centro Pokémon",
      tipo: "entrenamiento",
    });
    setMostrarFormulario(false);
  };

  const obtenerColorTipo = (tipo) => {
    return ["entrenamiento", "amistoso"].includes(tipo)
      ? "bg-blue-100 text-blue-800"
      : tipo === "gimnasio"
      ? "bg-orange-100 text-orange-800"
      : "bg-purple-100 text-purple-800";
  };

  const pokemonesParticipantes =
    formulario.pokemon1 && formulario.pokemon2
      ? [formulario.pokemon1, formulario.pokemon2]
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Navigation />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {" "}
              Arena de Batalla Pokémon
            </h1>
            <p className="text-xl text-gray-600">
              Registra y gestiona las batallas épicas de tus Pokémon
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Registro de Batallas
            </h2>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {mostrarFormulario ? "Cancelar" : "Nueva Batalla"}
            </button>
          </div>

          {mostrarFormulario && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">
                Registrar Nueva Batalla
              </h3>
              <form
                onSubmit={manejarSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pokémon 1
                  </label>
                  <select
                    name="pokemon1"
                    value={formulario.pokemon1}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Seleccionar Pokémon</option>
                    {pokemones.map((pokemon) => (
                      <option key={pokemon.id} value={pokemon.id}>
                        #{pokemon.numero} {pokemon.nombre} (Nv.{pokemon.nivel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Pokémon 2
                  </label>
                  <select
                    name="pokemon2"
                    value={formulario.pokemon2}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Seleccionar Pokémon</option>
                    {pokemones
                      .filter((p) => p.id != formulario.pokemon1)
                      .map((pokemon) => (
                        <option key={pokemon.id} value={pokemon.id}>
                          #{pokemon.numero} {pokemon.nombre} (Nv.{pokemon.nivel}
                          )
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Ganador
                  </label>
                  <select
                    name="ganador"
                    value={formulario.ganador}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Seleccionar ganador</option>
                    {pokemonesParticipantes.map((pokemonId) => {
                      const pokemon = pokemones.find((p) => p.id == pokemonId);
                      return pokemon ? (
                        <option key={pokemon.id} value={pokemon.id}>
                          {pokemon.nombre}
                        </option>
                      ) : null;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    name="duracion"
                    value={formulario.duracion}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Lugar
                  </label>
                  <select
                    name="lugar"
                    value={formulario.lugar}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Centro Pokémon">Centro Pokémon</option>
                    <option value="Gimnasio de Pueblo Paleta">
                      Gimnasio de Pueblo Paleta
                    </option>
                    <option value="Liga Pokémon">Liga Pokémon</option>
                    <option value="Ruta 1">Ruta 1</option>
                    <option value="Cueva Roca">Cueva Roca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo de Batalla
                  </label>
                  <select
                    name="tipo"
                    value={formulario.tipo}
                    onChange={manejarCambioFormulario}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="entrenamiento">Entrenamiento</option>
                    <option value="amistoso">Amistoso</option>
                    <option value="gimnasio">Gimnasio</option>
                    <option value="liga">Liga</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Registrar Batalla
                  </button>
                  <button
                    type="button"
                    onClick={resetearFormulario}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Batallas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h3 className="text-xl font-semibold p-6 bg-gray-50 border-b">
              Historial de Batallas
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Combate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ganador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lugar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batallas.map((batalla) => (
                    <tr key={batalla.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <img
                              className="h-8 w-8 rounded"
                              src={batalla.pokemon1.sprite}
                              alt={batalla.pokemon1.nombre}
                            />
                            <span className="text-sm font-medium">
                              {batalla.pokemon1.nombre}
                            </span>
                          </div>
                          <span className="text-gray-500">vs</span>
                          <div className="flex items-center space-x-2">
                            <img
                              className="h-8 w-8 rounded"
                              src={batalla.pokemon2.sprite}
                              alt={batalla.pokemon2.nombre}
                            />
                            <span className="text-sm font-medium">
                              {batalla.pokemon2.nombre}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img
                            className="h-6 w-6 rounded"
                            src={batalla.ganador.sprite}
                            alt={batalla.ganador.nombre}
                          />
                          <span className="text-sm font-medium text-green-600">
                            {batalla.ganador.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batalla.duracion} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batalla.lugar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded-full ${obtenerColorTipo(
                            batalla.tipo
                          )}`}
                        >
                          {batalla.tipo.charAt(0).toUpperCase() +
                            batalla.tipo.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batalla.fecha}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {batallas.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay batallas registradas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
