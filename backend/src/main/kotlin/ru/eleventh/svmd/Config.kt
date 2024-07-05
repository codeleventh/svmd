package ru.eleventh.svmd

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory

object Config {
    private val config: Config = ConfigFactory.load()
    val maxObjects = config.getInt("svmd.maxobjects")
    val cacheLifetime = config.getLong("svmd.cache.lifetime")
    val databaseHost: String = config.getString("svmd.db.host")
    val databaseName: String = config.getString("svmd.db.name")
    val databaseUsername: String = config.getString("svmd.db.username")
    val databasePassword: String = config.getString("svmd.db.password")
    val encryptionKey: String = config.getString("svmd.session.encryptionkey")
    val signKey: String = config.getString("svmd.session.signkey")
    val version: String = "?"
}