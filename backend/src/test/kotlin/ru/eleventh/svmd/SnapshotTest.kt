package ru.eleventh.svmd

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.karumi.kotlinsnapshot.KotlinSnapshot
import com.karumi.kotlinsnapshot.core.SerializationModule
import ru.eleventh.svmd.exceptions.TransformException
import ru.eleventh.svmd.services.TransformService

open class SnapshotTest {

    val mapper: ObjectMapper = jacksonObjectMapper()

    val transform: (String) -> Any = { input ->
        try {
            TransformService.transform(input)
        } catch (e: TransformException) {
            e.errors
        }
    }

    val assert = KotlinSnapshot(object : SerializationModule {
        override fun serialize(value: Any?) =
            mapper.writeValueAsString(value)
    }, false, "src/test/kotlin")
}