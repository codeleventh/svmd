package ru.eleventh.svmd.model.enums

enum class Directive(val directive: String) {
    NAME("#NAME"),
    COLOR("#COLOR"),
    COORDINATES("#COORDINATES"),
    FILTER_SELECT("#FILTER_SELECT"),
    FILTER_RANGE("#FILTER_RANGE"),
    FILTER_SLIDER("#FILTER_SLIDER"),
    FOOTER_SLIDER("#FOOTER_SLIDER"),
    FOOTER_LEGEND("#FOOTER_LEGEND"),
    SEARCH("#SEARCH"),
    CARD_PREVIEW("#CARD_PREVIEW"),
    CARD_INFO("#CARD_INFO"),
    CARD_TEXT("#CARD_TEXT"),
    CARD_LINK("#CARD_LINK"),
}

