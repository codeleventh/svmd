package ru.eleventh.svmd.services

import ru.eleventh.svmd.exceptions.SvmdException
import ru.eleventh.svmd.model.ApiErrors
import ru.eleventh.svmd.model.db.NewUser
import ru.eleventh.svmd.model.db.User

object UserService {
     fun createUser(newUser: NewUser): Long? = dao.createUser(newUser)

    fun getUserById(id: Long): User? {
        return dao.getUser(id)
    }

     fun getUserByEmail(email: String): User? {
        return dao.getUserByEmail(email)
    }

     fun updateUser(id: Long, user: User): Boolean {
        if (id != user.id)
            throw SvmdException(ApiErrors.IDS_DONT_MATCH)
        return dao.updateUser(user) == 1
    }
}