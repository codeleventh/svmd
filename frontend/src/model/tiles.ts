export enum TileProvider {
    OSM = 'OSM',
    NORD = 'NORD',
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    LIGHT_NO_LABELS = 'LIGHT_NO_LABELS',
    DARK_NO_LABELS = 'DARK_NO_LABELS',
    COLORFUL = 'COLORFUL',
    SATELLITE = 'SATELLITE',
}

export const resolveTile = (tileProvider: string) => {
    switch (tileProvider) {
        case TileProvider.OSM:
            return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        case TileProvider.NORD:
            return 'TODO: 1'
        case TileProvider.LIGHT:
            return 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        case TileProvider.DARK :
            return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
        case TileProvider.LIGHT_NO_LABELS :
            return 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png'
        case TileProvider.DARK_NO_LABELS :
            return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png'
        case TileProvider.COLORFUL :
            return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
        case TileProvider.SATELLITE :
            return 'TODO: 2'
        default :
            return 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
    }
}