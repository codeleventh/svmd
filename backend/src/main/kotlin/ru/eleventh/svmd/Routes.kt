package ru.eleventh.svmd

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.http.*
import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.application.hooks.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import ru.eleventh.svmd.exceptions.SvmdException
import ru.eleventh.svmd.model.db.MapMeta
import ru.eleventh.svmd.model.db.NewMap
import ru.eleventh.svmd.model.db.NewUser
import ru.eleventh.svmd.model.db.User
import ru.eleventh.svmd.model.responses.ApiResponse
import ru.eleventh.svmd.model.responses.FailResponse
import ru.eleventh.svmd.model.responses.MapResponse
import ru.eleventh.svmd.model.responses.SuccessResponse
import ru.eleventh.svmd.services.MapService
import ru.eleventh.svmd.services.UserService

fun Application.configureRouting() {
    install(Authentication) {
        basic {
            validate { credentials ->
                val user = UserService.getUserByEmail(credentials.name)
                if (user?.password == credentials.password) {
                    UserIdPrincipal(credentials.name)
                } else {
                    null
                }
            }
        }
    }
    install(ContentNegotiation) {
        jackson {
            disable(SerializationFeature.INDENT_OUTPUT)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }
    install(createApplicationPlugin("exception handler") {
        on(CallFailed) { call, cause ->
            if (cause is SvmdException)
                call.respond(cause.toResponse())
            else call.respond(FailResponse(cause.message.orEmpty()))
        }
    })
    routing {
        route("api") {
            route("meta") {
                get("{mapId}") { call.respond(MapService.getMap(call.parameters["mapId"]!!.uppercase())) }
                authenticate  {
                    post {
                        call.respond(SuccessResponse(MapService.createMap(call.receive<NewMap>())))
                    }
                    get {
                        val email = call.principal<UserIdPrincipal>()?.name
                        val userId = UserService.getUserByEmail(email!!)!!.id
                        call.respond(MapService.getMapsByUser(userId))
                    }
                    put("{mapId}") {
                        val meta = call.receive<MapMeta>()
                        val mapId = call.parameters["mapId"]
                        call.respond(ApiResponse(MapService.updateMap(mapId!!.uppercase(), meta)))
                    }
                }
            }
            route("map/{mapId}") {
                get {
                    val mapId = call.parameters["mapId"]
                    val transformedMap = MapService.convertMap(mapId!!)
                    if (transformedMap is MapResponse) {
                        call.response.header(
                            HttpHeaders.CacheControl,
                            Config.cacheLifetime
                        )
                    }
                    call.respond(transformedMap)
                }
                get("geojson") { TODO() }
            }
            route("user") {
                authenticate {
                    post { call.respond(UserService.createUser(call.receive<NewUser>())!!) }
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
}
