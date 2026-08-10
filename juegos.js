```javascript
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
        const imagen = limpiarUrl(game.images[0]);

        if (imagen) {
            return imagen;
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


function crearIdJuego(game) {

    if (game.slug) {
        return game.slug;
    }

    if (game.id) {
        return String(game.id);
    }

    return "game-" + Math.random()
        .toString(36)
        .substring(2, 10);
}


function convertirJuego(game) {

    if (!game) {
        return null;
    }

    const url = limpiarUrl(game.gameURL);

    if (!url) {
        return null;
    }

    return {

        id: crearIdJuego(game),

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

    console.log(
        "🎮 Cargando games.json..."
    );

    try {

        const respuesta = await fetch(
            CATALOGO_URL,
            {
                cache: "no-cache"
            }
        );

        if (!respuesta.ok) {

            throw new Error(
                "HTTP " + respuesta.status
            );
        }

        const datos = await respuesta.json();

        let juegosOriginales = [];


        if (Array.isArray(datos.segments)) {

            datos.segments.forEach(segmento => {

                if (
                    Array.isArray(segmento.hits)
                ) {

                    juegosOriginales.push(
                        ...segmento.hits
                    );

                }

            });

        }


        if (
            juegosOriginales.length === 0 &&
            Array.isArray(datos.hits)
        ) {

            juegosOriginales = datos.hits;

        }


        console.log(
            "🎮 Entradas encontradas en JSON:",
            juegosOriginales.length
        );


        const convertidos =
            juegosOriginales
                .map(convertirJuego)
                .filter(Boolean);


        const mapa = new Map();


        convertidos.forEach(juego => {

            if (!mapa.has(juego.id)) {

                mapa.set(
                    juego.id,
                    juego
                );

            }

        });


        juegos = Array.from(
            mapa.values()
        );


        console.log(
            "🎮 Juegos válidos cargados:",
            juegos.length
        );


        const rivals = juegos.find(
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
                "ℹ️ RIVALS FPS no está dentro de este segmento del catálogo."
            );

        }


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


function obtenerJuegosPorCategoria(categoria) {

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


    return juegos.filter(juego => {

        const categorias = [
            juego.categoria,
            ...juego.generos,
            ...juego.etiquetas
        ];


        return categorias.some(
            categoriaJuego =>
                String(categoriaJuego)
                    .toLowerCase()
                    .includes(buscada)
        );

    });

}


function obtenerJuegosDestacados() {

    return juegos.slice(
        0,
        Math.min(24, juegos.length)
    );

}


function obtenerJuegosNuevos() {

    return juegos.slice(
        0,
        Math.min(24, juegos.length)
    );

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


        return contenido.includes(
            busqueda
        );

    });

}


function obtenerCategorias() {

    const categorias = new Set();


    juegos.forEach(juego => {

        juego.generos.forEach(genero => {

            if (genero) {

                categorias.add(
                    String(genero)
                );

            }

        });

    });


    return Array.from(categorias).sort();

}


console.log(
    "🎮 JuegosGratis - catálogo iniciado"
);


cargarCatalogo();
```
