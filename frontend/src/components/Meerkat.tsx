import {ImageOverlay} from 'react-leaflet'
import React from 'react'
import {LatLngBounds} from 'leaflet'

const MEERKAT_BOUNDS: LatLngBounds = new LatLngBounds(
    [76.855315, 68.095887], [77.116902, 68.910315]
)

export const Meerkat = () => <ImageOverlay url={require('../img/meerkat.png')} bounds={MEERKAT_BOUNDS} opacity={0.91}/>