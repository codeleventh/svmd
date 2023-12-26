package ru.eleventh.svmd.services

import ru.eleventh.svmd.exceptions.SvmdException
import ru.eleventh.svmd.model.ApiErrors
import ru.eleventh.svmd.model.TransformedMap
import ru.eleventh.svmd.model.db.MapMeta
import ru.eleventh.svmd.model.db.NewMap
import ru.eleventh.svmd.model.responses.ApiResponse
import ru.eleventh.svmd.model.responses.FailResponse
import ru.eleventh.svmd.model.responses.MapResponse
import java.time.Instant
import kotlin.math.absoluteValue
import kotlin.random.Random

object MapService {

    private const val UPPER_BOUND = 1099511627776 // (2^4)^8
    private const val ZEROS_STR = "00000000"

    private val rand = Random(Instant.now().epochSecond)

    /***
     * Map identifier is an alphanumeric string that consists of 8 characters
     * It generated randomly and there are no collision check for two reasons:
     * 1. Given the planned amount of maps it's nearly impossible
     * 2. It will violate `UNIQUE` constraint anyway — user will just make another try
     */
    private fun newIdentifier(): String {
        val number = (rand.nextLong() % UPPER_BOUND).absoluteValue
        val string = number.toString(32).uppercase()
        return ZEROS_STR.take(8 - string.length) + string
    }

    private fun isSpreadsheetValid(id: String): Boolean = id.matches(Regex("2PACX-[-_a-zA-Z0-9]{80}"))

    fun createMap(newMap: NewMap): String {
        if (!isSpreadsheetValid(newMap.spreadsheetId))
            throw SvmdException(ApiErrors.BAD_SPREADSHEET_ID)
        return dao.createMap(newIdentifier(), newMap)
    }

    fun getMapsByUser(userId: Long): List<MapMeta> {
        return dao.getMapsByUser(userId)
    }

    fun getMap(identifier: String): MapMeta {
        val result = dao.getMap(identifier)
        if (result != null) return result
        else throw SvmdException(ApiErrors.NO_MAP_EXIST)
    }

    fun getSpreadsheetId(mapId: String): String {
        val result = dao.getSpreadsheetId(mapId)
        if (result != null) return result
        else throw SvmdException(ApiErrors.NOT_FOUND)
    }

    fun updateMap(identifier: String, map: MapMeta): Boolean {
        if (identifier != map.identifier)
            throw SvmdException(ApiErrors.IDS_DONT_MATCH)
        return dao.updateMap(map) == 1
    }

    suspend fun convertMap(identifier: String): ApiResponse {
        return try {
            val metadata = getMap(identifier)
            val (transformedAt, transformedMap) = CacheService.getMap(identifier)
            val (warnings, directives, geojson) = transformedMap
            MapResponse(warnings, TransformedMap(metadata, transformedAt, directives, geojson))
        } catch (e: SvmdException) {
            FailResponse(e.errors, e.warnings)
        }
    }
}
