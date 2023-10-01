package ru.eleventh.svmd

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.kotlin.konan.properties.loadProperties
import ru.eleventh.svmd.model.db.MapMeta
import ru.eleventh.svmd.model.db.NewMapMeta
import ru.eleventh.svmd.model.db.NewUser
import ru.eleventh.svmd.model.db.User
import ru.eleventh.svmd.model.responses.ApiResponse
import ru.eleventh.svmd.services.MapService
import ru.eleventh.svmd.services.UserService
import java.util.*

fun Application.configureRouting() {
    val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    val cacheLifetime = appConfig.getProperty("svmd.cache.lifetime").toInt()


    install(ContentNegotiation) {
        jackson {
            disable(SerializationFeature.INDENT_OUTPUT)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }
    routing {
        route("api") {
            route("meta") {
                post { call.respond(MapService.createMap(call.receive<NewMapMeta>())!!) }
                get { call.respond(MapService.getMaps()) }
                get("{mapId}") { call.respond(MapService.getMap(call.parameters["mapId"]!!.uppercase())) }
                put("{mapId}") {
                    val meta = call.receive<MapMeta>()
                    val mapId = call.parameters["mapId"]
                    call.respond(ApiResponse(MapService.updateMap(mapId!!.uppercase(), meta)))
                }
            }
            route("map/{mapId}") {
                install(CachingHeaders) {
                    options { _, _ -> CachingOptions(CacheControl.MaxAge(maxAgeSeconds = cacheLifetime)) }
                }
                get {
                    val mapId = call.parameters["mapId"]
                    call.respond(MapService.convertMap(mapId!!))
                }
                get("geojson") { TODO() }
            }
            route("user") {
                post { call.respond(UserService.createUser(call.receive<NewUser>())!!) }
                get { call.respond(UserService.getUsers()) }
                get("{id}") {
                    call.respond(UserService.getUser(call.parameters["id"]!!.toLong()))
                }
                put("{id}") {
                    call.respond(
                        ApiResponse(
                            UserService.updateUser(
                                call.parameters["id"]!!.toLong(),
                                call.receive<User>()
                            )
                        )
                    )
                }
            }
        }
    }
}