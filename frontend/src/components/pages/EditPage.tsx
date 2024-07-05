import React, {useEffect, useState} from 'react'
import {Center, Loader} from "@mantine/core";
import {isNil, pipe, prop} from "ramda";
import {IMapMeta} from "../../model/model";
import axios from "axios";
import {errorHandler} from "../utils/apiUtils";
import {IApiResponse} from "../../model/rests";
import {EditForm} from "../EditForm";
import {ErrorTemplate} from "../ErrorTemplate";

interface IProps {
    mapId: string
}

export const EditPage: React.FC<IProps> = (props: IProps) => {
    const mapId = props.mapId

    const [response, setResponse] = useState<IApiResponse<IMapMeta>>()
    useEffect(() => {
        axios.get(`/api/meta/${mapId}`)
            .then(pipe(prop('data'), setResponse))
            .catch(errorHandler)
    }, [])

    return <>
        {isNil(response) && <div id="error-wrapper"><Center><Loader/></Center></div>}
        {!!response && !response.success && <ErrorTemplate errors={response.errors}/>}
        {!!response && response.success && <EditForm mapMeta={response.body}/>}
    </>
}

