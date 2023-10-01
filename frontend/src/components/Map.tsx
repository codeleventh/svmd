import {useSelector} from 'react-redux'
import {CircleMarker, MapContainer, Polygon, TileLayer} from 'react-leaflet'
import React from 'react'
import {featuresSelector, metadataSelector} from '../selectors'
import {LatLngExpression, Map as LeafletMap} from 'leaflet'
import {MARKER_RADIUS, MARKER_STYLE} from '../const'
import {IFeatureIndexed, TileProvider} from '../model'

import '../css/leaflet.css'
import {Meerkat} from './Meerkat'
import {calculateBounds} from './mapUtils'

export const Map: React.FC = () => {
    const metadata = useSelector(metadataSelector)
    const features = useSelector(featuresSelector)

    const toMarker = (feature: IFeatureIndexed) => {
        const {index, geometry} = feature
        if (geometry.type === 'Point') {
            return <CircleMarker
                {...MARKER_STYLE}
                key={index}
                pane="markerPane" // indicates greater z-index than tile layer
                radius={MARKER_RADIUS}
                center={geometry.coordinates as LatLngExpression}>
            </CircleMarker>
        } else {
            return <Polygon
                {...MARKER_STYLE}
                key={index}
                positions={geometry.coordinates as LatLngExpression[][]}>
            </Polygon>
        }
    }

    return <>
        <div id="map-wrapper">
            <MapContainer
                center={metadata.center}
                zoomControl={false}
                whenCreated={(map: LeafletMap) => {
                    map.options.zoomSnap = 0.75
                    if (features.length == 0) return
                    else if (features.length > 1) {
                        const bounds = calculateBounds(features)
                        map.fitBounds(bounds)
                    }
                }}>
                <TileLayer url={TileProvider.DARK_NOLABELS}/>
                {features.map(toMarker)}
                <Meerkat/>
            </MapContainer>
        </div>
    </>
}