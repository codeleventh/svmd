package ru.eleventh.svmd

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import ru.eleventh.svmd.model.db.MapsTable
import ru.eleventh.svmd.model.db.UsersTable

object DatabaseConnection {
    private val hikariDataSource = HikariDataSource(HikariConfig().apply {
        driverClassName = "org.postgresql.Driver"
        jdbcUrl = "jdbc:postgresql://${Config.databaseHost}/${Config.databaseName}"
        username = Config.databaseUsername
        password = Config.databasePassword
        maximumPoolSize = 8
        isAutoCommit = false
        transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        validate()
    })

    fun init() {
        val database = Database.connect(hikariDataSource)
        transaction(database) {
            SchemaUtils.create(MapsTable, UsersTable)
        }
    }

    fun <T> dbQuery(fn: () -> T): T = transaction { fn() }
}