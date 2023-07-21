package ru.eleventh.svmd.model

import Point
import ru.eleventh.svmd.model.enums.Lang
import ru.eleventh.svmd.model.enums.TileProvider
import java.time.Instant

data class Meta(
    val identifier: String, // example: W92S5539T
    val title: String,

    val center: Point?,
    val bounds: Pair<Point, Point>?,

    val createdAt: Instant,
    val modifiedAt: Instant,
    val svmdVersion: String,

    val lang: Lang?,
    val logo: Link?,
    val link: Link?,
    val defaultColor: Color?,
    val tileProvider: TileProvider,
)

