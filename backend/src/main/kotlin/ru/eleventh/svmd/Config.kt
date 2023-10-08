package ru.eleventh.svmd

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory

object Config {
    private val config: Config = ConfigFactory.load()

    const val maxObjects = 2048
    const val cacheLifetime = 300L
    const val databasePath = ".././database.sqlite3"
    const val version = "?"
}