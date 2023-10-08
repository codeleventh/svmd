import {MultiSelect} from '@mantine/core'
import {defaultTo, equals} from 'ramda'
import React, {useMemo, useState} from 'react'
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

    return useMemo(() => (values.length === 1) ? <></> : <>
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
    </>, [selected, valuesWithHeader])
}
