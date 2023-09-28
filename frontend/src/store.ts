import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {Reducers} from './reducers'
import {IFilter} from './filterModel'
import {LegendColors} from './types'
import {IFeature, IMapMeta} from './model'

export interface IStore {
  metadata: IMapMeta;
  directives: Record<string, string[]>;
  features: IFeature[];
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
