```javascript
/* =========================================================
   JUEGOSGRATIS
   CATÁLOGO PLAYGAMA
   ========================================================= */

let juegos = [];

const CATALOGO_URL = "games.json";


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const JUEGOS_POR_PAGINA = 24;


/* =========================================================
   LIMPIAR URL
   ========================================================= */

function limpiarUrl(url) {

    if (!url || typeof url !== "string") {
        return "";
    }

    let resultado = url.trim();

    /*
        Convierte:

        [texto](https://ejemplo.com)

        en:

        https://ejemplo.com
    */

    const markdown = resultado.match(
        /^\[.*?\]\((https?:\/\/.*?)\)$/
    );

    if (markdown) {
        resultado = markdown[1];
    }

    /*
        Elimina comillas exteriores.
    */

    resultado = resultado.replace(
        /^["']|["']$/g,
        ""
    );

    return resultado;
}


/* =========================================================
   OBTENER IMAGEN
   ========================================================= */

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


    if (game.imageSrc) {

        const imagen =
            limpiarUrl(
                game.imageSrc
            );

        if (imagen) {
            return imagen;
        }
    }


    if (game.imageSrcSquare) {

        const imagen =
            limpiarUrl(
                game.imageSrcSquare
            );

        if (imagen) {
            return imagen;
        }
    }


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
   CREAR ID
   ========================================================= */

function crearIdJuego(game) {

    if (game.slug) {
        return game.slug;
    }


    if (game.id) {
        return String(game.id);
    }


    return "game-" +
        Math.random()
            .toString(36)
            .substring(2, 10);
}


/* =========================================================
   CONVERTIR JUEGO
   ========================================================= */

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
            game.inGamePurchases ||
            "No",


        orientacion:
            game.screenOrientation ||
            {},


        playgama:
            true

    };

}


/* =========================================================
   CARGAR CATÁLOGO
   ========================================================= */

async function cargarCatalogo() {

    console.log(
        "🎮 Cargando games.json..."
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
                "HTTP " +
                respuesta.status
            );

        }


        const datos =
            await respuesta.json();


        let juegosOriginales = [];


        /*
            Formato principal de Playgama.
        */

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
            Compatibilidad con otros
            formatos posibles.
        */

        if (
            juegosOriginales.length === 0 &&
            Array.isArray(datos.hits)
        ) {

            juegosOriginales =
                datos.hits;

        }


        console.log(
            "🎮 Juegos encontrados en games.json:",
            juegosOriginales.length
        );


        /*
            Convertir juegos.
        */

        const convertidos =
            juegosOriginales
                .map(
                    convertirJuego
                )
                .filter(Boolean);


        /*
            Eliminar duplicados.
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


        console.log(
            "🎮 Juegos válidos cargados:",
            juegos.length
        );


        /*
            Comprobar RIVALS FPS.
        */

        const rivals =
            juegos.find(
                juego =>
                    juego.id ===
                    "rivals-fps-online-shooter"
            );


        if (rivals) {

            console.log(
                "🔫 RIVALS FPS encontrado."
            );

        } else {

            console.log(
                "ℹ️ RIVALS FPS no está dentro de este catálogo."
            );

        }


        /*
            Avisar al index.html
            de que terminó la carga.
        */

        document.dispatchEvent(
            new CustomEvent(
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


/* =========================================================
   FUNCIONES DEL CATÁLOGO
   ========================================================= */

function obtenerJuegos() {

    return juegos;

}


function obtenerJuegoPorId(id) {

    return juegos.find(
        juego =>
            juego.id === id
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
        String(categoria)
            .toLowerCase()
            .trim();


    return juegos.filter(
        juego => {

            const categorias = [

                juego.categoria,

                ...juego.generos,

                ...juego.etiquetas

            ];


            return categorias.some(
                categoriaJuego =>

                    String(
                        categoriaJuego
                    )
                        .toLowerCase()
                        .includes(
                            buscada
                        )
            );

        }
    );

}


/* =========================================================
   POPULARES
   ========================================================= */

function obtenerJuegosDestacados() {

    /*
        Mientras Playgama no nos entregue
        una puntuación/ranking utilizable,
        tomamos los primeros juegos del
        catálogo como selección destacada.
    */

    return juegos.slice(
        0,
        Math.min(
            JUEGOS_POR_PAGINA,
            juegos.length
        )
    );

}


/* =========================================================
   NUEVOS
   ========================================================= */

function obtenerJuegosNuevos() {

    /*
        El JSON actual no proporciona
        una fecha de publicación fiable.

        Por ahora utilizamos el comienzo
        del catálogo como selección.
    */

    return juegos.slice(
        0,
        Math.min(
            JUEGOS_POR_PAGINA,
            juegos.length
        )
    );

}


/* =========================================================
   BUSCAR
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

                juego.instrucciones,

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
   CATEGORÍAS
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
                            String(
                                genero
                            )
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
   INFORMACIÓN
   ========================================================= */

console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


/* =========================================================
   INICIAR
   ========================================================= */

cargarCatalogo();
```
