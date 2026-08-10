/*
=========================================================
 JUEGOSGRATIS
 Catálogo de videojuegos
 GameDistribution
=========================================================
*/

const juegos = [

    {
        id: "moto-x3m",

        nombre: "Moto X3M Bike Race Game",

        categoria: "carreras",

        rating: 4.8,

        imagen:
            "https://img.gamedistribution.com/5b0abd4c0faa4f5eb190a9a16d5a1b4c-512x512.jpeg",

        url:
            "https://html5.gamedistribution.com/5b0abd4c0faa4f5eb190a9a16d5a1b4c/",

        paginaGD:
            "https://www.gamedistribution.com/games/moto-x3m-bike-race-game/",

        destacado: true,

        nuevo: false
    },


    {
        id: "fireboy-watergirl-7",

        nombre: "Fireboy & Watergirl 7: and Friends",

        categoria: "aventura",

        rating: 4.9,

        imagen:
            "https://img.gamedistribution.com/d4a3629101574bc39bd8f9d1888ca58e-512x512.jpg",

        url:
            "https://html5.gamedistribution.com/d4a3629101574bc39bd8f9d1888ca58e/",

        paginaGD:
            "https://www.gamedistribution.com/games/fireboy-and-watergirl-7%3A-and-friends/",

        destacado: true,

        nuevo: true
    },


    {
        id: "stickman-hook",

        nombre: "Stickman Hook",

        categoria: "accion",

        rating: 4.8,

        imagen:
            "https://img.gamedistribution.com/ebf2d27848674269b5e3506f0f409978-512x512.jpeg",

        url:
            "https://html5.gamedistribution.com/rvvASMiM/ebf2d27848674269b5e3506f0f409978/",

        paginaGD:
            "",

        destacado: true,

        nuevo: false
    }

];


/*
=========================================================
 FUNCIONES DEL CATÁLOGO
=========================================================
*/


function obtenerJuegos() {

    return juegos;

}


function obtenerJuegoPorId(id) {

    return juegos.find(
        juego => juego.id === id
    );

}


function obtenerJuegosPorCategoria(categoria) {

    if (categoria === "todos") {

        return juegos;

    }

    return juegos.filter(
        juego =>
            juego.categoria.toLowerCase() ===
            categoria.toLowerCase()
    );

}


function obtenerJuegosDestacados() {

    return juegos.filter(
        juego => juego.destacado === true
    );

}


function obtenerJuegosNuevos() {

    return juegos.filter(
        juego => juego.nuevo === true
    );

}


function buscarJuegos(texto) {

    const busqueda =
        texto.toLowerCase().trim();


    if (!busqueda) {

        return juegos;

    }


    return juegos.filter(
        juego =>
            juego.nombre
                .toLowerCase()
                .includes(busqueda)
    );

}


console.log(
    "🎮 JuegosGratis - catálogo cargado"
);

console.log(
    "🎮 Juegos disponibles:",
    juegos.length
);
