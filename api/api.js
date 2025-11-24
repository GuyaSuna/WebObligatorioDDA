let pokemonsEnMemoria = [];
let nextId = 1;

async function tomarPokemones() {
  try {
    if (pokemonsEnMemoria.length > 0) {
      return pokemonsEnMemoria;
    }

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();

    const pokemonData = await Promise.all(
      data.results.map(async (pokemon, index) => {
        const pokemonDetails = await fetch(pokemon.url);
        const details = await pokemonDetails.json();

        return {
          id: index + 1,
          nombre: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          numero: details.id,
          altura: details.height / 10,
          peso: details.weight / 10,
          tipos: details.types.map((type) => type.type.name),
          habilidades: details.abilities.map((ability) => ability.ability.name),
          experienciaBase: details.base_experience,
          estadisticas: {
            hp: details.stats[0].base_stat,
            ataque: details.stats[1].base_stat,
            defensa: details.stats[2].base_stat,
            velocidad: details.stats[5].base_stat,
          },
          sprite: details.sprites.front_default,
          spriteShiny: details.sprites.front_shiny,
          rareza:
            details.base_experience > 150
              ? "legendario"
              : details.base_experience > 100
              ? "raro"
              : "común",
          fechaCaptura: new Date().toISOString().split("T")[0],
          entrenador: `Entrenador ${Math.floor(Math.random() * 100) + 1}`,
          nivel: Math.floor(Math.random() * 50) + 1,
          region:
            index < 5
              ? "Kanto"
              : index < 10
              ? "Johto"
              : index < 15
              ? "Hoenn"
              : "Sinnoh",
          estado: "capturado",
        };
      })
    );

    pokemonsEnMemoria = pokemonData;
    nextId = pokemonData.length + 1;
    return pokemonsEnMemoria;
  } catch (error) {
    console.error("Error al obtener datos de la Poké API:", error);
    return pokemonsEnMemoria;
  }
}

async function crearPokemon(pokemon) {
  if (pokemonsEnMemoria.length === 0) {
    await tomarPokemones();
  }

  const nuevoPokemon = {
    ...pokemon,
    id: nextId++,
    fechaCaptura: new Date().toISOString().split("T")[0],
    estado: "capturado",
  };

  pokemonsEnMemoria.push(nuevoPokemon);
  return nuevoPokemon;
}

async function actualizarPokemon(id, pokemonActualizado) {
  if (pokemonsEnMemoria.length === 0) {
    await tomarPokemones();
  }

  const index = pokemonsEnMemoria.findIndex((p) => p.id == id);
  if (index !== -1) {
    pokemonsEnMemoria[index] = {
      ...pokemonsEnMemoria[index],
      ...pokemonActualizado,
    };
    return pokemonsEnMemoria[index];
  }
  throw new Error("Pokémon no encontrado");
}

async function liberarPokemon(id) {
  if (pokemonsEnMemoria.length === 0) {
    await tomarPokemones();
  }

  const index = pokemonsEnMemoria.findIndex((p) => p.id == id);
  if (index !== -1) {
    const liberado = pokemonsEnMemoria.splice(index, 1)[0];
    return liberado;
  }
  throw new Error("Pokémon no encontrado");
}

export { tomarPokemones, crearPokemon, actualizarPokemon, liberarPokemon };
