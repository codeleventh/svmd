package ru.eleventh.svmd.model.responses

import com.fasterxml.jackson.databind.annotation.JsonSerialize
import ru.eleventh.svmd.model.TransformedMap

open class ApiResponse(success: Boolean) {
    @JsonSerialize
    private val success = success
}

open class SuccessResponse<T>(body: T) : ApiResponse(true) {
    @JsonSerialize
    private val body = body
}

open class FailResponse(errors: List<String>, warnings: List<String> = emptyList()) : ApiResponse(false) {
    @JsonSerialize
    private val errors: List<String> = errors

    @JsonSerialize
    private val warnings: List<String> = warnings

    constructor(errors: String) : this(listOf(errors), emptyList<String>())
}

class MapResponse(
    warnings: List<String>,
    map: TransformedMap
) : SuccessResponse<TransformedMap>(map) {
    @JsonSerialize
    private val warnings: List<String> = warnings
}
