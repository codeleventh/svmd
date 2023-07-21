package ru.eleventh.svmd.services

import io.ktor.util.logging.*
import org.jetbrains.kotlin.konan.properties.loadProperties
import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.sql.Statement
import java.util.*

object PersistenceService {

    private val logger = KtorSimpleLogger(PersistenceService.javaClass.name)

    private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
    private val databasePath = appConfig.getProperty("svmd.db.path")

    private lateinit var connection: Connection

    private fun initSchema() = run {
        val statement: Statement = connection.createStatement()

        statement.executeUpdate(
            "CREATE TABLE users(\n" +
                    "    id          INTEGER     PRIMARY KEY AUTOINCREMENT,\n" +
                    "    email       VARCHAR     NOT NULL    UNIQUE,\n" +
                    "    password    VARCHAR     NOT NULL\n" +
                    ")"
        )
        statement.executeUpdate(
            "CREATE TABLE spreadsheets(\n" +
                    "    id          INTEGER     PRIMARY KEY    AUTOINCREMENT,\n" +
                    "    identifier  VARCHAR     NOT NULL       UNIQUE,\n" +
                    "    raw_csv     TEXT        NOT NULL,\n" +
                    "    geojson     TEXT        NOT NULL,\n" +
                    "    updated_at  TIMESTAMP   NOT NULL\n" +
                    ")"
        )

        statement.executeUpdate(
            "CREATE TABLE maps(\n" +
                    "    id              INTEGER     PRIMARY KEY AUTOINCREMENT,\n" +
                    "    identifier      VARCHAR     NOT NULL,\n" +
                    "    center          VARCHAR,\n" +
                    "    bounds          VARCHAR,\n" +
                    "    createdAt       TIMESTAMP,\n" +
                    "    modifiedAt      TIMESTAMP,\n" +
                    "    svmdVersion     VARCHAR,\n" +
                    "    lang            VARCHAR,\n" +
                    "    logo            VARCHAR,\n" +
                    "    lang            VARCHAR,\n" +
                    "    spreadsheet_id  INTEGER,\n" +
                    "    owner_id        INTEGER,\n" +
                    "FOREIGN KEY (owner_id) REFERENCES users(id),\n" +
                    "FOREIGN KEY (spreadsheet_id) REFERENCES spreadsheets(id)\n" +
                    ")"
        )
    }

    fun init() = run {
        try {
            connection = DriverManager.getConnection("jdbc:sqlite:$databasePath")
            val statement: Statement = connection.createStatement()

            val isDbInitialized = statement.execute("SELECT * FROM sqlite_master WHERE type='table' AND name='users'")
            if (!isDbInitialized) initSchema()
        } catch (e: SQLException) {
            logger.error(e.message)
        } finally {
            try {
                connection.close()
            } catch (e: SQLException) {
                logger.error(e.message)
            }
        }
    }
}
