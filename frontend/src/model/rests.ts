import {Directive, IFeatureCollection, IMapMeta} from './model'

export type IApiResponse<T> = ISuccessResponse<T> | IFailResponse;

export type IFailResponse = {
    success: false
    errors: string[];
    warnings?: string[];
}

export type ISuccessResponse<T> = {
    success: true;
    warnings?: string[];
    body: T
};

export type ConvertedMap = {
    metadata: IMapMeta;
    directives: Map<Directive, string[]>
    geojson: IFeatureCollection
}
