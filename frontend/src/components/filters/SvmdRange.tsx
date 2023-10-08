import {RangeSlider, Space, Text} from '@mantine/core'
import {defaultTo, equals, find, head, last} from 'ramda'
import React, {useMemo, useState} from 'react'
import {filterChangeOptions, filterField} from '../../filterModel'
import {parseAsDateMarks, parseAsNumberMarks} from '../filterUtils'

import dayjs from 'dayjs'
import {DATE_FORMAT, SECONDS_IN_DAY} from '../../const'
import {ValuesWithHeader} from '../../types'
import {notEmpty} from '../../util'

interface IProps {
	initField: filterField<[number, number]>,
	valuesWithHeader: ValuesWithHeader,
	onChange: (options: filterChangeOptions<[number, number]>) => void,
}

const isDate = (s: string) => dayjs(s, DATE_FORMAT, true).isValid()

export const SvmdRange: React.FC<IProps> = (props: IProps) => {
	const {valuesWithHeader, initField, onChange} = props
	const [header, values] = valuesWithHeader

	const data = values.filter(notEmpty)
	const isDateValues = !!find(isDate, data)
	const sortedData = useMemo(() => (isDateValues ? parseAsDateMarks : parseAsNumberMarks)(data), [])

	const min = head(sortedData)!.value
	const max = last(sortedData)!.value
	const delta = isDateValues ? SECONDS_IN_DAY : 1

	const defaultValue: [number, number] = [min, max]
	const [selected, setSelected] = useState(defaultTo(defaultValue, initField?.value))

	if (sortedData.length <= 1)
		return <></>

	return <>
		<Text size='xs'>{header}</Text>
		<RangeSlider
			min={min}
			max={max}
			step={delta}
			minRange={delta}
			value={selected}
			marks={sortedData}
			onChange={(value) => {
				setSelected(value)
				onChange({header, type: 'ranges', value, isDate: isDateValues, isInit: equals(defaultValue, value)})
			}}
			label={(val) => isDateValues ? dayjs.unix(val).format(DATE_FORMAT) : val}
			size='sm'
		/>
		<Space/>
	</>
}
