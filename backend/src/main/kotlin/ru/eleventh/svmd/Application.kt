package ru.eleventh.svmd

import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*

fun main() {
    embeddedServer(CIO, module = Application::module).start(wait = true)
}

fun Application.module() {
    DatabaseConnection.init()
    configureRouting()
}
