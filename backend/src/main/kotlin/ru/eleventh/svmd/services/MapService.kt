package ru.eleventh.svmd.services

object MapService {

    private val alphabet: List<Char> = ('A'..'Z') + ('0'..'9')

    private fun newIdentifier() = alphabet.shuffled().take(9).toString()

    fun generateIdentifier(): String = newIdentifier() // TODO: isExist check

    fun createMap(): Nothing = TODO()

    fun getMap(spreadSheetId: String): Nothing = TODO()

    fun updateMap(): Nothing = TODO()

    fun deleteMap(): Nothing = TODO()
}