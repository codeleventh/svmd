package ru.eleventh.svmd.model.db

import Position
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

data class NewMapMeta(val spreadsheetId: String, val center: Position?)

data class MapMeta(
    val identifier: String, // example: W92S553T
    val spreadsheetId: String,
    val center: Position?,
    val createdAt: Instant
    // val title: String,
    // val bounds: BoundingBox?,
    // val modifiedAt: Instant,
    // val svmdVersion: String,
    // val lang: Lang?,
    // val logo: Link?,
    // val link: Link?,
    // val defaultColor: Color?,
    // val tileProvider: TileProvider,
)

object MapsTable : Table() {
    val identifier = text("identifier")
    val spreadsheetId = text("spreadsheet_id")
    val center = text("center").nullable()
    val createdAt = timestamp("created_at")

    override val primaryKey = PrimaryKey(identifier)
}