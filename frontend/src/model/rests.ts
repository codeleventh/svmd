import {Directive, IFeatureCollection, IMapMeta} from './model'

export type IApiResponse<T> = (ISuccessResponse<T> | IFailResponse) & { warnings?: string[]; };

export type IFailResponse = { success: false, errors: string[]; }

export type ISuccessResponse<T> = { success: true, body: T };

export type ConvertedMap = {
    metadata: IMapMeta;
    directives: Map<Directive, string[]>
    geojson: IFeatureCollection
}
