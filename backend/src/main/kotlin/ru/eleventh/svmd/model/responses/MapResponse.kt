package ru.eleventh.svmd.model.responses

import FeatureCollection
import ru.eleventh.svmd.model.Column
import ru.eleventh.svmd.model.db.MapMeta
import ru.eleventh.svmd.model.enums.Directive

open class MapResponse(
    success: Boolean,
)

class FailResponse(
    success: Boolean,
    reason: String
) : MapResponse(success)

class SuccessResponse(
    success: Boolean,
    errors: List<String>,
    warnings: List<String>,
    metadata: MapMeta,
    directives: Map<Directive, Column>,
    collection: FeatureCollection
) : MapResponse(success)
