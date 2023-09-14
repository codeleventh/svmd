package ru.eleventh.svmd.services

import Position
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import ru.eleventh.svmd.DatabaseConnection.dbQuery
import ru.eleventh.svmd.model.db.MapMeta
import ru.eleventh.svmd.model.db.MapsTable
import ru.eleventh.svmd.model.db.User
import ru.eleventh.svmd.model.db.UsersTable
import java.time.Instant

val dao = PersistenceService()

class PersistenceService {

    private val mapper = jacksonObjectMapper()
    // TODO: sane (de)serialization

    private fun toMap(row: ResultRow): MapMeta {
        val res: Position = mapper.readValue(row[MapsTable.center].orEmpty())
        return MapMeta(
            id = row[MapsTable.id],
            identifier = row[MapsTable.identifier],
            center = res,
            createdAt = row[MapsTable.createdAt]
        )
    }

    private fun toUser(row: ResultRow): User {
        return User(
            id = row[UsersTable.id],
            email = row[UsersTable.email],
        )
    }

    suspend fun getMaps(): List<MapMeta> = dbQuery {
        MapsTable.selectAll().map(this::toMap)
    }

    suspend fun getMapByIdentifier(identifier: String): MapMeta? = dbQuery {
        MapsTable
            .select { MapsTable.identifier eq identifier }
            .map(this::toMap)
            .singleOrNull()
    }

    suspend fun createMap(mapCenter: Position): MapMeta? {
        val insertStatement = dbQuery {
            MapsTable.insert {
                it[identifier] = MapService.generateIdentifier()
                it[center] = mapper.writeValueAsString(mapCenter)
                it[createdAt] = Instant.now()
            }
        }
        return insertStatement.resultedValues?.singleOrNull()?.let(this::toMap)
    }

    suspend fun getUsers(): List<User> = dbQuery {
        MapsTable.selectAll().map(this::toUser)
    }

    suspend fun getUserById(userId: Long): User? = dbQuery {
        UsersTable
            .select { UsersTable.id eq userId }
            .map(this::toUser)
            .singleOrNull()
    }

    suspend fun createUser(userEmail: String): User? {
        val insertStatement = dbQuery {
            UsersTable.insert { it[email] = userEmail }
        }
        return insertStatement.resultedValues?.singleOrNull()?.let(this::toUser)
    }
}

