import {createAction} from '@reduxjs/toolkit'
import {IFilter} from './model/filterModel'
import {LegendColors} from './model/types'
import {Directive, IFeatureIndexed, IMapMeta} from './model/model'

const setMeta = createAction<IMapMeta>('META/SET')
const setDirectives = createAction<Map<Directive, string[]>>('DIRECTIVES/SET')
const setFeatures = createAction<IFeatureIndexed[]>('FEATURES/SET')
const setFilters = createAction<IFilter>('FILTERS/SET')
const clearFilters = createAction('FILTERS/CLEAR')
const setLegend = createAction<LegendColors>('LEGEND/COLORS/SET')
const setLegendHeader = createAction<string>('LEGEND/HEADER/SET')
const setModal = createAction<boolean>('MODAL/SET')

export const Actions = {
	setMeta,
	setDirectives,
	setFeatures,
	setFilters,
	setLegend,
	setLegendHeader,
	clearFilters,
	setModal,
}
