import {Directive, IFeatureCollection, IMapMeta} from '../model'

export type IApiResponse = IMapSuccessResponse | IFailResponse;

export type IFailResponse = {
    success: false
    errors: string[];
    warnings?: string[];
}

export type ISuccessResponse<T> = {
    success: true;
    body: T
};

export type ConvertedMap = {
    metadata: IMapMeta;
    directives: Map<Directive, string[]>
    geojson: IFeatureCollection
}

export type IMapSuccessResponse = ISuccessResponse<ConvertedMap> & {
    warnings?: string[];
}