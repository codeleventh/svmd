import {useSelector} from 'react-redux'
import {CircleMarker, MapContainer, Polygon, TileLayer} from 'react-leaflet'
import React, {useEffect, useMemo, useRef} from 'react'
import {
    featuresSelector,
    filteredFeaturesSelector,
    filtersSelector,
    headerByDirectiveSelector,
    headersByDirectiveSelector,
    legendHeaderSelector,
    metadataSelector,
    modalSelector
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
import {Header} from './Header'
import {DEFAULT_PADDING, MARKER_RADIUS, MARKER_STYLE} from '../const'
import {Directive, IFeatureIndexed, TileProvider} from '../model'
import {calculateBounds} from './mapUtils'

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
    const legendHeader = useSelector(legendHeaderSelector)
    const isModalOpened = useSelector(modalSelector)

    const markerRefs = useRef(Array(features.length).fill(undefined))
    const headerHeight = searchHeaders.length ? 125 : 0
    // TODO: ↑ hardcoded cause useResizeObserver hook won't work for some reason

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

    const toMarker = (feature: IFeatureIndexed) => {
        const {index, geometry} = feature
        if (geometry.type === 'Point') {
            return <CircleMarker
                {...MARKER_STYLE}
                key={index}
                pane="markerPane" // indicates greater z-index than tile layer
                radius={MARKER_RADIUS}
                ref={(feature) => {
                    markerRefs.current[index] = feature
                }}
                center={geometry.coordinates as LatLngExpression}>
                <Card key={index} cursedMargin={headerHeight} feature={feature}/>
            </CircleMarker>
        } else {
            return <Polygon
                {...MARKER_STYLE}
                key={index}
                ref={(feature) => {
                    markerRefs.current[index] = feature
                }}
                positions={geometry.coordinates as LatLngExpression[][]}>
                <Card key={index} cursedMargin={headerHeight} feature={feature}/>
            </Polygon>
        }
    }

    const featureMarkers = useMemo(() => filteredFeatures.map(toMarker), [colorHeader, filteredFeatures])
    return <div id="map-wrapper">
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
            <Header/>
            <TileLayer url={TileProvider.DARK_NO_LABELS}/>
            {featureMarkers}
            <Meerkat/>
        </MapContainer>
    </div>
}