package ru.eleventh.svmd

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties
import ru.eleventh.svmd.model.db.MapsTable
import ru.eleventh.svmd.model.db.UsersTable

object DatabaseConnection {

    private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    private val databasePath = "jdbc:sqlite:file:" + appConfig.getProperty("svmd.db.path")
    // TODO: setup property readers

    fun init() {
        val database = Database.connect(databasePath, "org.sqlite.JDBC")
        transaction(database) {
            SchemaUtils.create(MapsTable, UsersTable)
        }
    }
    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}