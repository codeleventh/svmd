package ru.eleventh.svmd.services

import ru.eleventh.svmd.exceptions.SvmdException
import ru.eleventh.svmd.model.ApiErrors
import ru.eleventh.svmd.model.db.NewUser
import ru.eleventh.svmd.model.db.User

object UserService {
    suspend fun createUser(newUser: NewUser): Long? = dao.createUser(newUser)

    suspend fun getUsers(): List<User> = dao.getUsers()

    suspend fun getUser(id: Long): User {
        val result = dao.getUser(id)
        if (result != null) return result
        else throw SvmdException(ApiErrors.NOT_FOUND)
    }

    suspend fun updateUser(id: Long, user: User): Boolean {
        if (id != user.id)
            throw SvmdException(ApiErrors.IDS_DONT_MATCH)
        return dao.updateUser(user) == 1
    }
}