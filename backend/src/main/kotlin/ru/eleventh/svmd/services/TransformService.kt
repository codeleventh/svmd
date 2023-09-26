package ru.eleventh.svmd.services

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.StreamReadFeature
import com.fasterxml.jackson.dataformat.csv.CsvMapper
import com.fasterxml.jackson.dataformat.csv.CsvParser
import com.fasterxml.jackson.dataformat.csv.CsvSchema
import com.fasterxml.jackson.dataformat.csv.CsvSchema.Column
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import mil.nga.sf.geojson.*
import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties
import ru.eleventh.svmd.DATE_FORMAT
import ru.eleventh.svmd.exceptions.TransformException
import ru.eleventh.svmd.model.Errors
import ru.eleventh.svmd.model.TransformedMap
import ru.eleventh.svmd.model.Warns
import ru.eleventh.svmd.model.enums.Directive.*
import ru.eleventh.svmd.model.enums.Directives
import java.time.DateTimeException
import java.time.LocalDate
import java.time.format.DateTimeFormatter

object TransformService {

    private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    private val maxObjects = appConfig.getProperty("svmd.maxobjects").toInt()

    private val headerMapper = CsvMapper()
        .readerForListOf(String::class.java)
        .with(CsvParser.Feature.WRAP_AS_ARRAY)
        .with(CsvParser.Feature.ALLOW_TRAILING_COMMA)
        .with(CsvParser.Feature.SKIP_EMPTY_LINES)
        .with(CsvParser.Feature.TRIM_SPACES)

    private val entityMapper = CsvMapper()
        .readerForMapOf(String::class.java)
        .with(CsvParser.Feature.EMPTY_STRING_AS_NULL)
        .with(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE)
        .with(CsvParser.Feature.ALLOW_TRAILING_COMMA)
        .with(CsvParser.Feature.TRIM_SPACES)

    fun transform(csv: String): TransformedMap {
        val errors = mutableListOf<String>()
        val warns = mutableListOf<String>()

        try {
            if (csv.isEmpty()) {
                errors.add(Errors.NO_LINES)
                throw TransformException()
            }

            val rawHeaders = headerMapper
                .readValues<List<String>>(csv)
                .next()

            // (column_index -> (rawHeader, refinedHeader)
            // example: (2 -> ("Building address #CARD_INFO #SEARCH", "Building address"))
            val headersMap = HashMap<Int, Pair<String, String>>()

            // (directive -> [column...])
            // example: ("#FILTER_SELECT" -> ["Building type", "Building condition"])
            val directivesMap = HashMap<String, MutableSet<String>>()
            Directives.forEach { directivesMap[it] = mutableSetOf() }

            // Putting values to those maps
            val split = { h: String -> h.split(' ', '\t', '\n') }
            val refineHeader = { h: String ->
                split(h).filter { it.isNotEmpty() }.filterNot { Directives.contains(it) }.joinToString(" ")
            }
            rawHeaders.forEachIndexed { i, rawHeader ->
                val splitHeader = split(rawHeader)
                val refinedHeader = refineHeader(rawHeader)
                splitHeader.forEach {
                    if (Directives.contains(it))
                        if (refinedHeader.isEmpty())
                            errors += Errors.COLUMN_NAME_IS_EMPTY(i)
                        else directivesMap[it]!!.add(refinedHeader)
                }
                if (directivesMap.values.flatten().contains(refinedHeader)) headersMap[i] = rawHeader to refinedHeader
            }

            if (directivesMap[COORDINATES.directive]!!.size == 0) {
                errors += Errors.NO_COORDINATES
                throw TransformException()
            } else if (directivesMap[COORDINATES.directive]!!.size > 1) {
                errors += Errors.TOO_MUCH_COORDINATES
                throw TransformException()
            }

            listOf(CARD_LINK, COLOR, CARD_TEXT, NAME).map { it.directive }.forEach {
                if (directivesMap[it]!!.size > 1) errors += Errors.DIRECTIVE_ON_MULTIPLE_COLUMNS(it)
            }
            headersMap.values.map { it.second }.groupingBy { it }.eachCount().entries
                .filter { it.value > 1 }
                .forEach { errors += Errors.COLUMN_NAME_IS_DUPLICATED(it.key) }

            val headerSchema = CsvSchema.builder()
                .setUseHeader(true)
                .setReorderColumns(true)
                .addColumns(headersMap.entries.map { Column(it.key, it.value.second) }).build()
            val entities = entityMapper
                .withFeatures(JsonParser.Feature.IGNORE_UNDEFINED).with(StreamReadFeature.IGNORE_UNDEFINED)
                .with(headerSchema.withNullValue(null))
            val features = entities
                .readValues<Map<String, String>>(csv)
                .readAll()

            if (features.isEmpty())
                errors.add(Errors.NO_LINES)
            else if (features.size >= maxObjects) {
                errors.add(Errors.TOO_MUCH_OBJECTS(features.size))
                throw TransformException()
            }

            val columnsWithFilters =
                listOf(FILTER_RANGE, FILTER_SELECT, FILTER_SLIDER, FOOTER_SLIDER).map { directivesMap[it.directive]!! }
            columnsWithFilters.flatten().groupingBy { it }.eachCount().entries.filter { it.value > 1 }.forEach {
                errors += Errors.COLUMN_HAVE_MULTIPLE_FILTERS(it.key)
            }

            val coordinatesHeader = directivesMap[COORDINATES.directive]!!.first()
            val coordinatesHeaderIndex = headersMap.entries.find { it.value.second == coordinatesHeader }!!.key
            val validatedFeatures = features.mapIndexed { i, feature ->
                val coordinates = validateCoordinates(feature[headersMap[coordinatesHeaderIndex]!!.first])
                if (coordinates == null) {
                    warns.add(Warns.WRONG_COORDINATES(i))
                    null
                } else {
                    val resultFeature = Feature(coordinates)
                    // cloning feature object with refined parameters names and omitting coordinates param
                    val props = feature.entries
                        .mapIndexed { index, entry ->
                            if (headersMap[index] != null) {
                                if (headersMap[index]!!.second != coordinatesHeader) {
                                    headersMap[index]!!.second to entry.value
                                } else null
                            } else null
                        }
                        .filterNotNull()
                        .associate { it.first to it.second }
                    resultFeature.properties = props
                    resultFeature
                }
            }.filterNotNull()

            columnsWithFilters.flatten().toSet().forEach { header ->
                val values = validatedFeatures.mapNotNull { it.properties[header] }.map { it.toString() }
                val isHaveNumbers = { values.find { v -> v.toDoubleOrNull() != null } }
                val isHaveDates = {
                    values.find { v ->
                        try {
                            LocalDate.parse(v, DateTimeFormatter.ofPattern(DATE_FORMAT))
                            true
                        } catch (e: DateTimeException) {
                            false
                        }
                    }
                }
                if (isHaveNumbers() != null && isHaveDates() != null)
                    errors += Errors.MIXED_TYPES_IN_FILTERS(header)
            }

            if (validatedFeatures.isEmpty() && features.isNotEmpty())
                errors.add(Errors.NO_GOOD_LINES)
            return if (errors.isNotEmpty()) throw TransformException(errors) else
                TransformedMap(warns, directivesMap, FeatureCollection(validatedFeatures))
        } catch (e: Exception) {
            throw TransformException(errors)
        }
    }

    private fun validateCoordinates(value: String?): Geometry? {
        // TODO: should be reimplemented, performance issues are expected
        if (value == null) return null
        return try {
            val coordinates = jacksonObjectMapper().readerForListOf(Double::class.java).readValue<List<Double>>(value)
            if (coordinates.size == 2) Point(Position(coordinates.first(), coordinates.last()))
            else null
        } catch (e: Exception) {
            try {
                val res =
                    jacksonObjectMapper().readerForListOf(List::class.java).readValue<List<List<List<Double>>>>(value)
                val isValid = res.find { it.size != 1 || it.find { p -> p.size != 2 } != null } == null
                if (isValid) Polygon.fromCoordinates(res.map { it.map { x -> Position(x.first(), x.last()) } })
                else null
            } catch (e: Exception) {
                return null
            }
        }
    }
}
