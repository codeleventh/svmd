import '../css/map/leaflet.css'
import '../css/map/leaflet-overrides.css'

import React, {useMemo, useState} from 'react'
import {Button, ColorInput, Group, Select, TextInput} from "@mantine/core";
import {Link as LinkIcon, Photo} from "tabler-icons-react";
import {useForm, zodResolver} from '@mantine/form';
import {z} from 'zod';
import {useHistory} from 'react-router-dom';
import {IMapMeta, Lang} from "../model/model";
import {Theme} from "./Themes";
import {errorHandler, responseToNotification} from "./utils/apiUtils";
import {IApiResponse} from "../model/rests";
import axios from "axios";
import {defaultTo, equals, mergeWith, pipe, prop} from "ramda";
import {DEFAULT_MAP_TITLE} from "../const";

interface IProps {
    mapMeta: IMapMeta
}

export const EditForm: React.FC<IProps> = (props: IProps) => {
    const {mapMeta} = props
    const mapId = mapMeta.identifier

    const history = useHistory();
    const routeChange = (mapId: string) => {
        history.push(`/${mapId}`)
    }

    const [putResponse, setPutResponse] = useState<IApiResponse<{}>>()
    const onSubmit = (newMapMeta: IMapMeta) => {
        axios.put(`/api/meta/${mapId}`, newMapMeta)
            .then(pipe(prop('data'), setPutResponse))
            .catch(pipe(errorHandler, setPutResponse))
            .finally(() => setIsLoading(false))
    }

    const defaults: Partial<IMapMeta> = {
        title: DEFAULT_MAP_TITLE,
        lang: Lang.EN,
        theme: Theme.DEFAULT
    };
    const mapMetaWithDefaults = mergeWith(defaultTo, defaults, mapMeta);

    let form = useForm({
        initialValues: {...mapMetaWithDefaults},
        schema: zodResolver(z.object({
            link: z.union([z.string().url('Некорректный формат ссылки'), z.null(), z.literal('')]),
            logo: z.union([z.string().url('Некорректный формат ссылки'), z.null(), z.literal('')]),
        })),
    })

    const [isLoading, setIsLoading] = useState(false)
    const isFormInvalid = useMemo(() => form.validate().hasErrors, [form.values])

    const newMapMeta = useMemo(() => {
        const obj = Object.assign({}, mapMeta, form.values)
        Object.keys(obj).forEach((key) => {
            // @ts-ignore
            if (obj[key] === '' || (equals(obj[key], defaults[key]) && equals(obj[key] !== mapMeta[key]))) {
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
        <Select
            label="Язык интерфейса карты"
            description="Будет использован в интерфейсе"
            data={[
                {value: 'EN', label: '🇬🇧 Английский'},
                {value: 'RU', label: '🇷🇺 Русский'},
            ]}
            {...form.getInputProps('lang')}
        />
        <ColorInput label="Цвет точек и полигонов по умолчанию" {...form.getInputProps('defaultColor')} />
        <TextInput
            label="Ссылка на проект"
            description={`Будет показана внизу на странице с картой (с текстом «О проекте „${
                !!form.getInputProps('title').value
            }“»)`}
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
                    setIsLoading(true)
                    onSubmit(newMapMeta)
                }}>Сохранить</Button>
            <Button onClick={() => routeChange(mapId)}>Открыть карту</Button>
        </Group>
    </>
}
