package ru.eleventh.svmd.model.responses

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import mil.nga.sf.geojson.FeatureCollection
import ru.eleventh.svmd.model.db.MapMeta


open class MapResponse(success: Boolean) {
    @JsonSerialize
    private val success = success
}

class MapResponseSuccess(
    warnings: List<String>,
    metadata: MapMeta,
    directives: Map<String, Iterable<String>>,
    geojson: FeatureCollection,
) : MapResponse(true) {
    @JsonSerialize
    private val warnings: List<String> = warnings

    @JsonSerialize
    private val geojson: FeatureCollection = geojson

    @JsonSerialize
    private val directives: Map<String, Iterable<String>> = directives

    @JsonSerialize
    private val metadata: MapMeta = metadata

}

class MapResponseFail(errors: List<String>, warnings: List<String>) : MapResponse(false) {
    @JsonSerialize
    private val errors: List<String> = errors

    @JsonSerialize
    private val warnings: List<String> = warnings
}
