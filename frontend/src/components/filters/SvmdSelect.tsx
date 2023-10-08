import {MultiSelect} from '@mantine/core'
import {defaultTo, equals} from 'ramda'
import React, {useState} from 'react'
import {filterChangeOptions, filterField} from '../../filterModel'
import {ValuesWithHeader} from '../../types'

interface IProps {
	initField: filterField<string[]>,
	valuesWithHeader: ValuesWithHeader,
	onChange: (options: filterChangeOptions<string[]>) => void,
}

export const SvmdSelect: React.FC<IProps> = (props: IProps) => {
	const {valuesWithHeader, initField, onChange} = props
	const [header, values] = valuesWithHeader

	const defaultValue: string[] = []
	const [selected, setSelected] = useState(defaultTo(defaultValue, initField?.value))
	if (values.length === 0)
		return <></>

	// TODO: здесь и в остальных местах. Если передвинуть всё в начальное положение, фильтрация не снимаетс
	return <>
		<MultiSelect
			data={values}
			value={selected}
			onChange={(value) => {
				setSelected(value)
				onChange({header, type: 'selects', value, isInit: equals(defaultValue, value)})
			}}
			label={header}
			placeholder="—"
			clearable
		/>
	</>
}
