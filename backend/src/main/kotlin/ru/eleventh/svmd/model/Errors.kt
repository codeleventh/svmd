package ru.eleventh.svmd.model

import io.ktor.http.*
import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties

private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
private val maxObjects = appConfig.getProperty("svmd.maxobjects").toInt()

object Warns {
    val WRONG_COORDINATES = { index: Int ->
        "Строка №${index + 2}: координаты отсутствуют или заданы некорректно (объект будет пропущен)"
        // ↑ +1 for natural indexing, +1 for header line that we're not iterating
    }
}

object Errors {
    const val NO_MAP = "Не указан идентификатор карты"
    const val NO_MAP_EXIST = "Не существует карты с таким идентификатором"
    const val NO_TABLE_EXIST = "Не существует таблицы для карты с таким идентификатором"
    const val NO_TABLE_PERMISSION = "Нет прав на чтение данных (таблица не была опубликована)"
    const val TABLE_WAS_DELETED = "Таблица была удалена из Google Spreadsheets"
    val BAD_GOOGLE_RESPONSE =
        { code: HttpStatusCode -> "Не удалось выгрузить таблицу из Google Spreadsheets (код ответа: ${code})" }

    const val NO_LINES = "В таблице отсутствуют объекты"
    const val NO_GOOD_LINES = "В таблице отсутствуют объекты после отфильтровки некорректно заполненных"

    val COLUMN_NAME_IS_DUPLICATED = { head: String ->
        "Имя колонки «${head}» повторяется (имена должны быть уникальными)"
    }

    val DIRECTIVE_ON_MULTIPLE_COLUMNS = { dir: String ->
        "Директива ${dir} не должна использоваться в нескольких колонках"
    }
    const val NO_COORDINATES = "Отсутствует колонка с координатами"
    const val TOO_MUCH_COORDINATES = "В таблице больше одной колонки с координатами"

    val MIXED_TYPES_IN_FILTERS = { head: String -> "Колонка «${head}» содержит числа и даты вперемешку" }
    val COLUMN_HAVE_MULTIPLE_FILTERS = { head: String ->
        "В колонке «${head}» указано больше одного фильтра"
    }

    val TOO_MUCH_OBJECTS = { cnt: Int ->
        "Слишком много объектов в таблице ($cnt), максимально разрешенное — $maxObjects"
    }

    val WHAT_THE_FUCK = { err: Throwable -> "Неизвестная ошибка: (${err.message})" }
}
