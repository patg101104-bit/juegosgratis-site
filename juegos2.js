let juegos = [];

const CATALOGO_URL = "games.json";


function limpiarUrl(url) {

    if (!url || typeof url !== "string") {
        return "";
    }

    let resultado = url.trim();

    // Convierte enlaces Markdown:
    // [https://ejemplo.com](https://ejemplo.com)
    const match = resultado.match(
        /^\[.*?\]\((https?:\/\/.*?)\)$/
    );

    if (match) {
        resultado = match[1];
    }

    return resultado;
}


function obtenerImagen(game) {

    if (Array.isArray(game.images)) {

        for (const imagen of game.images) {

            const url = limpiarUrl(imagen);

            if (url) {
                return url;
            }

        }

    }

    if (game.imageSrc) {
        return limpiarUrl(game.imageSrc);
    }

    if (game.imageSrcSquare) {
        return limpiarUrl(game.imageSrcSquare);
    }

    return "";
}


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


function convertirJuego(game) {

    if (!game || typeof game !== "object") {
        return null;
    }

    const url = limpiarUrl(game.gameURL);

    if (!url) {
        return null;
    }

    return {

        id:
            game.slug ||
            String(game.id || Math.random()),

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
            limpiarUrl(game.playgamaGameUrl),

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
            Array.isArray(game.supportedLanguages)
                ? game.supportedLanguages
                : [],

        mobileReady:
            Array.isArray(game.mobileReady)
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

    console.log("🎮 Cargando games.json...");

    try {

        const respuesta = await fetch(
            CATALOGO_URL + "?v=" + Date.now()
        );

        if (!respuesta.ok) {

            throw new Error(
                "HTTP " + respuesta.status
            );

        }

        const datos = await respuesta.json();

        let originales = [];


        if (Array.isArray(datos.segments)) {

            for (const segmento of datos.segments) {

                if (
                    segmento &&
                    Array.isArray(segmento.hits)
                ) {

                    originales.push(
                        ...segmento.hits
                    );

                }

            }

        }


        if (
            originales.length === 0 &&
            Array.isArray(datos.hits)
        ) {

            originales = datos.hits;

        }


        console.log(
            "🎮 Juegos encontrados en games.json:",
            originales.length
        );


        const convertidos = originales
            .map(convertirJuego)
            .filter(Boolean);


        const mapa = new Map();


        for (const juego of convertidos) {

            if (!mapa.has(juego.id)) {

                mapa.set(
                    juego.id,
                    juego
                );

            }

        }


        juegos = Array.from(
            mapa.values()
        );


        console.log(
            "🎮 Juegos válidos cargados:",
            juegos.length
        );


        document.dispatchEvent(
            new CustomEvent("catalogoCargado")
        );


    } catch (error) {

        console.error(
            "❌ No se pudo cargar games.json:",
            error
        );

    }

}


function obtenerJuegos() {

    return juegos;

}


function obtenerJuegoPorId(id) {

    return juegos.find(
        juego => juego.id === id
    );

}


function obtenerJuegosPorCategoria(categoria) {

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


    return juegos.filter(juego => {

        const categorias = [
            juego.categoria,
            ...juego.generos,
            ...juego.etiquetas
        ];


        return categorias.some(valor =>
            String(valor)
                .toLowerCase()
                .includes(buscada)
        );

    });

}


function obtenerJuegosDestacados() {

    return juegos.slice(0, 24);

}


function obtenerJuegosNuevos() {

    return juegos.slice(0, 24);

}


function buscarJuegos(texto) {

    const busqueda =
        String(texto || "")
            .toLowerCase()
            .trim();


    if (!busqueda) {

        return juegos;

    }


    return juegos.filter(juego => {

        const contenido = [

            juego.nombre,

            juego.categoria,

            juego.descripcion,

            ...juego.generos,

            ...juego.etiquetas

        ]
            .join(" ")
            .toLowerCase();


        return contenido.includes(busqueda);

    });

}


function obtenerCategorias() {

    const categorias = new Set();


    for (const juego of juegos) {

        for (const genero of juego.generos) {

            if (genero) {

                categorias.add(
                    String(genero)
                );

            }

        }

    }


    return Array.from(categorias).sort();

}


console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


cargarCatalogo();
