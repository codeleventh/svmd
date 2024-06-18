import {MantineThemeOverride} from "@mantine/styles/lib/theme/types";
import {TileProvider} from "../model/model";
import {DEFAULT_LEGEND_COLORS} from "../const";

type SvmdTheme = MantineThemeOverride & {
    defaultTileProvider: TileProvider
    svmdLogo: string // TODO:
    background: string,
    foreground: string,
    link: string,
    legendColors: string[]
}

export const DARK_THEME: SvmdTheme = {
    colorScheme: 'dark',
    primaryColor: 'indigo',
    svmdLogo: require('../img/logo-dark-48px.png'),
    foreground: '#c1c2c5',
    background: '#1a1b1e',
    link: '#748ffc',
    defaultTileProvider: TileProvider.DARK_NO_LABELS,
    legendColors: DEFAULT_LEGEND_COLORS
}

export const LIGHT_THEME: SvmdTheme = {
    colorScheme: 'light',
    primaryColor: "gray",
    colors: {"blue": ["#77a9ff", "#5594ff", "#3681ff", "#1a6fff", "#005fff", "#0056e6", "#004dcf", "#0045ba", "#003ea7", "#003896"]},
    svmdLogo: require('../img/logo-light-48px.png'),
    foreground: '#3e3d3a',
    background: '#fafaf8',
    link: '#2244ff',
    defaultTileProvider: TileProvider.LIGHT_NO_LABELS,
    legendColors: DEFAULT_LEGEND_COLORS
}

export const NORD_THEME: SvmdTheme = {
    colorScheme: "dark",
    primaryColor: "#88c0d0",
    colors: {"#88c0d0": ["#fff", "#fff", "#2e3440", "#3b4252", "#81a1c1", "#434c5e", "#fff", "#fff", "#4c566a", "#5e81ac"]},
    svmdLogo: require('../img/logo-nord-48px.png'),
    foreground: '#d8dee9',
    background: '#2e3440',
    link: '#81a1c1',
    defaultTileProvider: TileProvider.DARK_NO_LABELS,
    legendColors: ["#a3be8c", "#bf616a", "#ebcb8b", "#b48ead", "#d08770", "#88c0d0", "#81a1c1", "#8fbcbb", "#5e81ac"]
}

// TODO: чатсть вещей (например, поиск и фон модалки) всё равно стилизуются как DARK. ты ж там-от не задаешь цвета

export const DEFAULT_THEME = DARK_THEME;

export enum Theme { DEFAULT = "DEFAULT", DARK = "DARK", LIGHT = "LIGHT", NORD = "NORD" }

export const getTheme = (theme: string) => {
    switch (theme) {
        case "LIGHT":
            return LIGHT_THEME
        case "DARK":
            return DARK_THEME
        case "NORD":
            return NORD_THEME
        default:
            return DEFAULT_THEME
    }
}
