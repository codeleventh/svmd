export type Point = [number, number];
export type Polygon = Point[][];
export type Coordinates = Point | Polygon;
export type GeometryType = 'Polygon' | 'Point';
export type Geometry = {
    type: GeometryType;
    coordinates: Coordinates;
};

export type Mark = { value: number, label?: number | string };
export type ValuesWithHeader = [string, string[]]; // unique normalized values got from feature by column name
export type FilterType = 'selects' | 'ranges' | 'sliders';
export type LegendColors = Record<string, string[]>;

