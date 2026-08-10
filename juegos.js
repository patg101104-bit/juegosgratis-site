```javascript
/* =========================================================
   JUEGOSGRATIS
   Catálogo dinámico desde games.json
   Fuente: Playgama
========================================================= */


let juegos = [];

let catalogoCargado = false;


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CATALOGO_URL = "games.json";


/* =========================================================
   LIMPIAR URLS DE PLAYGAMA
========================================================= */

function limpiarUrl(url) {

    if (!url || typeof url !== "string") {
        return "";
    }

    let resultado = url.trim();


    /*
        Algunos exports pueden venir con formato Markdown:

        [https://ejemplo.com](https://ejemplo.com)

        Extraemos solamente la URL real.
    */

    const markdown =
        resultado.match(
            /^\[.*?\]\((https?:\/\/.*?)\)$/
        );


    if (markdown) {

        resultado =
            markdown[1];

    }


    /*
        También eliminamos posibles comillas
        accidentales.
    */

    resultado =
        resultado.replace(/^["']|["']$/g, "");


    return resultado;

}


/* =========================================================
   CREAR ID INTERNO
========================================================= */

function crearIdJuego(game) {

    if (game.slug) {

        return game.slug;

    }


    if (game.id) {

        return String(game.id);

    }


    return (
        "game-" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


/* =========================================================
   OBTENER IMAGEN
========================================================= */

function obtenerImagen(game) {

    /*
        Primera opción:
        images[0] normalmente es la imagen grande.
    */

    if (
        Array.isArray(game.images) &&
        game.images.length > 0
    ) {

        const imagen =
            limpiarUrl(game.images[0]);

        if (imagen) {

            return imagen;

        }

    }


    /*
        Algunas versiones del catálogo
        pueden utilizar otros campos.
    */

    if (game.imageSrc) {

        return limpiarUrl(
            game.imageSrc
        );

    }


    if (game.imageSrcSquare) {

        return limpiarUrl(
            game.imageSrcSquare
        );

    }


    /*
        Imagen de respaldo.
    */

    return "";

}


/* =========================================================
   OBTENER CATEGORÍA
========================================================= */

function obtenerCategoria(game) {

    if (
        Array.isArray(game.genres) &&
        game.genres.length > 0
    ) {

        return game.genres[0];

    }


    if (
        Array.isArray(game.tags) &&
        game.tags.length > 0
    ) {

        return game.tags[0];

    }


    return "otros";

}


/* =========================================================
   CONVERTIR JUEGO PLAYGAMA
   AL FORMATO DE JUEGOSGRATIS
========================================================= */

function convertirJuego(game) {

    if (!game) {
        return null;
    }


    const url =
        limpiarUrl(game.gameURL);


    /*
        Si no tiene URL de juego,
        no podemos reproducirlo.
    */

    if (!url) {

        return null;

    }


    const juego = {

        id:
            crearIdJuego(game),


        nombre:
            game.title ||
            "Juego sin título",


        categoria:
            obtenerCategoria(game),


        rating:
            0,


        imagen:
            obtenerImagen(game),


        url:
            url,


        paginaGD:
            limpiarUrl(
                game.playgamaGameUrl
            ),


        destacado:
            false,


        nuevo:
            false,


        /*
            Datos adicionales de Playgama.
        */

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


    return juego;

}


/* =========================================================
   CARGAR CATALOGO
========================================================= */

async function cargarCatalogo() {

    console.log(
        "🎮 Cargando catálogo de Playgama..."
    );


    try {

        const respuesta =
            await fetch(
                CATALOGO_URL,
                {
                    cache: "no-cache"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar games.json. HTTP " +
                respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        /*
            games.json utiliza:

            segments
                ↓
            hits
                ↓
            juegos
        */

        let juegosOriginales = [];


        if (
            Array.isArray(
                datos.segments
            )
        ) {

            datos.segments.forEach(
                segmento => {

                    if (
                        Array.isArray(
                            segmento.hits
                        )
                    ) {

                        juegosOriginales.push(
                            ...segmento.hits
                        );

                    }

                }
            );

        }


        /*
            Por si Playgama cambia la estructura
            en futuras versiones.
        */

        if (
            juegosOriginales.length === 0 &&
            Array.isArray(datos.hits)
        ) {

            juegosOriginales =
                datos.hits;

        }


        if (
            juegosOriginales.length === 0
        ) {

            console.warn(
                "⚠️ games.json no contiene juegos reconocibles."
            );

        }


        /*
            Convertimos todos los juegos.
        */

        const convertidos =
            juegosOriginales
                .map(convertirJuego)
                .filter(Boolean);


        /*
            Eliminamos duplicados
            utilizando el ID.
        */

        const mapa =
            new Map();


        convertidos.forEach(
            juego => {

                if (
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
        );


        juegos =
            Array.from(
                mapa.values()
            );


        catalogoCargado = true;


        console.log(
            "🎮 Catálogo cargado correctamente."
        );


        console.log(
            "🎮 Juegos encontrados:",
            juegos.length
        );


        /*
            Buscamos específicamente
            RIVALS FPS para comprobar
            que Playgama está funcionando.
        */

        const rivals =
            juegos.find(
                juego =>
                    juego.id ===
                    "rivals-fps-online-shooter"
            );


        if (rivals) {

            console.log(
                "🔫 RIVALS FPS encontrado correctamente."
            );

        }


        /*
            Avisamos a la página de que
            el catálogo ya está listo.
        */

        document.dispatchEvent(
            new CustomEvent(
                "catalogoCargado"
            )
        );


        return juegos;


    } catch (error) {

        console.error(
            "❌ Error cargando games.json:",
            error
        );


        catalogoCargado = false;


        return [];

    }

}


/* =========================================================
   OBTENER TODOS LOS JUEGOS
========================================================= */

function obtenerJuegos() {

    return juegos;

}


/* =========================================================
   OBTENER JUEGO POR ID
========================================================= */

function obtenerJuegoPorId(id) {

    return juegos.find(
        juego =>
            juego.id === id
    );

}


/* =========================================================
   OBTENER JUEGOS POR CATEGORÍA
========================================================= */

function obtenerJuegosPorCategoria(
    categoria
) {

    if (
        !categoria ||
        categoria === "todos"
    ) {

        return juegos;

    }


    const categoriaNormalizada =
        categoria
            .toLowerCase()
            .trim();


    return juegos.filter(
        juego => {

            const generos = [
                juego.categoria,
                ...juego.generos
            ];


            return generos.some(
                genero =>
                    String(genero)
                        .toLowerCase()
                        .includes(
                            categoriaNormalizada
                        )
            );

        }
    );

}


/* =========================================================
   JUEGOS DESTACADOS
========================================================= */

function obtenerJuegosDestacados() {

    /*
        Mientras Playgama no nos proporcione
        un campo de destacados fiable,
        mostramos los primeros juegos del ranking.
    */

    return juegos.slice(
        0,
        Math.min(24, juegos.length)
    );

}


/* =========================================================
   JUEGOS NUEVOS
========================================================= */

function obtenerJuegosNuevos() {

    /*
        El JSON actual no proporciona
        una fecha de publicación uniforme.

        Por ahora utilizamos una pequeña
        selección del catálogo.
    */

    return juegos.slice(
        0,
        Math.min(24, juegos.length)
    );

}


/* =========================================================
   BUSCAR JUEGOS
========================================================= */

function buscarJuegos(texto) {

    const busqueda =
        String(texto || "")
            .toLowerCase()
            .trim();


    if (!busqueda) {

        return juegos;

    }


    return juegos.filter(
        juego => {

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


/* =========================================================
   INFORMACIÓN DEL CATÁLOGO
========================================================= */

function obtenerCategorias() {

    const categorias =
        new Set();


    juegos.forEach(
        juego => {

            juego.generos.forEach(
                genero => {

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


/* =========================================================
   INICIO
========================================================= */

console.log(
    "🎮 JuegosGratis - sistema de catálogo iniciado"
);


/*
    Cargamos games.json automáticamente.
*/

cargarCatalogo();
```
