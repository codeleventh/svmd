import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {Reducers} from './reducers'
import {IFilter} from './model/filterModel'
import {LegendColors} from './model/types'
import {IFeatureIndexed, IMapMeta} from './model/model'

export interface IStore {
	metadata: IMapMeta;
	directives: Record<string, string[]>;
	features: IFeatureIndexed[];
	filters: IFilter;
	legendColors: LegendColors;
	legendHeader: string;
	modals: boolean;
}

const store = configureStore({
	devTools: process.env.NODE_ENV !== 'production',
	reducer: combineReducers({
		metadata: Reducers.metaReducer,
		directives: Reducers.directivesReducer,
		features: Reducers.featuresReducer,
		modals: Reducers.modalReducer,
		filters: Reducers.filtersReducer,
		legendColors: Reducers.legendColorsReducer,
		legendHeader: Reducers.legendHeaderReducer,
	}),
})

export default store
