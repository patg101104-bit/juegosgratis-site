console.log("🎮 JUEGOSGRATIS - prueba de catálogo");

fetch("games.json")
    .then(function(respuesta) {

        console.log(
            "📡 Respuesta games.json:",
            respuesta.status,
            respuesta.statusText
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo cargar games.json. HTTP " +
                respuesta.status
            );
        }

        return respuesta.json();

    })
    .then(function(datos) {

        console.log(
            "✅ games.json cargado correctamente"
        );

        console.log(
            "📦 Datos recibidos:",
            datos
        );

        if (
            datos.segments &&
            Array.isArray(datos.segments)
        ) {

            console.log(
                "📚 Segmentos:",
                datos.segments.length
            );

            let total = 0;

            datos.segments.forEach(function(segmento) {

                if (
                    segmento.hits &&
                    Array.isArray(segmento.hits)
                ) {

                    total += segmento.hits.length;

                }

            });

            console.log(
                "🎮 Juegos encontrados:",
                total
            );

        } else {

            console.warn(
                "⚠️ El JSON no tiene la estructura esperada."
            );

        }

    })
    .catch(function(error) {

        console.error(
            "❌ Error:",
            error
        );

    });
