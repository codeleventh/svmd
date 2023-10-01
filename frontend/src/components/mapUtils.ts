import {head, last, unnest} from 'ramda'
import {LatLngBounds} from 'leaflet'
import {getArrayBoundaries, notEmpty} from '../util'
import {IFeature} from '../model'
import {Geometry} from '../types'

export const calculateBounds = (features: IFeature[]) => {
	// getting most SW and NE geo points
	const arr: number[][] = features.map(feature => feature.geometry)
		.flatMap((geometry: Geometry) => {
			if (geometry.type === 'Point') {
				return [geometry.coordinates as number[]]
			} else {
				return unnest(geometry.coordinates as number[][][])
			}
		}).filter(notEmpty)
	const [lats, lngs] = [getArrayBoundaries(arr.map<number>(head)!), getArrayBoundaries(arr.map<number>(last)!)]
	return new LatLngBounds([lats[0], lngs[0]], [lats[1], lngs[1]])
}
