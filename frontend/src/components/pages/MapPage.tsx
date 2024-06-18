import '../../css/map/leaflet.css'
import '../../css/map/leaflet-overrides.css'

import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {ConvertedMap, IApiResponse} from '../../model/rests'
import {Actions} from '../../actions'
import {useDispatch} from 'react-redux'
import {Center, Loader} from '@mantine/core'
import {ErrorTemplate} from '../ErrorTemplate'
import {Footer} from '../Footer'
import {Map} from '../Map'
import {DATETIME_FORMAT} from '../../const'
import dayjs from 'dayjs'
import {pipe} from "ramda";
import {errorHandler} from "../utils/apiUtils";

interface IParams {
	mapId: string;
}

export const MapPage: React.FC = () => {
	const {mapId} = useParams<IParams>()
	const [response, setResponse] = useState<IApiResponse<ConvertedMap>>()

	useEffect(() => {
		axios
			.get(`/api/map/${mapId}`)
			.then((response) => response.data)
			.then((response) => setResponse(response))
			.catch(pipe(errorHandler, setResponse))
	}, [mapId])
	const dispatch = useDispatch()
	if (response?.success) {
		const {body, warnings} = response
		const {metadata, directives, geojson} = body

		dispatch(Actions.setMeta(metadata))
		dispatch(Actions.setDirectives(directives))
		dispatch(Actions.setFeatures(geojson.features.map((f, i) => ({...f, index: i}))))

		console.info(`📍 Используется редакция от ${dayjs().format(DATETIME_FORMAT)}`)
		if (metadata.title) document.title = `${metadata.title} · svmd`
		warnings?.forEach((warning) => console.log('⚠️ ' + warning))
	}

	return (<>
		{!response ? (
			<div id="error-wrapper">
				<Center><Loader/></Center>
			</div>
		) : !response.success ? (<ErrorTemplate errors={response.errors} warnings={response.warnings}/>) :
			<><Map/><Footer/></>
		}
	</>)
}

// TODO: map/{mapId}?iframe

export default MapPage
