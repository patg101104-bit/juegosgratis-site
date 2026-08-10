```javascript
"use strict";

let juegos = [];

const CATALOGO_URL = "games.json";


/* =====================================================
   LIMPIAR URL
===================================================== */

function limpiarUrl(url) {

    if (typeof url !== "string") {
        return "";
    }

    let resultado = url.trim();

    // Convierte URLs escritas como Markdown
    // [texto](https://ejemplo.com)
    const inicio = resultado.indexOf("](");
    const final = resultado.lastIndexOf(")");

    if (
        resultado.startsWith("[") &&
        inicio !== -1 &&
        final > inicio
    ) {

        resultado =
            resultado.substring(
                inicio + 2,
                final
            );

    }

    return resultado;
}


/* =====================================================
   OBTENER IMAGEN
===================================================== */

function obtenerImagen(game) {

    if (
        Array.isArray(game.images) &&
        game.images.length > 0
    ) {

        const imagen =
            limpiarUrl(
                game.images[0]
            );

        if (imagen) {
            return imagen;
        }

    }


    if (
        typeof game.imageSrc === "string" &&
        game.imageSrc
    ) {

        return limpiarUrl(
            game.imageSrc
        );

    }


    if (
        typeof game.imageSrcSquare === "string" &&
        game.imageSrcSquare
    ) {

        return limpiarUrl(
            game.imageSrcSquare
        );

    }


    return "";
}


/* =====================================================
   OBTENER CATEGORIA
===================================================== */

function obtenerCategoria(game) {

    if (
        Array.isArray(game.genres) &&
        game.genres.length > 0
    ) {

        return String(
            game.genres[0]
        );

    }


    if (
        Array.isArray(game.tags) &&
        game.tags.length > 0
    ) {

        return String(
            game.tags[0]
        );

    }


    return "otros";
}


/* =====================================================
   CREAR ID
===================================================== */

function crearIdJuego(game) {

    if (game.slug) {

        return String(
            game.slug
        );

    }


    if (game.id) {

        return String(
            game.id
        );

    }


    return (
        "game-" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


/* =====================================================
   CONVERTIR JUEGO
===================================================== */

function convertirJuego(game) {

    if (!game) {
        return null;
    }


    const url =
        limpiarUrl(
            game.gameURL
        );


    if (!url) {
        return null;
    }


    return {

        id:
            crearIdJuego(game),

        nombre:
            game.title ||
            "Juego sin título",

        categoria:
            obtenerCategoria(game),

        rating: 0,

        imagen:
            obtenerImagen(game),

        url: url,

        paginaGD:
            limpiarUrl(
                game.playgamaGameUrl
            ),

        destacado: false,

        nuevo: false,

        playgamaId:
            game.id
                ? String(game.id)
                : "",

        slug:
            game.slug || "",

        descripcion:
            game.description || "",

        instrucciones:
            game.howToPlayText || "",

        generos:
            Array.isArray(game.genres)
                ? game.genres
                : [],

        etiquetas:
            Array.isArray(game.tags)
                ? game.tags
                : [],

        idiomas:
            Array.isArray(
                game.supportedLanguages
            )
                ? game.supportedLanguages
                : [],

        mobileReady:
            Array.isArray(
                game.mobileReady
            )
                ? game.mobileReady
                : [],

        comprasDentroDelJuego:
            game.inGamePurchases || "No",

        orientacion:
            game.screenOrientation || {},

        playgama: true

    };

}


/* =====================================================
   CARGAR CATALOGO
===================================================== */

async function cargarCatalogo() {

    console.log(
        "🎮 Cargando games.json..."
    );


    try {

        const respuesta =
            await fetch(
                CATALOGO_URL
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar games.json. HTTP " +
                respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        let originales = [];


        /*
         * El catálogo de Playgama tiene:
         *
         * segments
         *    └── hits
         */

        if (
            Array.isArray(
                datos.segments
            )
        ) {

            for (
                const segmento
                of datos.segments
            ) {

                if (
                    segmento &&
                    Array.isArray(
                        segmento.hits
                    )
                ) {

                    originales =
                        originales.concat(
                            segmento.hits
                        );

                }

            }

        }


        /*
         * Compatibilidad con otros formatos
         */

        if (
            originales.length === 0 &&
            Array.isArray(
                datos.hits
            )
        ) {

            originales =
                datos.hits;

        }


        console.log(
            "🎮 Juegos encontrados en games.json:",
            originales.length
        );


        const mapa =
            new Map();


        for (
            const original
            of originales
        ) {

            const juego =
                convertirJuego(
                    original
                );


            if (
                juego &&
                !mapa.has(
                    juego.id
                )
            ) {

                mapa.set(
                    juego.id,
                    juego
                );

            }

        }


        juegos =
            Array.from(
                mapa.values()
            );


        console.log(
            "🎮 Juegos válidos cargados:",
            juegos.length
        );


        /*
         * Avisar a index.html
         */

        document.dispatchEvent(
            new Event(
                "catalogoCargado"
            )
        );


    } catch (error) {

        console.error(
            "❌ Error cargando games.json:",
            error
        );


        document.dispatchEvent(
            new CustomEvent(
                "catalogoError",
                {
                    detail: error
                }
            )
        );

    }

}


/* =====================================================
   FUNCIONES PUBLICAS DEL CATALOGO
===================================================== */

function obtenerJuegos() {

    return juegos;

}


function obtenerJuegoPorId(id) {

    return juegos.find(
        function(juego) {

            return juego.id === id;

        }
    );

}


function obtenerJuegosPorCategoria(
    categoria
) {

    if (
        !categoria ||
        categoria === "todos"
    ) {

        return juegos;

    }


    const buscada =
        String(
            categoria
        )
            .toLowerCase()
            .trim();


    return juegos.filter(
        function(juego) {

            const categorias = [

                juego.categoria,

                ...juego.generos,

                ...juego.etiquetas

            ];


            return categorias.some(
                function(valor) {

                    return String(
                        valor
                    )
                        .toLowerCase()
                        .includes(
                            buscada
                        );

                }
            );

        }
    );

}


function obtenerJuegosDestacados() {

    return juegos.slice(
        0,
        24
    );

}


function obtenerJuegosNuevos() {

    return juegos.slice(
        0,
        24
    );

}


function buscarJuegos(texto) {

    const busqueda =
        String(
            texto || ""
        )
            .toLowerCase()
            .trim();


    if (!busqueda) {

        return juegos;

    }


    return juegos.filter(
        function(juego) {

            const contenido = [

                juego.nombre,

                juego.categoria,

                juego.descripcion,

                ...juego.generos,

                ...juego.etiquetas

            ]
                .join(" ")
                .toLowerCase();


            return contenido.includes(
                busqueda
            );

        }
    );

}


/* =====================================================
   CATEGORIAS
===================================================== */

function obtenerCategorias() {

    const categorias =
        new Set();


    juegos.forEach(
        function(juego) {

            juego.generos.forEach(
                function(genero) {

                    if (genero) {

                        categorias.add(
                            String(genero)
                        );

                    }

                }
            );

        }
    );


    return Array.from(
        categorias
    ).sort();

}


/* =====================================================
   INICIO
===================================================== */

console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


cargarCatalogo();
```
