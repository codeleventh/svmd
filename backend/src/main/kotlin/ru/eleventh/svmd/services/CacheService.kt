package ru.eleventh.svmd.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.http.*
import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties
import ru.eleventh.svmd.model.Errors
import java.time.Instant
import java.time.Instant.now

object CacheService {

    private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    private val client = HttpClient(CIO) { followRedirects = true }

    private val cache = HashMap<String, Pair<Instant, String>>()
    private val cacheLifetime = appConfig.getProperty("svmd.cache.lifetime").toLong()

    suspend fun getSpreadsheet(spreadsheetId: String): String {
        val cachedSpreadsheet = cache[spreadsheetId]
        return (if (cachedSpreadsheet?.first?.isAfter(now().minusSeconds(cacheLifetime)) == true)
            cachedSpreadsheet.second
        else {
            val newSpreadsheet = downloadSpreadsheet(spreadsheetId)
            cache[spreadsheetId] = now() to newSpreadsheet
            newSpreadsheet
        })
    }

    private suspend fun downloadSpreadsheet(spreadsheetId: String): String {
        val response = client.get {
            method = HttpMethod.Get
            url("https://docs.google.com/spreadsheets/d/e/$spreadsheetId/pub?output=csv")
            header("Content-Type", "text/plain; charset=UTF-8")
        }

        return when (response.status) {
            HttpStatusCode.OK -> response.body()
            HttpStatusCode.NotFound -> throw RuntimeException(Errors.NO_TABLE_EXIST())
            HttpStatusCode.Unauthorized, HttpStatusCode.BadRequest -> throw RuntimeException(Errors.NO_TABLE_PERMISSION())
            // TODO: ↓ should been investigated
            HttpStatusCode.Gone -> throw RuntimeException(Errors.WHAT_THE_FUCK(RuntimeException("wtf is this shit")))
            else -> throw RuntimeException(Errors.BAD_GOOGLE_RESPONSE())
        }
    }
}