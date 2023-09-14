package ru.eleventh.svmd.model.db

import Position
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.timestamp
import java.time.Instant

data class MapMeta(
    val id: Long,
    val identifier: String, // example: W92S5539T
    val center: Position?,
    val createdAt: Instant
)

object MapsTable : Table() {
    val id = long("id").autoIncrement()
    val identifier = text("identifier")
    val center = text("center").nullable()
    val createdAt = timestamp("created_at")

    override val primaryKey = PrimaryKey(id)
}