import {createSelector} from '@reduxjs/toolkit'
import {IStore} from './store'
import {allPass, defaultTo, equals, head, toPairs} from 'ramda'
import dayjs from 'dayjs'
import {Directive, IFeature} from './model'
import {DATE_FORMAT} from './const'
import {getTagsFromString} from "./util";

export const mapMetaSelector = createSelector(
    (state: IStore) => state,
    (state) => state.metadata
)
export const directivesSelector = createSelector(
    (state: IStore) => state,
    (state) => state.directives
)
export const featuresSelector = createSelector(
    (state: IStore) => state,
    (state) => state.features
)
export const filtersSelector = createSelector(
    (state: IStore) => state,
    (state) => state.filters
)
export const legendColorsSelector = createSelector(
    (state: IStore) => state,
    (state) => state.legendColors
)
export const legendHeaderSelector = createSelector(
    (state: IStore) => state,
    (state) => state.legendHeader
)
export const modalSelector = createSelector(
    (state: IStore) => state,
    (state) => state.modals
)

export const headerByDirectiveSelector = (dir: Directive) =>
    createSelector(directivesSelector, (directives) =>
        getHeaderByDirective(dir, directives)
    )
export const headersByDirectiveSelector = (dir: Directive) =>
    createSelector(directivesSelector, (directives) =>
        getHeadersByDirective(dir, directives)
    )

export const getHeadersByDirective: (dir: Directive, dirMap: Record<string, string[]>) => string[] =
    (dir, dirMap) => defaultTo([[], []], Object.entries(dirMap).find((entry) => equals(head(entry), dir)))[1]

export const getHeaderByDirective: (dir: Directive, dirMap: Record<string, string[]>) => string | null =
    (dir, dirMap) => head(getHeadersByDirective(dir, dirMap)) ?? null

export const filteredFeaturesSelector = createSelector(
    featuresSelector,
    filtersSelector,
    (features, filters) => {
        const {selects, ranges, sliders} = filters
        const predicates = [
            ...toPairs(selects).map(
                ([header, {isInit, value: selected}]) =>
                    (feature: IFeature) =>
                        isInit ||
                        getTagsFromString(feature.properties[header]).findIndex(
                            (s) => selected.indexOf(s) !== -1
                        ) !== -1
            ),
            ...toPairs(ranges).map(
                ([header, {isInit, isDate, value: [min, max]}]) => (feature: IFeature) => {
                    const value = feature.properties[header]
                    const num = isDate
                        ? dayjs(value, DATE_FORMAT, true).unix() : Number(value)
                    return isInit || (!!num && !isNaN(num) && min <= num && num <= max)
                }),
            ...toPairs(sliders).map(([header, {isInit, isDate, value: max}]) =>
                (feature: IFeature) => {
                    const value = feature.properties[header]
                    const num = isDate
                        ? dayjs(value, DATE_FORMAT, true).unix()
                        : Number(value)
                    return isInit || (!!num && !isNaN(num) && num <= max)
                }
            )
        ]

        return features.filter(allPass(predicates))
    }
)
