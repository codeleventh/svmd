import '../css/map/leaflet.css'
import '../css/map/leaflet-overrides.css'

import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Button, ColorInput, Grid, Group, Select, TextInput} from "@mantine/core";
import {Link as LinkIcon, Photo} from "tabler-icons-react";
import {useForm, zodResolver} from '@mantine/form';
import {z} from 'zod';
import {useHistory} from 'react-router-dom';
import {IMapMeta, Lang} from "../model/model";
import {DEFAULT_THEME, resolveTheme, Theme} from "../model/themes";
import {responseToNotification} from "./utils/apiUtils";
import {IApiResponse} from "../model/rests";
import {defaultTo, equals, mergeWith} from "ramda";
import {DEFAULT_MAP_TITLE, MARKER_RADIUS} from "../const";
import {CircleMarker, MapContainer, TileLayer, useMapEvent} from 'react-leaflet';
import {CircleMarker as LeafletCircleMarker, LatLng, TileLayer as LeafletTileLayer} from "leaflet";
import {resolveTile, TileProvider} from "../model/tiles";

interface IProps {
    mapMeta: IMapMeta
    onSubmit: (mapMeta: IMapMeta) => void
    putResponse: IApiResponse<{}> | undefined
    isLoading: boolean
}

export const EditForm: React.FC<IProps> = (props: IProps) => {
    const {mapMeta, onSubmit, putResponse, isLoading} = props
    const mapId = mapMeta.identifier

    const history = useHistory();
    const routeChange = (mapId: string) => {
        history.push(`/${mapId}`)
    }

    const defaults: Partial<IMapMeta> = {
        title: DEFAULT_MAP_TITLE,
        theme: DEFAULT_THEME,
        tileProvider: resolveTheme(DEFAULT_THEME).defaultTileProvider,
        lang: Lang.EN,
        link: ''
    };
    const mapMetaWithDefaults = mergeWith(defaultTo, defaults, mapMeta);

    let form = useForm({
        initialValues: {...mapMetaWithDefaults},
        schema: zodResolver(z.object({
            link: z.union([z.string().url('Некорректный формат ссылки'), z.null(), z.literal('')]),
            logo: z.union([z.string().url('Некорректный формат ссылки'), z.null(), z.literal('')]),
        })),
    })
    const isFormInvalid = useMemo(() => form.validate().hasErrors, [form.values])

    const [mapCenter, setMapCenter] = useState<LatLng>();
    const tileLayerRef = useRef<LeafletTileLayer>(null)
    const markerRef = useRef<LeafletCircleMarker>(null)

    const MapClickHandler = () => {
        const map = useMapEvent('click', e => {
            setMapCenter(e.latlng)
            map.setView(e.latlng, map.getZoom())
            markerRef.current?.redraw()
        })
        return null
    }
    useEffect(() => {
        if (tileLayerRef.current) {
            tileLayerRef.current.setUrl(resolveTile(form.values.tileProvider));
        }
    }, [form.values.tileProvider]);
    useEffect(() => {
        if (!!markerRef.current) {
            markerRef.current.options.color = form.values.defaultColor
            markerRef.current.setStyle({color: form.values.defaultColor})
        }
    }, [markerRef.current, form.values.defaultColor])

    const mapMetaForPut = useMemo(() => {
        const obj = Object.assign({}, mapMeta, form.values)
        Object.keys(obj).forEach((key) => {
            // @ts-ignore
            // Getting the diff between old state and new state excluding default values
            if (obj[key] === '' || (equals(obj[key], defaults[key]) && !equals(obj[key], mapMeta[key]))) {
                obj[key] = null;
            }
        });
        return obj
    }, [mapMeta, form.values])

    return <>
        {!!putResponse && responseToNotification(putResponse)}
        <TextInput
            label="Название карты"
            description="Будет показана в названии вкладки"
            {...form.getInputProps('title')}
        />
        <Grid columns={2}>
            <Grid.Col span={1}>
                <Select
                    label="Тема интерфейса"
                    data={[
                        {value: Theme.DARK, label: 'Темная'},
                        {value: Theme.LIGHT, label: 'Светлая'},
                    ]}
                    {...form.getInputProps('theme')}
                    allowDeselect={false}
                    clearable={false}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <Select
                    label="Язык интерфейса карты"
                    data={[
                        {value: 'EN', label: '🇬🇧 Английский'},
                        {value: 'RU', label: '🇷🇺 Русский'},
                    ]}
                    {...form.getInputProps('lang')}
                    allowDeselect={false}
                    clearable={false}
                />
            </Grid.Col>
        </Grid>
        <Grid columns={2}>
            <Grid.Col span={1}>
                <Select
                    label="Тема карты"
                    data={[
                        // {value: 'default', label: 'Как в теме'},
                        {value: TileProvider.LIGHT, label: 'Светлая'},
                        {value: TileProvider.DARK, label: 'Темная'},
                        {value: TileProvider.OSM, label: 'OpenStreetMap'},
                        {value: TileProvider.COLORFUL, label: 'Цветная'},
                        // {value: TileProvider.NORD, label: 'Nord'},
                        // {value: TileProvider.SATELLITE, label: 'Спутник'},
                    ]}
                    onChange={form.getInputProps('tileProvider').onChange}
                    value={form.getInputProps('tileProvider').value}
                    allowDeselect={false}
                    clearable={false}
                />
            </Grid.Col>
            <Grid.Col span={1}>
                <ColorInput label="Цвет точек и полигонов по умолчанию" {...form.getInputProps('defaultColor')} />
            </Grid.Col>
        </Grid>

        <MapContainer
            center={[50.0, 80.0]}
            zoom={3}
            style={{border: '0px', borderRadius: '4px', width: "100%", height: "300px"}}
        >
            {
                mapCenter &&
                <CircleMarker
                    color={form.values.defaultColor}
                    radius={MARKER_RADIUS}
                    center={mapCenter}
                    ref={markerRef}
                />
            }
            <TileLayer url={resolveTile(form.values.tileProvider)} ref={tileLayerRef}/>
            <MapClickHandler/>
        </MapContainer>

        <TextInput
            label="Ссылка на проект"
            description={`Будет показана внизу на странице с картой (с текстом «О проекте „${form.getInputProps('title').value}“») `}
            icon={<LinkIcon/>}
            {...form.getInputProps('link')}
        />
        <TextInput
            label="Ссылка на логотип"
            description="Будет использован вместо логотипа СВМД"
            icon={<Photo/>}
            {...form.getInputProps('logo')}
        />
        <Group>
            <Button
                disabled={isLoading || isFormInvalid}
                onClick={() => {
                    onSubmit(mapMetaForPut)
                }}
            >Сохранить</Button>
            <Button onClick={() => routeChange(mapId)}>Открыть карту</Button>
        </Group>
    </>
}
