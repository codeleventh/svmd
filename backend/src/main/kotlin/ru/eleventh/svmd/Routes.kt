package ru.eleventh.svmd


import Position
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import ru.eleventh.svmd.services.dao

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
            get("maps/") { call.respond(dao.getMaps()) }
            get("maps/{mapId}") { call.respond(dao.getMapByIdentifier(call.parameters["mapId"]!!.toUpperCase())!!) }
            post("maps/") { call.respond(dao.createMap(Position(44.51, 40.17))!!) }
        }
    }
}