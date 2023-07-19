package ru.eleventh.svmd

import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import ru.eleventh.svmd.plugins.configureHTTP
import ru.eleventh.svmd.plugins.configureRouting
import ru.eleventh.svmd.plugins.configureSerialization

fun main() {
    embeddedServer(CIO, module = Application::module).start(wait = true)
}

fun Application.module() {
    configureSerialization()
    configureHTTP()
    configureRouting()
}
