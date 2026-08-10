/* =========================================================
   JUEGOSGRATIS
   CATÁLOGO OPTIMIZADO
   ========================================================= */


const CATALOGO_URL = "games.json";


/* =========================================================
   ESTADO DEL CATÁLOGO
   ========================================================= */

let juegos = [];


/*
   Índice rápido para encontrar un juego por ID.

   Antes:
   juegos.find(...)

   Ahora:
   mapaJuegos.get(id)
*/

const mapaJuegos = new Map();


/* =========================================================
   LIMPIAR URL
   ========================================================= */

function limpiarUrl(url) {

    if (
        !url ||
        typeof url !== "string"
    ) {

        return "";

    }


    let resultado =
        url.trim();


    /*
       Convierte:

       [imagen](https://...)

       en:

       https://...
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
       Elimina comillas externas.
    */

    resultado =
        resultado.replace(
            /^["']|["']$/g,
            ""
        );


    return resultado;

}


/* =========================================================
   OBTENER IMAGEN
   ========================================================= */

function obtenerImagen(game) {

    /*
       Primera imagen del catálogo.
    */

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


    /*
       Compatibilidad con otros
       formatos del catálogo.
    */

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


/* =========================================================
   CREAR ID
   ========================================================= */

function obtenerIdJuego(game) {

    if (game.slug) {

        return String(
            game.slug
        );

    }


    if (
        game.id !== undefined &&
        game.id !== null
    ) {

        return String(
            game.id
        );

    }


    return "";

}


/* =========================================================
   CONVERTIR JUEGO
   ========================================================= */

function convertirJuego(game) {

    if (!game) {

        return null;

    }


    const id =
        obtenerIdJuego(
            game
        );


    const url =
        limpiarUrl(
            game.gameURL
        );


    /*
       Un juego sin ID o URL no puede
       utilizarse correctamente.
    */

    if (
        !id ||
        !url
    ) {

        return null;

    }


    const nombre =
        String(
            game.title ||
            "Juego sin título"
        );


    const categoria =
        obtenerCategoria(
            game
        );


    const descripcion =
        String(
            game.description ||
            ""
        );


    const generos =
        Array.isArray(
            game.genres
        )
            ? game.genres
            : [];


    const etiquetas =
        Array.isArray(
            game.tags
        )
            ? game.tags
            : [];


    /*
       Creamos el texto de búsqueda UNA SOLA VEZ.

       Antes se reconstruía cada vez que
       el usuario escribía en el buscador.
    */

    const textoBusqueda = [

        nombre,

        categoria,

        descripcion,

        ...generos,

        ...etiquetas

    ]
        .join(" ")
        .toLowerCase();


    return {

        id: id,

        nombre: nombre,

        categoria: categoria,

        rating: 0,

        imagen:
            obtenerImagen(
                game
            ),

        url: url,

        paginaGD:
            limpiarUrl(
                game.playgamaGameUrl
            ),

        destacado: false,

        nuevo: false,

        playgamaId:
            game.id !== undefined &&
            game.id !== null
                ? String(game.id)
                : "",

        slug:
            game.slug
                ? String(game.slug)
                : "",

        descripcion: descripcion,

        instrucciones:
            String(
                game.howToPlayText ||
                ""
            ),

        generos: generos,

        etiquetas: etiquetas,

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

        playgama: true,

        /*
           Campo interno utilizado
           exclusivamente para búsquedas.
        */

        _textoBusqueda:
            textoBusqueda

    };

}


/* =========================================================
   CARGAR CATÁLOGO
   ========================================================= */

async function cargarCatalogo() {

    console.log(
        "🎮 Cargando catálogo..."
    );


    try {

        /*
           Usamos la caché normal del navegador.

           Esto evita comprobar/re-descargar
           games.json innecesariamente.
        */

        const respuesta =
            await fetch(
                CATALOGO_URL,
                {
                    cache: "default"
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


        let originales = [];


        /* =================================================
           EXTRAER SEGMENTOS
           ================================================= */

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
                    Array.isArray(
                        segmento.hits
                    )
                ) {

                    originales.push(
                        ...segmento.hits
                    );

                }

            }

        }


        /*
           Compatibilidad con un posible
           formato directo:

           {
               "hits": [...]
           }
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
            "🎮 Juegos encontrados:",
            originales.length
        );


        /* =================================================
           CONVERTIR Y ELIMINAR DUPLICADOS
           ================================================= */

        juegos = [];

        mapaJuegos.clear();


        for (
            const game
            of originales
        ) {

            const convertido =
                convertirJuego(
                    game
                );


            if (
                !convertido
            ) {

                continue;

            }


            /*
               Evitar duplicados.
            */

            if (
                mapaJuegos.has(
                    convertido.id
                )
            ) {

                continue;

            }


            mapaJuegos.set(
                convertido.id,
                convertido
            );


            juegos.push(
                convertido
            );

        }


        console.log(
            "✅ Juegos válidos:",
            juegos.length
        );


        /*
           Avisar a index.html que el catálogo
           ya está completamente preparado.
        */

        document.dispatchEvent(
            new CustomEvent(
                "catalogoCargado"
            )
        );


    }
    catch(error) {

        console.error(
            "❌ Error cargando catálogo:",
            error
        );


        /*
           Avisar a index.html que hubo
           un error de carga.
        */

        document.dispatchEvent(
            new CustomEvent(
                "catalogoError"
            )
        );

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

    if (
        id === undefined ||
        id === null
    ) {

        return undefined;

    }


    return mapaJuegos.get(
        String(id)
    );

}


/* =========================================================
   OBTENER POR CATEGORÍA
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


    const buscada =
        String(
            categoria
        )
        .toLowerCase()
        .trim();


    if (!buscada) {

        return juegos;

    }


    return juegos.filter(
        juego => {

            /*
               Usamos el texto de búsqueda
               previamente preparado.

               Esto evita crear arrays
               innecesarios durante cada
               filtrado.
            */

            return (
                juego.categoria
                    .toLowerCase()
                    .includes(
                        buscada
                    ) ||

                juego.generos.some(
                    genero =>
                        String(
                            genero
                        )
                        .toLowerCase()
                        .includes(
                            buscada
                        )
                ) ||

                juego.etiquetas.some(
                    etiqueta =>
                        String(
                            etiqueta
                        )
                        .toLowerCase()
                        .includes(
                            buscada
                        )
                )
            );

        }
    );

}


/* =========================================================
   DESTACADOS
   ========================================================= */

function obtenerJuegosDestacados() {

    return juegos.slice(
        0,
        24
    );

}


/* =========================================================
   NUEVOS
   ========================================================= */

function obtenerJuegosNuevos() {

    return juegos.slice(
        0,
        24
    );

}


/* =========================================================
   BUSCAR JUEGOS
   ========================================================= */

function buscarJuegos(texto) {

    const busqueda =
        String(
            texto || ""
        )
        .toLowerCase()
        .trim();


    /*
       Si no hay búsqueda,
       devolvemos directamente
       el catálogo original.
    */

    if (!busqueda) {

        return juegos;

    }


    /*
       Buscamos sobre el texto
       previamente generado.
    */

    return juegos.filter(
        juego =>
            juego._textoBusqueda
                .includes(
                    busqueda
                )
    );

}


/* =========================================================
   OBTENER CATEGORÍAS
   ========================================================= */

function obtenerCategorias() {

    const categorias =
        new Set();


    for (
        const juego
        of juegos
    ) {

        for (
            const genero
            of juego.generos
        ) {

            if (genero) {

                categorias.add(
                    String(
                        genero
                    )
                );

            }

        }

    }


    return Array.from(
        categorias
    ).sort(
        (a, b) =>
            a.localeCompare(
                b
            )
    );

}


/* =========================================================
   INICIO
   ========================================================= */

console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


cargarCatalogo();
