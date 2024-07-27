import React, {useEffect, useState} from 'react'
import {Center, Loader} from "@mantine/core";
import {isNil, pipe, prop} from "ramda";
import {IMapMeta} from "../../model/model";
import axios from "axios";
import {errorHandler} from "../utils/apiUtils";
import {IApiResponse, ISuccessResponse} from "../../model/rests";
import {EditForm} from "../EditForm";
import {ErrorTemplate} from "../ErrorTemplate";

interface IProps {
    mapId: string
}

export const EditPage: React.FC<IProps> = (props: IProps) => {
    const mapId = props.mapId

    const [mapMeta, setMapMeta] = useState<IMapMeta>()
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState<IApiResponse<IMapMeta>>()
    const [putResponse, setPutResponse] = useState<IApiResponse<{}>>()

    useEffect(() => {
        setIsLoading(false)
        axios.get(`/api/meta/${mapId}`)
            .then((response) => {
                setResponse(response.data)
                setMapMeta((response.data as ISuccessResponse<IMapMeta>).body)
            }).catch(errorHandler)
            .finally(() => setIsLoading(false))
    }, [])

    const onSubmit = (newMapMeta: IMapMeta) => {
        setIsLoading(true)
        axios.put(`/api/meta/${mapId}`, newMapMeta)
            .then(pipe(prop('data'), setPutResponse, () => setMapMeta(newMapMeta)))
            .catch(pipe(errorHandler, setPutResponse))
            .finally(() => setIsLoading(false))
    }

    return <>
        {isNil(response) && <div id="error-wrapper"><Center><Loader/></Center></div>}
        {!!response && !response.success && <ErrorTemplate errors={response.errors}/>}
        {!!response && response.success && !!mapMeta &&
        <EditForm mapMeta={mapMeta!!} onSubmit={onSubmit} isLoading={isLoading} putResponse={putResponse}/>}
    </>
}

