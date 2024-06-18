import {Autocomplete, Button, Group, Image, MantineProvider, SimpleGrid, Transition} from '@mantine/core'
import {Filter as FilterIcon, FilterOff, Search} from 'tabler-icons-react'
import {Actions} from '../actions'
import React, {useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {headerToUniqueProps, notEmpty} from '../util'
import {gte, head, values} from 'ramda'
import {TRANSITION_DURATION} from '../const'
import {Directive} from '../model/model'
import {
    filteredFeaturesSelector,
    filtersSelector,
    headersByDirectiveSelector,
    metadataSelector,
    themeSelector
} from '../selectors'

export const MapHeader: React.FC = () => {
    const dispatch = useDispatch()

    const filters = useSelector(filtersSelector)
    const filteredFeatures = useSelector(filteredFeaturesSelector)
    const metadata = useSelector(metadataSelector)
    const theme = useSelector(themeSelector)

    const searchHeaders = useSelector(
        headersByDirectiveSelector(Directive.SEARCH)
    )
    const searches = searchHeaders
        .map(headerToUniqueProps(filteredFeatures))
        .filter((header) => notEmpty(head(header)))
    const searchOptions = useMemo(
        () => searches.flatMap((propPair) =>
            propPair[1].map((v) => ({
                value: v,
                header: head(propPair),
            }))
        ),
        [filteredFeatures]
    )

    const [search, setSearch] = useState('')
    const autocompletePlaceholder =
        'Возможен поиск по полям: ' +
        searches.map((propPair) => `«${head(propPair)}»`).join(', ')

    const shadow = {boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)'} // in case if there are popup under search bar

    const selects = useSelector(
        headersByDirectiveSelector(Directive.FILTER_SELECT)
    )
    const ranges = useSelector(
        headersByDirectiveSelector(Directive.FILTER_RANGE)
    )
    const isFiltersUsed = useMemo(
        () => notEmpty(selects) || notEmpty(ranges),
        [selects, ranges]
    )
    const isInitFilter = useMemo(
        () =>
            ![filters.selects, filters.ranges, filters.sliders]
                .flatMap(values)
                .find((f) => !f.isInit),
        [filters]
    )

    const onSearchChange = (value: string) => {
        setSearch(value)
        dispatch(Actions.setFilters({...filters, search: value}))
    }

    return (
        <MantineProvider theme={theme}>
            <SimpleGrid id='map-header' className="leaflet-override">
                <Group>
                    <Image
                        id="logo"
                        src={metadata.logo ?? theme.svmdLogo}
                        height={48}
                        width='auto'
                        alt=''
                    />
                    {/*TODO: ты не открываешь так дорожку какому-нибудь xss?*/}
                    {searches.length && (
                        <Autocomplete
                            sx={{
                                'div input': {
                                    color: theme.foreground,
                                    backgroundColor: theme.background
                                }
                            }}
                            size="lg"
                            icon={<Search/>}
                            style={{flexGrow: 1, ...shadow}}
                            data={searchOptions}
                            disabled={gte(1)(searchOptions.length)}
                            placeholder={autocompletePlaceholder}
                            value={search}
                            onChange={onSearchChange}
                            transition="scale-y"
                            transitionDuration={TRANSITION_DURATION / 2}
                        />
                    )}
                </Group>

                <Group>
                    {isFiltersUsed && (
                        <Button
                            leftIcon={<FilterIcon/>}
                            compact
                            size="lg"
                            style={shadow}
                            onClick={() => dispatch(Actions.setModal(true))}
                        >Фильтры</Button>
                    )}

                    {<Transition
                        mounted={isFiltersUsed && !isInitFilter}
                        transition="fade"
                        duration={TRANSITION_DURATION}
                        timingFunction="linear">
                        {(styles) => (
                            <Button
                                leftIcon={<FilterOff/>}
                                compact
                                size="lg"
                                style={{...styles, ...shadow}}
                                onClick={() => dispatch(Actions.clearFilters())}
                            >Сбросить фильтры</Button>
                        )}
                    </Transition>}
                </Group>
            </SimpleGrid></MantineProvider>
    )
}
