import {createReducer} from '@reduxjs/toolkit'
import {INIT_FILTERS} from './filterModel'
import {Actions} from './actions'
import {always} from 'ramda'

const metaReducer = createReducer({}, (builder) => {
    builder.addCase(Actions.setMeta, (state, action) => action.payload)
})

const directivesReducer = createReducer({}, (builder) => {
    builder.addCase(Actions.setDirectives, (state, action) => action.payload)
})

const featuresReducer = createReducer({}, (builder) => {
    builder.addCase(Actions.setFeatures, (state, action) => action.payload)
})

const filtersReducer = createReducer(INIT_FILTERS, (builder) => {
    builder.addCase(Actions.setFilters, (state, action) => {
        const {payload} = action
        return {
            ...state,
            search: payload.search ?? state.search,
            selects: {...state.selects, ...payload.selects},
            ranges: {...state.ranges, ...payload.ranges},
            sliders: {...state.sliders, ...payload.sliders},
        }
    }).addCase(Actions.clearFilters, always(INIT_FILTERS))
})

const legendColorsReducer = createReducer({}, (builder) => {
    builder.addCase(Actions.setLegend, (state, action) => action.payload)
})

const legendHeaderReducer = createReducer('', (builder) => {
    builder.addCase(Actions.setLegendHeader, (state, action) => action.payload)
})

const modalReducer = createReducer(false, (builder) => {
    builder.addCase(Actions.setModal, (state, action) => action.payload)
})

export const Reducers = {
    metaReducer,
    directivesReducer,
    featuresReducer,
    modalReducer,
    filtersReducer,
    legendColorsReducer,
    legendHeaderReducer
}