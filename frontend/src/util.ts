import {defaultTo, filter, isEmpty, isNil, map, max, min, Ord, pair, path, pipe, split, trim, uniq} from 'ramda'
import {TAG_SEPARATOR} from './const'
import {IFeature} from './model/model'
import {ValuesWithHeader} from './model/types'

export const notEmpty = (x: unknown) => !isNil(x) && !isEmpty(x)

export const notNaN = (x: number) => !isNaN(x)

export const noop = () => {
}

export const getArrayBoundaries: <T extends Ord>(array: T[]) => [T, T] = (array) => [array.reduce(min), array.reduce(max)]

export const normalizeValues: (values: string[]) => string[] = pipe(defaultTo([]), filter(notEmpty), map(trim), filter(notEmpty), uniq)

export const splitTags: (tags: string) => string[] = pipe(defaultTo(''), split(TAG_SEPARATOR), normalizeValues)

export const headerToUniqueProps: (features: IFeature[]) => (header: string) => ValuesWithHeader = (features) => (header) =>
	pair(header, uniq(features.map(path<string>(['properties', header])).map(__ => __!).flatMap(splitTags)))
