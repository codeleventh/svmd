package ru.eleventh.svmd


import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import ru.eleventh.svmd.model.Meta
import ru.eleventh.svmd.model.enums.TileProvider
import java.time.Instant

fun Application.configureRouting() {
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }
    routing {
        route("api") {
            get("map/{mapId}") {
                val mapId = call.parameters["mapId"]!!
                call.respond(
                    Meta(
                        mapId,
                        "Безымянная карта",
                        null,
                        null,
                        Instant.now(),
                        Instant.now(),
                        "0.1",
                        null,
                        null,
                        null,
                        null,
                        TileProvider.DARK
                    )
                )
            }
        }
    }
}