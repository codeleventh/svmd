package ru.eleventh.svmd.model

import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties

private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
private val maxObjects = appConfig.getProperty("svmd.maxobjects").toInt()

object Warns {
    val WRONG_COORDINATES = { index: Int ->
        "Строка №$index: координаты отсутствуют или заданы некорректно, Объект будет пропущен"
    }
}

object Errors {
    const val NO_MAP = "Не указан идентификатор карты"
    const val NO_MAP_EXIST = "Не существует карты с таким идентификатором"
    const val NO_TABLE_EXIST = "Не существует таблицы для карты с таким идентификатором"
    const val NO_TABLE_PERMISSION = "Нет прав на чтение данных (таблица не была опубликована)"
    const val BAD_GOOGLE_RESPONSE = "Не удалось выгрузить таблицу из Google Spreadsheets"

    const val NO_LINES = "В таблице отсутствуют объекты"
    const val NO_GOOD_LINES = "В таблице отсутствуют объекты после отфильтровки некорректно заполненных"

    val COLUMN_NAME_IS_EMPTY = { index: Int ->
        "Колонка №${index + 1} не имеет названия"
    }
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
