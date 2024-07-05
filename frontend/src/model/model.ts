import {Geometry, Point} from './types'

export enum Lang { RU, EN }

export enum TileProvider {
    OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    NORD = 'TODO: 1',
    LIGHT = 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    DARK = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    LIGHT_NO_LABELS = 'https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}.png',
    DARK_NO_LABELS = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
    COLORFUL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
    SATELLITE = 'TODO: 2',
}

export enum Directive {
    NAME = '#NAME',
    COLOR = '#COLOR',
    COORDINATES = '#COORDINATES',
    FILTER_SELECT = '#FILTER_SELECT',
    FILTER_RANGE = '#FILTER_RANGE',
    FILTER_SLIDER = '#FILTER_SLIDER',
    FOOTER_SLIDER = '#FOOTER_SLIDER',
    FOOTER_LEGEND = '#FOOTER_LEGEND',
    SEARCH = '#SEARCH',
    CARD_PREVIEW = '#CARD_PREVIEW',
    CARD_INFO = '#CARD_INFO',
    CARD_TEXT = '#CARD_TEXT',
    CARD_LINK = '#CARD_LINK',
}

export type INewMapMeta = {
    title: string;
    bounds: [Point, Point],
    center?: Point;
    lang?: Lang;
    logo?: string;
    link?: string;
    defaultColor?: string;
    theme: string; // TODO: types
    tileProvider?: string;
};

export type IMapMeta = INewMapMeta & {
    owner: number;
    identifier: string;
    createdAt: string;
};

export type IUser = {
    email: string
}

export type IFeature = {
    geometry: Geometry;
    properties: Record<string, string>;
};

export type IFeatureIndexed = IFeature & { index: number; };

export type IFeatureCollection = { features: IFeature[] };

export const Errors = {
    BACKEND_IS_UNAVAILABLE: (error: string) => `Не удалось получить ответ от бэкенда: ${error}`,
    BAD_BACKEND_RESPONSE: (error: string) => `Плохой ответ от бэкенда: ${error}`,
    FRONTEND_IS_BROKEN: (error: string) => `Приложение завершило работу с ошибкой: ${error}`,
}
