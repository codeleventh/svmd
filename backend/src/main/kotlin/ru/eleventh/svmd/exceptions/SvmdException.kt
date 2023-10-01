package ru.eleventh.svmd.exceptions

import ru.eleventh.svmd.model.responses.FailResponse

class SvmdException(val errors: List<String>, val warnings: List<String>) : RuntimeException() {

    constructor(errors: String) : this(listOf(errors), emptyList<String>())

    fun toResponse(): FailResponse = FailResponse(errors, warnings)
}