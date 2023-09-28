import {Directive, IFeatureCollection, IMapMeta} from '../model'

export type IApiResponse = ISuccessResponse | IErrorResponse;

export type ISuccessResponse = {
    success: true;
    warnings?: string[];
    metadata: IMapMeta;
    directives: Map<Directive, string[]>
    geojson: IFeatureCollection
};

export interface IErrorResponse {
    success: false;
    errors: string[];
}
