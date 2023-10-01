package ru.eleventh.svmd.model

import mil.nga.sf.geojson.FeatureCollection
import ru.eleventh.svmd.model.db.MapMeta
import java.time.Instant

data class TransformedMap(
    val metadata: MapMeta,
    val transformedAt: Instant,
    val directives: Map<String, Set<String>>,
    val geojson: FeatureCollection
)

data class TransformationResult(
    val warnings: List<String>,
    val directives: Map<String, Set<String>>,
    val geojson: FeatureCollection
)