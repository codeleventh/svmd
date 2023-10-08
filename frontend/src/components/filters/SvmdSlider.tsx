import {Group, Slider, Space, Text} from '@mantine/core'
import {defaultTo, equals, find, head, last} from 'ramda'
import React, {useMemo} from 'react'
import {filterChangeOptions, filterField} from '../../filterModel'
import {parseAsDateMarks, parseAsNumberMarks} from '../filterUtils'

import dayjs from 'dayjs'
import {DATE_FORMAT, SECONDS_IN_DAY} from '../../const'
import {notEmpty} from '../../util'
import {ValuesWithHeader} from '../../types'

interface IProps {
    initField: filterField<number>,
    valuesWithHeader: ValuesWithHeader,
    onChange: (options: filterChangeOptions<number>) => void,
}

const isDate = (s: string) => dayjs(s, DATE_FORMAT, true).isValid()  // TODO: use it

export const SvmdSlider: React.FC<IProps> = (props: IProps) => {
    const {valuesWithHeader, initField, onChange} = props
    const [header, values] = useMemo(() => valuesWithHeader, [])

    const data = useMemo(() => values.filter(notEmpty), [values])
    const isDateValues = useMemo(() => !!find(isDate, data), [data])
    const sortedData = useMemo(() => (isDateValues ? parseAsDateMarks : parseAsNumberMarks)(data), [])

    const min = head(sortedData)!.value
    const max = last(sortedData)!.value
    const delta = isDateValues ? SECONDS_IN_DAY : 1

    const defaultValue: number = max
    const selected = defaultTo(defaultValue, initField?.value)

    return useMemo(() => (sortedData.length <= 1) ? <></> : <>
        <Group>
            <Text size="md">{header}: </Text>
            <Slider
                size="lg"
                min={min}
                max={max}
                step={delta}
                value={selected}
                marks={sortedData}
                defaultValue={defaultValue}
                // TODO: consider using onChangeEnd
                onChange={(value) => {
                    onChange({
                        header,
                        type: 'sliders',
                        value,
                        isDate: isDateValues,
                        isInit: equals(max, value)
                    })
                }}
                style={{flexGrow: 1, padding: isDateValues ? '0 48px 0 18px' : '0 6px'}}
                label={(val) => isDateValues ? dayjs.unix(val).format(DATE_FORMAT) : val}
            />
        </Group>
        <Space/>
    </>, [selected, sortedData])
}
