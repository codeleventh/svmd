package ru.eleventh.svmd

import kotlinx.coroutines.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.*
import org.jetbrains.exposed.sql.transactions.experimental.*
import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties
import ru.eleventh.svmd.model.db.MapsTable

object DatabaseConnection {

    private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    private val databasePath = "jdbc:sqlite:file:" + appConfig.getProperty("svmd.db.path") // TODO:

    fun init() {
        val database = Database.connect(databasePath, "org.sqlite.JDBC")
        transaction(database) {
            SchemaUtils.create(MapsTable)
        }
    }
    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}