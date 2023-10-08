package ru.eleventh.svmd

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import ru.eleventh.svmd.model.db.MapsTable
import ru.eleventh.svmd.model.db.UsersTable

object DatabaseConnection {
    private val databasePath = "jdbc:sqlite:file:" + Config.databasePath

    fun init() {
        val database = Database.connect(databasePath, "org.sqlite.JDBC")
        transaction(database) {
            SchemaUtils.create(MapsTable, UsersTable)
        }
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}