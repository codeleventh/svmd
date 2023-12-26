import {head, isEmpty, last} from 'ramda'
import dayjs from 'dayjs'
import {Mark} from '../model/types'
import {DATE_FORMAT, SECONDS_IN_DAY} from '../const'
import {notNaN} from '../util'

const toDate: (s: string) => dayjs.Dayjs = (s) => dayjs(s, DATE_FORMAT, true)

// [1,2,3] => [0,1,2,3,4]
export const extendRange = (sortedArr: Mark[], isDates: boolean) => {
	if (isEmpty(sortedArr))
		return []

	const delta = !isDates ? 1 : SECONDS_IN_DAY
	const min = head(sortedArr)!.value - delta
	const max = last(sortedArr)!.value + delta
	return [{value: min}, ...sortedArr, {value: max}]
}

export const parseAsNumberMarks: (strings: string[]) => Mark[] = (strings) =>
	extendRange(strings
		.map(Number)
		.filter(notNaN)
		.sort()
		.map((num, i, arr) => {
				if (i === 0 || i === arr.length - 1)
					return {value: num, label: num}
				else return {value: num}
			}
		), false)

export const parseAsDateMarks: (strings: string[]) => Mark[] = (strings) =>
	extendRange(strings
		.map(s => toDate(s).unix())
		.filter(notNaN)
		.sort()
		.map((num, i, arr) => {
				if (i === 0 || i === arr.length - 1)
					return {value: num, label: dayjs.unix(num).format(DATE_FORMAT)}
				else return {value: num}
			}
		), true)
