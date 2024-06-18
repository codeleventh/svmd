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
import io.ktor.server.sessions.*
import io.ktor.util.*
import ru.eleventh.svmd.exceptions.SvmdException
import ru.eleventh.svmd.model.ApiErrors
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

data class UserSession(val userId: Long) : Principal

const val AUTH_NAME = "auth-session"

fun Application.configureRouting() {
    install(Sessions) {
        cookie<UserSession>("session", storage = SessionStorageMemory()) {
            cookie.path = "/"
            cookie.httpOnly = false
            cookie.maxAgeInSeconds = 43200 // 1 month
            transform(
                SessionTransportTransformerEncrypt(
                    hex(Config.encryptionKey),
                    hex(Config.signKey)
                )
            )
        }
    }
    install(Authentication) {
        session<UserSession>(AUTH_NAME) {
            validate { session -> session }
            challenge {
                call.respond(HttpStatusCode.Unauthorized, FailResponse(ApiErrors.UNAUTHORIZED))
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
            System.err.println("Error: $cause")
            cause.printStackTrace()
            if (cause is SvmdException)
                call.respond(cause.toResponse())
            else call.respond(FailResponse(cause.message.orEmpty()))
        }
    })
    routing {
        route("api") {
            post("login") {
                val email = call.parameters["email"]!!
                val password = call.parameters["password"]!!
                val user = UserService.getUserByEmail(email)

                if (user?.password == password) {
                    call.sessions.set(UserSession(user.id))
                    call.respond(SuccessResponse("Logged successfully"))
                } else {
                    call.respond(FailResponse(ApiErrors.BAD_CREDS))
                }
            }
            post("/logout") {
                call.sessions.clear<UserSession>()
                call.respond(SuccessResponse("Logged out"))
            }
            route("meta") {
                get("{mapId}") { call.respond(MapService.getMap(call.parameters["mapId"]!!.uppercase())) }
                authenticate(AUTH_NAME) {
                    post {
                        val userId = call.sessions.get<UserSession>()!!.userId
                        call.respond(SuccessResponse(MapService.createMap(userId, call.receive<NewMap>())))
                    }
                    get {
                        val userId = call.sessions.get<UserSession>()!!.userId
                        call.respond(SuccessResponse(MapService.getMapsByUser(userId)))
                    }
                    put("{mapId}") {
                        val meta = call.receive<MapMeta>()
                        val mapId = call.parameters["mapId"]
                        call.respond(SuccessResponse(MapService.updateMap(mapId!!.uppercase(), meta)))
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
                post { call.respond(UserService.createUser(call.receive<NewUser>())!!) }
                authenticate(AUTH_NAME) {
                    get("me") {
                        val userId = call.sessions.get<UserSession>()!!.userId
                        val email = UserService.getUserById(userId)?.email
                        if (email != null) {
                            call.respond(HttpStatusCode.OK, SuccessResponse(email))
                        } else {
                            call.respond(HttpStatusCode.Unauthorized, FailResponse(ApiErrors.UNAUTHORIZED))
                        }
                    }
                    put("{id}") {
                        val userId = call.sessions.get<UserSession>()!!.userId
                        if (userId != call.parameters["id"]!!.toLong()) {
                            call.respond(HttpStatusCode.Unauthorized, FailResponse(ApiErrors.UNAUTHORIZED))
                        } else {
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
}
