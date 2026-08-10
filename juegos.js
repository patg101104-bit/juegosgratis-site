/*
 * JuegosGratis - Catálogo de juegos
 */

const juegos = [

    // ==========================================
    // JUEGOS EXISTENTES
    // ==========================================

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
    },


    // ==========================================
    // PLAYGAMA
    // ==========================================

    {
        id: "rivals-fps-online-shooter",

        nombre: "RIVALS FPS: Online Shooter",

        categoria: "accion",

        rating: 4.8,

        imagen:
            "https://static.playgama.com/p-img/pg/rivals-fps-online-shooter/big_preview/f09adf25db724a509d28d6427dfd4d7c?width=448",

        url:
            "https://playgama.com/export/game/rivals-fps-online-shooter?clid=p_a44683ad-e4e8-4bad-8189-0fd8ef68cae2",

        paginaGD:
            "",

        playgamaUrl:
            "https://playgama.com/game/rivals-fps-online-shooter",

        descripcion:
            "RIVALS FPS: Online Shooter es un shooter multijugador gratuito con batallas dinámicas, diferentes mapas, modos de juego y combates en primera persona.",

        instrucciones:
            "PC: WASD para moverte, mouse para mirar, Space para saltar, C para agacharte y E para interactuar.\n\nMóvil: joystick virtual para moverte y gestos en la pantalla para controlar la cámara.",

        generos: [
            "accion",
            "arcade",
            "3d",
            "multijugador",
            "disparos",
            "co-op",
            "fps"
        ],

        destacado: true,

        nuevo: true,

        proveedor: "playgama"
    }

];


// ==========================================
// FUNCIONES DEL CATÁLOGO
// ==========================================

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


// ==========================================
// INFORMACIÓN DEL CATÁLOGO
// ==========================================

console.log(
    "🎮 JuegosGratis - catálogo cargado"
);

console.log(
    "🎮 Juegos disponibles:",
    juegos.length
);
