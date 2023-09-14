package ru.eleventh.svmd.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.http.*
import org.slf4j.LoggerFactory
import ru.eleventh.svmd.model.Errors

object GoogleIntegrationService {

    private val client = HttpClient(CIO) { followRedirects = true }
    private val logger = LoggerFactory.getLogger("GoogleIntegration")

    suspend fun downloadMap(spreadSheetId: String): String {
        val response = client.get {
            method = HttpMethod.Get
            url("https://docs.google.com/spreadsheets/d/e/$spreadSheetId/pub?output=csv")
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