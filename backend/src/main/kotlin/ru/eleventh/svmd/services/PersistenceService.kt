package ru.eleventh.svmd.services

import Position
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.jetbrains.exposed.sql.*
import ru.eleventh.svmd.DatabaseConnection.dbQuery
import ru.eleventh.svmd.model.db.*
import java.time.Instant

val dao = PersistenceService()

class PersistenceService {

    private val mapper = jacksonObjectMapper()
    // TODO: sane (de)serialization

    private fun toMap(row: ResultRow): MapMeta {
        val res: Position? = row[MapsTable.center]?.let { mapper.readValue(it) }
        return MapMeta(
            identifier = row[MapsTable.identifier],
            center = res,
            spreadsheetId = row[MapsTable.spreadsheetId],
            createdAt = row[MapsTable.createdAt]
        )
    }

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
                it[center] = mapper.writeValueAsString(newMap.center)
                it[spreadsheetId] = newMap.spreadsheetId
                it[createdAt] = Instant.now()
            }
        }
        return insertStatement.resultedValues?.singleOrNull()?.let(this::toMap)?.identifier
    }

    suspend fun getMaps(): List<MapMeta> = dbQuery {
        MapsTable.selectAll().map(this::toMap)
    }

    suspend fun getMap(identifier: String): MapMeta? = dbQuery {
        MapsTable
            .select { MapsTable.identifier eq identifier }
            .map(this::toMap)
            .singleOrNull()
    }


    suspend fun updateMap(map: MapMeta): Unit = dbQuery {
        MapsTable.update({ MapsTable.identifier eq map.identifier }) {
            it[center] = mapper.writeValueAsString(map.center)
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

