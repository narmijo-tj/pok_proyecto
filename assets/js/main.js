$(()=> {

    //contiene el pokemon que se está mostrando
    let currentPokemon;
    //va a contener todos los pokémones que registremos
    let arrayPokemones = [];
    /* CAPTURAR EL FORMULARIO */
    const formFindPokemon = $("#formFindPokemon");
    
    
    //ENCIENDO EVENTO SUBMIT DEL FORMULARIO
    formFindPokemon.on("submit", function(event){
        //QUITAMOS EL EVENTO POR DEFECTO DEL FORMULARIO (ACTUALIZAR PÁGINA)
        event.preventDefault();

        /* CAPTURAR ID O NOMBRE DEL POKEMON DESDE EL INPUT DEL FORMULARIO */
        let idOrName = $("#findPokemon").val().toLowerCase();

        let rutaAPI = "https://pokeapi.co/api/v2/pokemon/"+idOrName;
        
        fetch(rutaAPI)
        .then(function(response){
            if(response.status == 404){
                /* SI EL SERVIDOR NOS RESPONDE CON UN 404 (NO ENCONTRADO)
                GENERAMOS UNA EXCEPCIÓN / ERROR QUE SE CAPTURA EN EL CATCH*/
                throw new Error("Pokémon no encontrado.");
            }
            //PERMITE RETORNAR LA DATA QUE DEVUELVE LA API (INFO DE POKÉMONES)
            return response.json();
        })
        .then(function(data){
            //EN DATA NOS LLEGA LA INFORMACIÓN DEL POKÉMON CONSULTADO
            let habilidades = data.abilities.map(habilidad => {
                return habilidad.ability.name
            })
            
            let pokemon = {
                id: data.id,
                nombre: data.name,
                imagen: data.sprites.other.dream_world.front_default,
                habilidades: habilidades //array que contiene nombre de habilidades
            }

            //dejamos como currentPokemon al actual pokémon
            currentPokemon = pokemon;

            cargarDatosPokemonCard(pokemon);
        })
        .catch(function(error){
            //CAPTURAMOS ERROR Y LO MOSTRAMOS EN UNA VENTANA EMERGENTE
            console.log(error);
            alert(error);
        })
    })
    function cargarDatosPokemonCard(pokemon){
        //se reemplaza imagen y alt que tiene el card por la imagen pokemon buscado y nombre
        $("#cardPokemon > img").attr("src", pokemon.imagen);
        $("#cardPokemon > img").attr("alt", pokemon.nombre);
        $("#cardPokemon .card-title").text(pokemon.nombre.toUpperCase());
        
        //SE CREA UN ACUMULADOR DE ELEMENTOS LI
        let liHabilidades = "";
        //RE RECORRE ARRAY DE HABILIDADES PARA CREAR TANTOS LI COMO HABILIDADES TENGA
        //EL POKÉMON
        pokemon.habilidades.forEach(function(habilidad){
            liHabilidades += `
                <li>${habilidad}</li>
            `
        })
        //LE AGREGAMOS LOS ELEMENTOS DE LISTA A LA UL (LISTA)
        $("#listaHabilidades").html(liHabilidades);
    }
})
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 807; i++) {
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
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";
    for (let i = 1; i <= 807; i++) {
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