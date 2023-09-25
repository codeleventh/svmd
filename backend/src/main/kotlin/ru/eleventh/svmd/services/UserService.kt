package ru.eleventh.svmd.services

import ru.eleventh.svmd.model.db.NewUser
import ru.eleventh.svmd.model.db.User

object UserService {
    suspend fun createUser(newUser: NewUser): Long? = dao.createUser(newUser)

    suspend fun getUsers(): List<User> = dao.getUsers()

    suspend fun getUser(id: Long): User? = dao.getUser(id)

    suspend fun updateUser(id: Long, user: User): Unit = dao.updateUser(user)
}