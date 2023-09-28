import {PathProps} from '@react-leaflet/core/types/path'

export const MAP_ID_REGEX = '[0-9A-Z]{8}'

export const TAG_SEPARATOR = '|'
export const DATE_FORMAT = 'DD.MM.YYYY'
export const DATETIME_FORMAT = 'DD.MM.YYYY HH:MM'

export const REPO_URL = 'https://github.com/codeleventh/svmd'
export const SVMD_VERSION = '0.1' // TODO: get from package.json

export const DEFAULT_FEATURE_NAME = 'Без названия'

export const CARDLINK_TEXT = 'Подробнее'

export const MARKER_RADIUS = 7 // TODO: X for mobile, Y for PC
export const DEFAULT_PADDING = 10 // spacing between popup and screen borders, px

export const TRANSITION_DURATION = 100

export const SECONDS_IN_DAY = 86400

export const LEGEND_COLORS = [
	'rgb(106, 176, 76)',
	'rgb(235, 77, 75)',
	'rgb(249, 202, 36)',
	'rgb(35, 100, 250)',
	'rgb(240, 10, 110)',
	'rgb(170,25,220)',
	'rgb(240, 95, 10)',
	'rgb(50, 220, 210)',
	'rgb(255, 0, 0)',
	'rgb(198 198 198)',
	'#c0eb75',
	'#ffe066',
	'#ffc078',
	'#63e6be',
	'#74c0fc',
	'#b197fc',
	'#e599f7',
	'#C1C2C5',
]

export const MARKER_STYLE: PathProps = {
	pathOptions: {
		fillOpacity: 0.8,
		// weight: 2, // TODO: It may break polyline.js for some reason
	},
}
