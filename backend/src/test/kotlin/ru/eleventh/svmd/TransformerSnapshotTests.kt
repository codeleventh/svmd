package ru.eleventh.svmd

import kotlin.test.Test

class TransformerSnapshotTests : SnapshotTest() {

    @Test
    fun `Empty table`() {
        val csv = ""
        assert.matchWithSnapshot(transform(csv), "empty_table")
    }

    @Test
    fun `No coordinates directive`() {
        val csv = "column one,column two, card #CARD_INFO\n" +
                "val, val, some_value"
        assert.matchWithSnapshot(transform(csv), "no_coordinates_directive")
    }

    @Test
    fun `Excess coordinates directive`() {
        val csv = "coords #COORDINATES,\"more coords #COORDINATES\", more coords for the god of coords #COORDINATES\n" +
                "\"[5,15]\",\"[10,20]\",\"[30,40]\""
        assert.matchWithSnapshot(transform(csv), "excess_coordinates_directive")
    }

    @Test
    fun `Multiple directives in same column`() {
        val csv = "coords #COORDINATES #COORDINATES #COORDINATES #COORDINATES, " +
                "name #NAME #NAME #NAME, col #COLOR #COLOR, \n" +
                "\"[0,0]\",some name, red"
        assert.matchWithSnapshot(transform(csv), "multiple_directives_in_same_column")
    }

    @Test
    fun `Different coordinates values`() {
        val csv = "coords #COORDINATES\n" +
                "\n" +
                "\"[0]\"\n" +
                "\"[0,0]\"\n" +
                "\"[0,0,0]\"\n" +
                "\"[0a,0]\"\n" +
                "\"[0.0,0.0]\"\n" +
                "\"[0.0123456789,0.00123456789]\"\n" +
                "\"[0.0,0.0\"\n" +
                "\"[]\"\n" +
                "\"[[]]\"\n" +
                "\"[[[]]]\"\n" +
                "\"[[[0,0]]]\"\n" +
                "\"[[[0,0],[0,0]]]\"\n" +
                "\"[[[0,0],[0,1],[1,0]],[[10,0],[0,10],[10,10]]]\"\n"
        assert.matchWithSnapshot(transform(csv), "different_coordinates_values")
    }

    @Test
    fun `No data lines in table`() {
        val csv = "name #NAME, address #CARD_INFO, tag #FILTER_SELECT, coords #COORDINATES, \n"
        assert.matchWithSnapshot(transform(csv), "no_data_lines_in_table")
    }

    @Test
    fun `Values which index exceeds column count`() {
        val csv = "coords #COORDINATES,a,b,c,d,e,f,g\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,\n" +
                "\"[0,0]\",,,,,,,,,,,,,,,,,,some accidentally pasted text\n"
        assert.matchWithSnapshot(transform(csv), "values_which_index_exceeds_column_count")
    }

    @Test
    fun `Multiple columns with same name`() {
        val csv = "coords #COORDINATES, name #NAME, name  \n  , name #FILTER_SELECT, name (not used), name \t\n" +
                "\"[0,0]\", name, name, name, name, name, name"
        assert.matchWithSnapshot(transform(csv), "multiple_columns_with_same_name")
    }

    @Test
    fun `Many columns with same directives`() {
        val csv = "coords #COORDINATES, name1 #NAME, name2 #NAME, color1 #COLOR, " +
                "color2 #COLOR, filter_select1 #FILTER_SELECT, filter_select2 #FILTER_SELECT, " +
                "filter_range1 #FILTER_RANGE, filter_range2 #FILTER_RANGE, filter_slider1 #FILTER_SLIDER, " +
                "filter_slider2 #FILTER_SLIDER, footer_slider1 #FOOTER_SLIDER, footer_slider2 #FOOTER_SLIDER," +
                "footer_legend1 #FOOTER_LEGEND, footer_legend2 #FOOTER_LEGEND, search1 #SEARCH, search2 #SEARCH," +
                "card_preview1 #CARD_PREVIEW, card_preview2 #CARD_PREVIEW, card_info1 #CARD_INFO, card_info2 #CARD_INFO" +
                "card_text1 #CARD_TEXT, card_text2 #CARD_TEXT, card_link1 #CARD_LINK, card_link2 #CARD_LINK\n" +
                "\"[0,0]\",\"[0,0]\",a,a,red,red,b,b,0,0,0,0,0,0,0,0,g,g,h,h,i,i,j,j,k,k"
        assert.matchWithSnapshot(transform(csv), "many_columns_with_same_directives")
    }

    @Test
    fun `Too much objects`() {
        val csv = "coords #COORDINATES, name #NAME\n" +
                "\"[0.0]\", A,\n".repeat(3000)
        assert.matchWithSnapshot(transform(csv), "too_much_objects")
    }

    @Test
    fun `All features was rejected`() {
        val csv = "coords #COORDINATES, name #NAME\n" +
                "123, this entity will be rejected while parsing,\n" +
                "\"[[[[0, 0]]]]\", this entity will be rejected too,\n"
        assert.matchWithSnapshot(transform(csv), "all_features_was_rejected")
    }

    @Test
    fun `Correct columns with filter`() {
        val csv = "coords #COORDINATES, val1 #FILTER_RANGE, val2 #FILTER_SLIDER, val3 #FOOTER_SLIDER, " +
                "val4 #FILTER_RANGE, val5 #FILTER_SLIDER, val6 #FOOTER_SLIDER, \n" +
                "\"[0, 0]\",  ,  ,  ,           ,           ,            \n" +
                "\"[0, 0]\", 0, 0, 0, 01.01.2020, 01.01.2020, 01.01.2020 \n" +
                "\"[0, 0]\", 0, 0, 0, 01.01.2020, 01.01.2020, 01.01.2020 \n" +
                "\"[0, 0]\", 0, 0, 0, 01.01.2020, 01.01.2020, 01.01.2020 \n"
        assert.matchWithSnapshot(transform(csv), "correct_columns_with_filter")
    }

    @Test
    fun `Mixed value types in filter columns`() {
        val csv = "coords #COORDINATES, val1 #FILTER_RANGE, val2 #FILTER_SLIDER, val3 #FOOTER_SLIDER\n" +
                "\"[0, 0]\", 0,          0,           0,           \n" +
                "\"[0, 0]\", 1,          1,           1,           \n" +
                "\"[0, 0]\", 2,          2,           2,           \n" +
                "\"[0, 0]\", 03.03.2013, 03.03.2013,  03.03.2013,  \n" +
                "\"[0, 0]\", 4,          4,           4,           \n"
        assert.matchWithSnapshot(transform(csv), "mixed_value_types_in_filter_columns")
    }

    @Test
    fun `Columns with filter combinations`() {
        val csv = "coords #COORDINATES, val1 #FILTER_SELECT #FILTER_SLIDER, val2 #FILTER_SELECT " +
                "#FOOTER_SLIDER, val3 #FILTER_SELECT #FILTER_RANGE, " +
                "val4 #FOOTER_SLIDER #FILTER_SLIDER, val5 #FILTER_RANGE #FILTER_SLIDER, " +
                "val6 #FILTER_SELECT #FOOTER_SLIDER #FILTER_SLIDER #FILTER_RANGE\n" +
                "\"[0, 0]\", 0, 0, 0, 0, 0, 0, \n" +
                "\"[0, 0]\", 0, 0, 0, 0, 0, 0, \n"
        assert.matchWithSnapshot(transform(csv), "columns_with_filter_combinations")
    }
}