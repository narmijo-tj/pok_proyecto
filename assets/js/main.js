$(()=> {
    let currentPokemon;
    let arrayPokemones = [];
    const formFindPokemon = $("#formFindPokemon");
    formFindPokemon.on("submit", function(event){
        event.preventDefault();
        let idOrName = $("#findPokemon").val().toLowerCase();
        let rutaAPI = "https://pokeapi.co/api/v2/pokemon/"+idOrName;    
        fetch(rutaAPI)
        .then(function(response){
            if(response.status == 404){
                throw new Error("Pokémon no encontrado.");
            }
            return response.json();
        })
        .then(function(data){
            let habilidades = data.abilities.map(habilidad => {
                return habilidad.ability.name
            })
            let pokemon = {
                id: data.id,
                nombre: data.name,
                imagen: data.sprites.other.dream_world.front_default,
                habilidades: habilidades 
            }
            currentPokemon = pokemon;
            cargarDatosPokemonCard(pokemon);
        })
        .catch(function(error){
            console.log(error);
            alert(error);
        })
    })
    function cargarDatosPokemonCard(pokemon){
        $("#cardPokemon > img").attr("src", pokemon.imagen);
        $("#cardPokemon > img").attr("alt", pokemon.nombre);
        $("#cardPokemon .card-title").text(pokemon.nombre.toUpperCase());
        let liHabilidades = "";
        pokemon.habilidades.forEach(function(habilidad){
            liHabilidades += `
                <li>${habilidad}</li>
            `
        })
        $("#listaHabilidades").html(liHabilidades);
    }
})
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 1025; i++) {
    fetch(URL + i)
        .then(function(response){
            if(response.status == 404){
                throw new Error("Pokemon no encontrado.");
            }})
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');
    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height/10} m</p>
                <p class="stat">${poke.weight/10} kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";
    for (let i = 1; i <= 1025; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))