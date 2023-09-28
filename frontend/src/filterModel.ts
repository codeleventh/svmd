import {FilterType} from './types'

export type filterField<T> = {
    value: T
    isInit: boolean,
    isDate?: boolean,
}

export type filterChangeOptions<T> = {
    header: string,
    type: FilterType,
} & filterField<T>;

export interface IFilter {
    search?: string,
    selects: Record<string, filterField<string[]>>,
    ranges: Record<string, filterField<[number, number]>>,
    sliders: Record<string, filterField<number>>
}

export const INIT_FILTERS: IFilter = {
    search: undefined,
    selects: {},
    ranges: {},
    sliders: {}
}
