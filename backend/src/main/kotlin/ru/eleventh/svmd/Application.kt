package ru.eleventh.svmd

import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.cio.*
import io.ktor.server.engine.*
import io.ktor.server.plugins.cachingheaders.*
import ru.eleventh.svmd.services.PersistenceService

fun main() {
    PersistenceService.init()
    embeddedServer(CIO, module = Application::module).start(wait = true)
}


fun Application.module() {
    configureRouting()
    install(CachingHeaders) {
        options { call, outgoingContent ->
            when (outgoingContent.contentType?.withoutParameters()) {
                ContentType.Text.CSS -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 24 * 60 * 60))
                else -> null
            }
        }
    }
    configureRouting()
}
