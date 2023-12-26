package ru.eleventh.svmd.model.db

import org.jetbrains.exposed.sql.Table

data class NewUser(val email: String, val password: String)

data class User(val id: Long, val email: String, val password: String)

object UsersTable : Table() {
    val id = long("id").autoIncrement()
    val email = text("email").uniqueIndex()
    val password = text("password")

    override val primaryKey = PrimaryKey(id)
}