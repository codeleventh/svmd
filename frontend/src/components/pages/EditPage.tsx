import '../../css/map/leaflet.css'
import '../../css/map/leaflet-overrides.css'

import React, {useEffect, useRef, useState} from 'react'
import {Button, ColorInput, Select, TextInput} from "@mantine/core";
import {Link as LinkIcon, Photo} from "tabler-icons-react";
import {CircleMarker, MapContainer, Popup, TileLayer, useMapEvent} from "react-leaflet";
import {LatLng, LatLngBounds, TileLayer as LeafletTileLayer} from "leaflet";
import {Theme} from "../Themes";
import {always, cond, equals, pipe, T} from "ramda";
import {MARKER_RADIUS} from "../../const";
import {TileProvider} from "../../model/model";
import {noop} from "../../util";

export const EditPage: React.FC = () => {
    const defaultBounds = new LatLngBounds([75, -110], [-20, 91])
    const [mapCenter, setMapCenter] = useState<LatLng>()
    const [mapName, setMapName] = useState('Без названия')
    const [theme, setTheme] = useState(Theme.DARK)
    const [defaultColor, setDefaultColor] = useState<string | undefined>(undefined)
    const [link, setLink] = useState<string | undefined>(undefined)
    const [logo, setLogo] = useState<string | undefined>(undefined)
    const [tileProvider, setTileProvider] = useState(TileProvider.DARK_NO_LABELS)
    const tileLayerRef = useRef<LeafletTileLayer>(null)

    useEffect(() => {
        if (tileLayerRef.current) {
            tileLayerRef.current.setUrl(tileProvider);
        }
    }, [tileProvider]);


    function MyComponent() {
        const map = useMapEvent('click', e => {
            setMapCenter(e.latlng)
            map.setView(e.latlng, map.getZoom())
        })
        return null
    } // TODO:


    return <>
        <TextInput
            label="Название карты"
            value={mapName}
            description="Будет показана в названии вкладки"
            onChange={e => setMapName(e.target.value)}
            // TODO: error
        />

        <MapContainer
            bounds={defaultBounds}
            style={{border: '0px', borderRadius: '4px', width: "100%", height: "400px"}}
        >
            {
                mapCenter &&
                <CircleMarker
                    radius={MARKER_RADIUS}
                    center={mapCenter}
                >
                    <Popup position={mapCenter}>
                        Current location: <pre>{JSON.stringify(mapCenter, null, 2)}</pre>
                        {/*// TODO:*/}
                    </Popup>
                </CircleMarker>
            }
            <TileLayer url={tileProvider} ref={tileLayerRef}/>
            <MyComponent/>{/*TODO:*/}
        </MapContainer>

        <Select
            label="Язык интерфейса карты"
            description="Будет использован в интерфейсе"
            data={[
                {value: 'en', label: '🇬🇧 Английский'},
                {value: 'ru', label: '🇷🇺 Русский'},
            ]}
        />
        <Select
            label="Тема интерфейса"
            data={[
                {value: 'dark', label: 'Темная'},
                {value: 'light', label: 'Светлая'},
                // {value: 'nord', label: 'Nord'},
            ]}
            onChange={
                pipe(cond([
                    [equals('dark'), always(Theme.DARK)],
                    [equals('light'), always(Theme.LIGHT)],
                    // [equals('nord'), always(Theme.NORD)],
                    [T, always(Theme.DEFAULT)]
                ]), setTheme) // TODO: ???
            }
        />
        <Select
            label="Тема карты"
            data={[
                {value: 'default', label: 'Как в теме'},
                {value: 'light', label: 'Светлая'},
                {value: 'dark', label: 'Темная'},
                // {value: 'nord', label: 'Nord'},
                {value: 'colorful', label: 'Цветная'},
                // {value: 'satellite', label: 'Спутник'},
            ]}
            onChange={
                pipe(cond([
                    [equals('default'), always(TileProvider.DEFAULT)],
                    [equals('light'), always(TileProvider.LIGHT_NO_LABELS)],
                    [equals('dark'), always(TileProvider.DARK_NO_LABELS)],
                    // [equals('nord'), always(TileProvider.NORD)],
                    [equals('colorful'), always(TileProvider.OSM)],
                    // [equals('satellite'), always(TileProvider.SATELLITE)],
                    [T, always(TileProvider.DEFAULT)]
                ]), setTileProvider)
            }
        />

        <ColorInput value={defaultColor} onChange={setDefaultColor} label="Цвет точек и полигонов по умолчанию"/>

        <TextInput
            label="Ссылка на проект"
            description={`Будет показана внизу на странице с картой (с текстом «О проекте „${mapName}“») `}
            icon={<LinkIcon/>}
            value={link}
            onChange={e => setLink(e.target.value)}
        />
        <TextInput
            label="Ссылка на логотип"
            description="Будет использован вместо логотипа СВМД"
            icon={<Photo/>}
            value={logo}
            onChange={e => setLogo(e.target.value)}
        />
        <Button onClick={noop}>Сохранить</Button>
    </>
}
