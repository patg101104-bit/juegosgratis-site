let juegos = [];

const CATALOGO_URL = "games.json";


function limpiarUrl(url) {

    if (!url || typeof url !== "string") {
        return "";
    }

    let resultado = url.trim();

    const markdown = resultado.match(
        /^\[.*?\]\((https?:\/\/.*?)\)$/
    );

    if (markdown) {
        resultado = markdown[1];
    }

    resultado = resultado.replace(/^["']|["']$/g, "");

    return resultado;
}


function obtenerImagen(game) {

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

    return "";
}


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
            game.slug ||
            String(game.id),

        nombre:
            game.title ||
            "Juego sin título",

        categoria:
            Array.isArray(game.genres) &&
            game.genres.length
                ? game.genres[0]
                : "otros",

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


async function cargarCatalogo() {

    console.log(
        "🎮 Cargando catálogo..."
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


        let originales = [];


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

                        originales.push(
                            ...segmento.hits
                        );

                    }

                }
            );

        }


        console.log(
            "🎮 Juegos encontrados:",
            originales.length
        );


        const mapa =
            new Map();


        originales.forEach(
            game => {

                const convertido =
                    convertirJuego(
                        game
                    );


                if (
                    convertido &&
                    !mapa.has(
                        convertido.id
                    )
                ) {

                    mapa.set(
                        convertido.id,
                        convertido
                    );

                }

            }
        );


        juegos =
            Array.from(
                mapa.values()
            );


        console.log(
            "✅ Juegos válidos:",
            juegos.length
        );


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

    }

}


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
        categoria
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
                valor =>

                    String(valor)
                        .toLowerCase()
                        .includes(
                            buscada
                        )
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


console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


cargarCatalogo();
