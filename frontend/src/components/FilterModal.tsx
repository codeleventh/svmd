import {featuresSelector, headersByDirectiveSelector, themeSelector} from '../selectors'
import {useDispatch, useSelector} from 'react-redux'
import React, {useCallback, useState} from 'react'
import {Button, Modal, SimpleGrid, Space} from '@mantine/core'
import {Actions} from '../actions'
import {SvmdSelect} from './filters/SvmdSelect'
import {filterChangeOptions, IFilter} from '../model/filter'
import {SvmdRange} from './filters/SvmdRange'
import {Directive} from '../model/model'
import {headerToUniqueProps} from '../util'

interface IProps {
    initFilters: IFilter;
}

export const FilterModal: React.FC<IProps> = (props: IProps) => {
    const {initFilters} = props
    const dispatch = useDispatch()

    const features = useSelector(featuresSelector)
    const selectHeaders = useSelector(headersByDirectiveSelector(Directive.FILTER_SELECT))
    const rangeHeaders = useSelector(headersByDirectiveSelector(Directive.FILTER_RANGE))
    const selects = selectHeaders.map(headerToUniqueProps(features))
    const ranges = rangeHeaders.map(headerToUniqueProps(features))
    const theme = useSelector(themeSelector)

    const [localFilters, setLocalFilters] = useState(initFilters)

    const onSubmit = useCallback(() => {
        const updatedFilter = {...initFilters, ...localFilters}
        dispatch(Actions.setFilters(updatedFilter))
        dispatch(Actions.setModal(false))
    }, [initFilters, localFilters, dispatch])

    const onClose = useCallback(() => {
        dispatch(Actions.setModal(false))
        setLocalFilters(initFilters)
    }, [initFilters])

    const onComponentChange = useCallback(<T, >(f: filterChangeOptions<T>) => {
        const {type, header, value, isDate, isInit} = f
        setLocalFilters({
            ...localFilters,
            ...{[type]: {...localFilters[type], [header]: {value, isDate, isInit}}}
        })
    }, [localFilters])

    return <Modal
        opened
        centered
        size={'lg'}
        padding={48}
        withCloseButton={false}
        onClose={onClose}
        style={{
            overflowX: 'visible', overflowY: 'scroll',
        }}
        sx={{'.mantine-Paper-root': {backgroundColor: theme.background, color: theme.foreground}}}
    > <SimpleGrid>
        {selects.map((select, i) =>
            <SvmdSelect
                key={`select_${i}`}
                initField={initFilters.selects[select[0]]}
                valuesWithHeader={select}
                onChange={onComponentChange}
            />)}
        {ranges.map((range, i) =>
            <SvmdRange
                key={`range_${i}`}
                initField={initFilters.ranges[range[0]]}
                valuesWithHeader={range}
                onChange={onComponentChange}
            />)}
        <Space/>
        <Button onClick={onSubmit}>Применить</Button>
    </SimpleGrid>
    </Modal>
}
