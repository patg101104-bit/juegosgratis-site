/*
=========================================================
 JUEGOSGRATIS.SITE
 Catálogo de videojuegos
=========================================================

 Para agregar un juego nuevo, copia uno de los objetos
 de abajo y cambia sus datos.

=========================================================
*/

const juegos = [

    /*
    =====================================================
    JUEGO 1
    =====================================================
    */

    {
        id: "moto-x3m",

        nombre: "Moto X3M",

        categoria: "carreras",

        rating: 4.8,

        imagen:
            "https://img.gamedistribution.com/a26b2b6473ba418bb208471c66f7f329-512x512.jpeg",

        url:
            "https://html5.gamedistribution.com/rvvAS300/a26b2b6473ba418bb208471c66f7f329/",

        destacado: true,

        nuevo: false
    },


    /*
    =====================================================
    JUEGO 2
    =====================================================
    */

    {
        id: "runner-arcade",

        nombre: "Runner Arcade",

        categoria: "accion",

        rating: 4.6,

        imagen:
            "https://img.gamedistribution.com/f920279c09d54e4f9b8c0c1efdfbe53a-512x512.jpeg",

        url:
            "https://html5.gamedistribution.com/f920279c09d54e4f9b8c0c1efdfbe53a/",

        destacado: true,

        nuevo: true
    },


    /*
    =====================================================
    JUEGO 3
    =====================================================

    DATOS PROVISIONALES

    Game ID:
    d6fa0baa88bd4e0da0ffb22ffc4ec347

    Falta confirmar:
    - Nombre
    - Categoría
    - Imagen oficial
    - URL definitiva
    =====================================================
    */

    {
        id: "juego-gd-003",

        nombre: "Juego GameDistribution",

        categoria: "arcade",

        rating: 4.5,

        imagen:
            "https://img.gamedistribution.com/d6fa0baa88bd4e0da0ffb22ffc4ec347-512x512.jpeg",

        url:
            "https://html5.gamedistribution.com/d6fa0baa88bd4e0da0ffb22ffc4ec347/",

        destacado: false,

        nuevo: true
    }

];



/*
=========================================================
 FUNCIONES DEL CATÁLOGO
=========================================================
*/


/*
---------------------------------------------------------
 Obtener todos los juegos
---------------------------------------------------------
*/

function obtenerJuegos() {

    return juegos;

}


/*
---------------------------------------------------------
 Buscar un juego por ID
---------------------------------------------------------
*/

function obtenerJuegoPorId(id) {

    return juegos.find(
        juego => juego.id === id
    );

}


/*
---------------------------------------------------------
 Obtener juegos por categoría
---------------------------------------------------------
*/

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


/*
---------------------------------------------------------
 Obtener juegos destacados
---------------------------------------------------------
*/

function obtenerJuegosDestacados() {

    return juegos.filter(
        juego => juego.destacado === true
    );

}


/*
---------------------------------------------------------
 Obtener juegos nuevos
---------------------------------------------------------
*/

function obtenerJuegosNuevos() {

    return juegos.filter(
        juego => juego.nuevo === true
    );

}


/*
---------------------------------------------------------
 Buscar juegos por nombre
---------------------------------------------------------
*/

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


/*
=========================================================
 INFORMACIÓN DEL CATÁLOGO
=========================================================
*/

console.log(
    "🎮 JuegosGratis.site"
);

console.log(
    "Juegos disponibles:",
    juegos.length
);
