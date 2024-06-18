package ru.eleventh.svmd

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory

object Config {
    private val config: Config = ConfigFactory.load()
    val maxObjects = config.getInt("svmd.maxobjects")
    val cacheLifetime = config.getLong("svmd.cache.lifetime")
    val databaseHost = config.getString("svmd.db.host")
    val databaseName = config.getString("svmd.db.name")
    val databaseUsername = config.getString("svmd.db.username")
    val databasePassword = config.getString("svmd.db.password")
    val encryptionKey = config.getString("svmd.session.encryptionkey")
    val signKey = config.getString("svmd.session.signkey")
    val version = "?"
}