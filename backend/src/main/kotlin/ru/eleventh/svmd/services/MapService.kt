package ru.eleventh.svmd.services

object MapService {

    private const val UPPER_BOUND = 1099511627776 // (2^4)^8
    private const val ZEROS_STR = "00000000"

    private val rand = Random(Instant.now().epochSecond)

    /***
     * Map identifier is an alphanumeric string that consists of 8 characters
     * It generated randomly and there are no collision check for two reasons:
     * 1. Given the planned amount of maps it's nearly impossible
     * 2. It will violate `UNIQUE` constraint anyway — user will just make another try
     */
    private fun newIdentifier(): String {
        val number = (rand.nextLong() % UPPER_BOUND).absoluteValue
        val string = number.toString(32).uppercase()
        return ZEROS_STR.take(8 - string.length) + string
    }

    fun generateIdentifier(): String = newIdentifier() // TODO: isExist check

    fun createMap(): Nothing = TODO()

    fun getMap(spreadSheetId: String): Nothing = TODO()

    fun updateMap(): Nothing = TODO()

    fun deleteMap(): Nothing = TODO()
}