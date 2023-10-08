import '../css/footer.css'

import {Divider, SimpleGrid, useMantineTheme} from '@mantine/core'
import {Attribution} from './Attribution'
import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {featuresSelector, headersByDirectiveSelector} from '../selectors'
import {headerToUniqueProps, notEmpty} from '../util'
import {filterChangeOptions} from '../filterModel'
import {Actions} from '../actions'
import {SvmdSlider} from './filters/SvmdSlider'
import {IStore} from '../store'
import {Legend} from './Legend'
import {isEmpty} from 'ramda'
import {Directive} from '../model'

export const Footer: React.FC = () => {
    const dispatch = useDispatch()
    const theme = useMantineTheme()

    const features = useSelector(featuresSelector)
    const filters = useSelector((store: IStore) => store.filters)
    const legendHeaders = useSelector(headersByDirectiveSelector(Directive.FOOTER_LEGEND))
    const sliderHeaders = useSelector(headersByDirectiveSelector(Directive.FOOTER_SLIDER))
    const sliders = sliderHeaders.map(headerToUniqueProps(features))

    const onComponentChange = useCallback((f: filterChangeOptions<number>) => {
        const {type, header, value, isDate, isInit} = f
        dispatch(Actions.setFilters({
            ...filters,
            ...{[type]: {...filters[type], [header]: {value, isDate, isInit}}}
        }))
    }, [filters])

    return <SimpleGrid
        id="footer"
        className={'leaflet-override'} spacing={'sm'}
        sx={(theme) => {
            const color = theme.colorScheme === 'dark' ? 'black' : 'white'
            return {
                boxShadow: `0 -5px 10px 0 ${color} !important`,
                backgroundColor: color
            }
        }}>

        {!isEmpty(legendHeaders) && <Legend/>}

        {sliders.map((slider, i) =>
            <SvmdSlider
                key={`slider_${i}`}
                initField={filters.sliders[slider[0]]}
                valuesWithHeader={slider}
                onChange={onComponentChange}
            />)}

        {(!isEmpty(legendHeaders) || notEmpty(sliders)) && <Divider variant={'dashed'} color={theme.colors.gray[7]}/>}

        <Attribution/>
    </SimpleGrid>
}