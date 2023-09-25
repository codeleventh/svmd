package ru.eleventh.svmd.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.jetbrains.exposed.sql.*
import ru.eleventh.svmd.DatabaseConnection.dbQuery
import ru.eleventh.svmd.SVMD_VERSION
import ru.eleventh.svmd.model.db.*
import ru.eleventh.svmd.model.enums.Lang
import ru.eleventh.svmd.model.enums.TileProvider
import java.time.Instant

val dao = PersistenceService()

class PersistenceService {

    private val mapper = jacksonObjectMapper()
    // TODO: sane (de)serialization

    private fun toMap(row: ResultRow): MapMeta = MapMeta(
        identifier = row[MapsTable.identifier],
        center = row[MapsTable.center]?.let { mapper.readValue(it) },
        title = row[MapsTable.title],
        createdAt = row[MapsTable.createdAt],
        lang = Lang.values().find { it.name == row[MapsTable.lang] },
        logo = row[MapsTable.logo],
        link = row[MapsTable.link],
        defaultColor = row[MapsTable.defaultColor],
        tileProvider = TileProvider.values().find { it.name == row[MapsTable.lang] },
    )

    private fun toUser(row: ResultRow): User {
        return User(
            id = row[UsersTable.id],
            email = row[UsersTable.email],
        )
    }

    suspend fun createMap(newIdentifier: String, newMap: NewMapMeta): String? {
        val insertStatement = dbQuery {
            MapsTable.insert {
                it[identifier] = newIdentifier
                it[title] = newMap.title
                it[center] = mapper.writeValueAsString(newMap.center)
                it[spreadsheetId] = newMap.spreadsheetId
                it[lang] = newMap.lang?.name
                it[logo] = newMap.logo
                it[link] = newMap.link
                it[defaultColor] = newMap.defaultColor
                it[tileProvider] = newMap.tileProvider?.name
                it[createdAt] = Instant.now()
                it[accessed] = 0
                it[svmdVersion] = SVMD_VERSION // TODO: use property
            }
        }
        return insertStatement.resultedValues?.singleOrNull()?.let(this::toMap)?.identifier
    }

    suspend fun getMaps(): List<MapMeta> = dbQuery {
        MapsTable.selectAll().map(this::toMap)
    }

    suspend fun getMap(identifier: String): MapMeta? = dbQuery {
        val result = MapsTable
            .select { MapsTable.identifier eq identifier }
            .singleOrNull()

        if (result != null) {
            MapsTable.update({ MapsTable.identifier eq result[MapsTable.identifier] }) {
                it[accessed] = result[accessed] + 1
                it[accessedAt] = Instant.now()
            }
        }

        result?.let { toMap(it) }
    }

    suspend fun getSpreadsheetId(identifier: String): String? = dbQuery {
        MapsTable
            .select { MapsTable.identifier eq identifier }
            .map { row -> row[MapsTable.spreadsheetId] }
            .singleOrNull()
    }

    suspend fun updateMap(map: MapMeta): Unit = dbQuery {
        MapsTable.update({ MapsTable.identifier eq map.identifier }) {
            it[title] = map.title
            it[center] = mapper.writeValueAsString(map.center)
            it[lang] = map.lang?.name
            it[logo] = map.logo
            it[link] = map.link
            it[defaultColor] = map.defaultColor
            it[tileProvider] = map.tileProvider?.name
        }
    }

    suspend fun createUser(newUser: NewUser): Long? {
        val insertStatement = dbQuery {
            UsersTable.insert { it[email] = newUser.email }
        }
        return insertStatement.resultedValues?.singleOrNull()?.let(this::toUser)?.id
    }

    suspend fun getUsers(): List<User> = dbQuery {
        UsersTable.selectAll().map(this::toUser)
    }

    suspend fun getUser(id: Long): User? = dbQuery {
        UsersTable
            .select { UsersTable.id eq id }
            .map(this::toUser)
            .singleOrNull()
    }

    suspend fun updateUser(user: User): Unit = dbQuery {
        UsersTable.update({ UsersTable.id eq user.id }) {
            it[email] = user.email
        }
    }
}

