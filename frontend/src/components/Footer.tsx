import '../css/map/footer.css'

import {Divider, MantineProvider, SimpleGrid} from '@mantine/core'
import {Attribution} from './Attribution'
import React, {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {featuresSelector, headersByDirectiveSelector, themeSelector} from '../selectors'
import {headerToUniqueProps, notEmpty} from '../util'
import {filterChangeOptions} from '../model/filter'
import {Actions} from '../actions'
import {SvmdSlider} from './filters/SvmdSlider'
import {IStore} from '../store'
import {Legend} from './Legend'
import {isEmpty} from 'ramda'
import {Directive} from '../model/model'

export const Footer: React.FC = () => {
    const dispatch = useDispatch()
    const features = useSelector(featuresSelector)
    const filters = useSelector((store: IStore) => store.filters)
    const legendHeaders = useSelector(headersByDirectiveSelector(Directive.FOOTER_LEGEND))
    const sliderHeaders = useSelector(headersByDirectiveSelector(Directive.FOOTER_SLIDER))
    const sliders = sliderHeaders.map(headerToUniqueProps(features))
    const theme = useSelector(themeSelector)

    const onComponentChange = useCallback((f: filterChangeOptions<number>) => {
        const {type, header, value, isDate, isInit} = f
        dispatch(Actions.setFilters({
            ...filters,
            ...{[type]: {...filters[type], [header]: {value, isDate, isInit}}}
        }))
    }, [filters])

    return <MantineProvider theme={theme}><SimpleGrid
        id="footer"
        className='leaflet-override' spacing='sm'
        sx={{
            boxShadow: `0 -5px 6px 0 ${theme.background} !important`,
            backgroundColor: theme.background
        }}>

        {!isEmpty(legendHeaders) && <Legend/>}

        {sliders.map((slider, i) =>
            <SvmdSlider
                key={`slider_${i}`}
                initField={filters.sliders[slider[0]]}
                valuesWithHeader={slider}
                onChange={onComponentChange}
            />)}

        {(!isEmpty(legendHeaders) || notEmpty(sliders)) && <Divider variant='dashed'/>}

        <Attribution/>
    </SimpleGrid></MantineProvider>
}