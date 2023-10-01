package ru.eleventh.svmd.model

import mil.nga.sf.geojson.FeatureCollection
import ru.eleventh.svmd.model.db.MapMeta

data class TransformedMap(
    val metadata: MapMeta,
    val directives: Map<String, Set<String>>,
    val geojson: FeatureCollection
)

data class TransformedMapWithWarnings(
    val warnings: List<String>,
    val directives: Map<String, Set<String>>,
    val geojson: FeatureCollection
)