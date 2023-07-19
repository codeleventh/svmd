package ru.eleventh.svmd.plugins

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*

fun Application.configureRouting() {
    routing {
        route("api") {
            get("/") {
                call.respondText("Hello World!")
            }
        }
    }
}
