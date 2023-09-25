package ru.eleventh.svmd.model.db

import mil.nga.sf.geojson.Position
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp
import ru.eleventh.svmd.model.Color
import ru.eleventh.svmd.model.Link
import ru.eleventh.svmd.model.enums.Lang
import ru.eleventh.svmd.model.enums.TileProvider
import java.time.Instant

data class NewMapMeta(
    val spreadsheetId: String,
    val title: String,
    val center: Position?,
    val lang: Lang?,
    val logo: Link?,
    val link: Link?,
    val defaultColor: Color?,
    val tileProvider: TileProvider?
)

data class MapMeta(
    val identifier: String, // example: W92S553T
    val title: String,
    val center: Position?,
    val createdAt: Instant,
    val lang: Lang?,
    val logo: Link?,
    val link: Link?,
    val defaultColor: Color?,
    val tileProvider: TileProvider?,
)

object MapsTable : Table() {
    val identifier = text("identifier")
    val title = text("title")
    val center = text("center").nullable()
    val createdAt = timestamp("created_at")
    val lang = text("lang").nullable()
    val logo = text("logo").nullable()
    val link = text("link").nullable()
    val defaultColor = text("default_color").nullable()
    val tileProvider = text("tile_provider").nullable()
    // ↓ these fields shouldn't been sent on front-end side
    val spreadsheetId = text("spreadsheet_id")
    val svmdVersion = text("svmd_version")
    val accessed = integer("accessed")
    val accessedAt = timestamp("accessed_at").nullable()

    override val primaryKey = PrimaryKey(identifier)
}