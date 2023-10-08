package ru.eleventh.svmd.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.http.*
import ru.eleventh.svmd.Config
import ru.eleventh.svmd.model.TransformErrors
import ru.eleventh.svmd.model.TransformationResult
import java.time.Instant
import java.time.Instant.now

object CacheService {
    private val client = HttpClient(CIO) { followRedirects = true }

    // (spreadsheetId, (cachedAt, transformationResult))
    private val cache = HashMap<String, Pair<Instant, TransformationResult>>()

    suspend fun getMap(identifier: String): Pair<Instant, TransformationResult> {
        val spreadsheetId = MapService.getSpreadsheetId(identifier)
        val cachedMap = cache[spreadsheetId]
        return (if (cachedMap?.first?.isAfter(now().minusSeconds(Config.cacheLifetime)) == true) {
            cachedMap.first to cachedMap.second
        }
        else {
            val csv = downloadSpreadsheet(spreadsheetId)
            val map = TransformService.transform(csv)
            val now = now()
            cache[spreadsheetId] = now to map
            now to map
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
            HttpStatusCode.NotFound -> throw RuntimeException(TransformErrors.NO_TABLE_EXIST)
            HttpStatusCode.Unauthorized, HttpStatusCode.BadRequest -> throw RuntimeException(TransformErrors.NO_TABLE_PERMISSION)
            HttpStatusCode.Gone -> throw RuntimeException(TransformErrors.TABLE_WAS_DELETED)
            else -> throw RuntimeException(TransformErrors.BAD_GOOGLE_RESPONSE(response.status))
        }
    }
}