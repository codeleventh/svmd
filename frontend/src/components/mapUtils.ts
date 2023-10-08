import {defaultTo, equals, head, last, unnest} from 'ramda'
import {LatLngBounds} from 'leaflet'
import {LEGEND_COLORS} from '../const'
import {getArrayBoundaries, notEmpty} from '../util'
import {IFeature, IFeatureIndexed} from '../model'
import {Geometry, LegendColors} from '../types'

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

export const calculateColor: (f: IFeatureIndexed, ch: string, lc: LegendColors, lh: string, dc: string, mdc?: string) => string | undefined =
	// calculating color for particular feature according to current state and map settings
	// priority: current legend category color > feature COLOR > map metadata default color > theme default color
	// TODO: cursed, should be reimplemented for the sake of readability
	(feature, colorHeader: string, legendColors, legendHeader, defaultColor, mapDefaultColor) => {
		// TODO: check how it will work with fields containing "|"
		const {properties} = feature

		const index = defaultTo([], legendColors[legendHeader]).findIndex(equals(properties[legendHeader]))
		const maybeColor = index !== -1 ? LEGEND_COLORS[index % LEGEND_COLORS.length] : properties[colorHeader]
		const color = CSS.supports('color', maybeColor) ? maybeColor : undefined
		// TODO: do you need a default color for "not categorized" entry?

		return color ?? mapDefaultColor ?? defaultColor
	}
