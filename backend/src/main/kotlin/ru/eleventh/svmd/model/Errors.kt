package ru.eleventh.svmd.model

import org.jetbrains.kotlin.konan.properties.Properties
import org.jetbrains.kotlin.konan.properties.loadProperties

private val appConfig: Properties = loadProperties("src/main/resources/application.properties")
private val maxObjects = appConfig.getProperty("svmd.maxobjects").toInt()

object Warns {
    fun WRONG_COORDINATES(index: Int) = "Строка №$index: координаты отсутствуют или заданы некорректно. Объект будет пропущен"
    fun DIRECTIVE_HAVE_MULTIPLE_COLUMNS(directive: String) =
        "Директива «${directive}» встречается больше, чем в одной колонке. Будет использована только первая из них"

    fun WRONG_VALUE(header: String) = "Значение колонки «${header}» некорректное и будет вырезано при конвертации"
    fun DUPLICATED_COLUMN(header: String) = "Несколько колонок с названием «${header}», будет взята только первая"
}

object Errors {
    fun NO_MAP() = "Не указан идентификатор карты"
    fun NO_MAP_EXIST() = "Не существует карты с таким идентификатором"
    fun NO_TABLE_EXIST() = "Не существует таблицы для карты с таким идентификатором"
    fun NO_TABLE_PERMISSION() = "Нет прав на чтение таблицы (требуется её публикация)"
    fun BAD_GOOGLE_RESPONSE() = "Не удалось выгрузить таблицу из Google Spreadsheets"
    fun NO_LINES() = "В таблице отсутствуют объекты"
    fun NO_GOOD_LINES() = "В таблице отсутствуют объекты после отфильтровки некорректно заполненных"
    fun MIXED_TYPES(header: String) =
        "Колонка «${header}» содержит смешанные значения (скорее всего, числа и даты вперемешку)"

    fun NO_COORDINATES() = "Отсутствует колонка с координатами"
    fun TOO_MUCH_COORDINATES() = "В таблице больше одной колонки с координатами"

    fun COLUMN_NAME_IS_EMPTY(index: Int) = "Колонка №${index+1} не имеет названия"
    fun COLUMN_NAME_IS_DUPLICATED(header: String) =
        "Имя колонки «${header}» дублируется (имена должны быть уникальными)"

    fun COLUMN_HAVE_MULTIPLE_FILTERS(header: String) = "В колонке «${header}» указано больше одного фильтра"

    fun TOO_MUCH_OBJECTS(amount: Long) =
        "Слишком много объектов в таблице ($amount). Максимальное разрешенное количество: $maxObjects"

    fun NO_BACKEND() = "Не удалось получить ответ от бэкенда"
    fun WHAT_THE_FUCK(error: Throwable) = "Неизвестная ошибка: (${error.message})"
}
