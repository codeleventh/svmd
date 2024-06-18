import {useSelector} from 'react-redux'
import {CircleMarker, MapContainer, Polygon, TileLayer} from 'react-leaflet'
import React, {useEffect, useMemo, useRef} from 'react'
import {
    featuresSelector,
    filteredFeaturesSelector,
    filtersSelector,
    headerByDirectiveSelector,
    headersByDirectiveSelector,
    legendColorsSelector,
    legendHeaderSelector,
    metadataSelector,
    modalSelector,
    themeSelector,
    tileProviderSelector
} from '../selectors'
import {
    CircleMarker as LeafletCircleMarker,
    LatLngExpression,
    Map as LeafletMap,
    Polygon as LeafletPolygon
} from 'leaflet'
import {Card} from './Card'
import {Meerkat} from './Meerkat'
import {equals} from 'ramda'
import {FilterModal} from './FilterModal'
import {MapHeader} from './MapHeader'
import {MantineProvider} from '@mantine/core'
import {DEFAULT_PADDING, MARKER_RADIUS, MARKER_STYLE} from '../const'
import {Directive, IFeatureIndexed} from '../model/model'
import {calculateBounds, calculateColor} from './mapUtils'

import '../css/map/leaflet.css'
import {splitTags} from '../util'

type Marker = (LeafletPolygon | LeafletCircleMarker);

export const Map: React.FC = () => {
    const metadata = useSelector(metadataSelector)
    const filters = useSelector(filtersSelector)
    const features = useSelector(featuresSelector)
    const filteredFeatures = useSelector(filteredFeaturesSelector)
    const searchHeaders = useSelector(headersByDirectiveSelector(Directive.SEARCH))
    const colorHeader = useSelector(headerByDirectiveSelector(Directive.COLOR))
    const legendColors = useSelector(legendColorsSelector)
    const legendHeader = useSelector(legendHeaderSelector)
    const isModalOpened = useSelector(modalSelector)

    const theme = useSelector(themeSelector)
    const tileProvider = useSelector(tileProviderSelector)
    // TODO: cursed
    document.documentElement.style.setProperty('--themed-background', theme.background);
    document.documentElement.style.setProperty('--themed-foreground', theme.foreground);
    document.documentElement.style.setProperty('--themed-link', theme.link);

    const markerRefs = useRef(Array(features.length).fill(undefined))
    const headerHeight = searchHeaders.length ? 125 : 0
    // TODO: ↑ hardcoded cause useResizeObserver hook won't work for some reason

    const updateColors = (featIndex: number) => {
        const ref = markerRefs?.current[featIndex]
        if (!ref) return
        const color = calculateColor(features[featIndex], colorHeader!, legendColors, legendHeader, theme.legendColors, metadata.defaultColor, theme.primaryColor as string)
        ref.setStyle({color: color, fillColor: color})
    }

    useEffect(() => {
        const showPopup = (id: number) => {
            if (!markerRefs?.current[id]) return;
            (markerRefs.current[id] as Marker).openTooltip();
            (markerRefs.current[id] as Marker).openPopup()
        }

        if (!filters.search) return
        const search = filters.search
        // TODO: may broke if fields contain "|"

        let index = -1
        searchHeaders.forEach((header) => { // TODO: performance optimizations
            if (index !== -1) return // TODO: ???
            const result = filteredFeatures.find((feature) => splitTags(feature.properties[header]).find(equals(search)))
            if (result) index = features.indexOf(result)
        })

        if (index !== -1) showPopup(index)
    }, [filteredFeatures, filters])

    useEffect(() => {
        features.forEach(f => updateColors(f.index))
    }, [legendHeader])

    const toMarker = (feature: IFeatureIndexed) => {
        const {index, geometry} = feature
        if (geometry.type === 'Point') {
            return <CircleMarker
                {...MARKER_STYLE}
                key={index}
                pane="markerPane" // indicates greater z-index than tile layer
                radius={MARKER_RADIUS}
                ref={(point) => {
                    markerRefs.current[index] = point
                    updateColors(index)
                }}
                center={geometry.coordinates as LatLngExpression}>
                <Card key={index} cursedMargin={headerHeight} feature={feature}/>
            </CircleMarker>
        } else {
            return <Polygon
                {...MARKER_STYLE}
                key={index}
                ref={(polygon) => {
                    markerRefs.current[index] = polygon
                    updateColors(index)
                }}
                positions={geometry.coordinates as LatLngExpression[][]}>
                <Card key={index} cursedMargin={headerHeight} feature={feature}/>
            </Polygon>
        }
    }

    const featureMarkers = useMemo(() => filteredFeatures.map(toMarker), [colorHeader, filteredFeatures])
    return <MantineProvider theme={theme}>
        <div id="map-wrapper">
            {isModalOpened && <FilterModal initFilters={filters}/>}
            <MapContainer
                center={metadata.center}
                zoomControl={false}
                whenCreated={(map: LeafletMap) => {
                    map.options.zoomSnap = 0.75
                    if (features.length == 0) return
                    else if (features.length > 1) {
                        const bounds = calculateBounds(features)
                        map.fitBounds(bounds, {
                            paddingTopLeft: [0, headerHeight],
                            paddingBottomRight: [DEFAULT_PADDING, 0]
                            // TODO: sizes are in px, but how much height the footer actually is?
                        })
                        // L.rectangle(bounds, {color: 'green', weight: 1}).addTo(map);
                    }
                }}>
                <MapHeader/>
                <TileLayer url={tileProvider}/>
                {featureMarkers}
                <Meerkat/>
            </MapContainer>
        </div>
    </MantineProvider>
}