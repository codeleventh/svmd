import axios, {AxiosError} from 'axios'
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Errors} from '../model'
import {IApiResponse} from './rests'
import {Actions} from '../actions'
import {useDispatch} from 'react-redux'
import {Center, Loader} from '@mantine/core'
import {ErrorTemplate} from './ErrorTemplate'
import {Footer} from './Footer'
import {Map} from './Map'
import {DATETIME_FORMAT} from '../const'
import dayjs from 'dayjs'

interface IParams {
	mapId: string;
}

export const MapPage: React.FC = () => {
	const {mapId} = useParams<IParams>()
	const [response, setResponse] = useState<IApiResponse | null>(null)

	useEffect(() => {
		axios
			.get(`/api/map/${mapId}`)
			.then((response) => response.data)
			.then((response) => setResponse(response))
			.catch((e: AxiosError) => {
				console.error(`${JSON.stringify(e)}`)
				if (e.code === 'ECONNREFUSED' || e.code === 'ECONNABORTED')
					setResponse({
						success: false,
						errors: [Errors.BACKEND_IS_UNAVAILABLE(e.message)]
					})
				else setResponse({success: false, errors: [Errors.BAD_BACKEND_RESPONSE(e.message)]})
			})
	}, [mapId])

	const dispatch = useDispatch()
	if (response?.success) {
		const {body, warnings} = response
		const {metadata, directives, geojson} = body

		dispatch(Actions.setMeta(metadata))
		dispatch(Actions.setDirectives(directives))
		dispatch(Actions.setFeatures(geojson.features.map((f, i) => ({...f, index: i}))))

		console.info(`📍 Используется редакция от ${dayjs().format(DATETIME_FORMAT)}`)
		if (metadata.title) document.title = metadata.title + ' · ' + document.title
		warnings?.forEach((warning) => console.log('⚠️ ' + warning))
	}

	return (<>
		{!response ? (
			<div className="error-wrapper">
				<Center><Loader/></Center>
			</div>
		) : !response.success ? (<ErrorTemplate errors={response.errors} warnings={response.warnings}/>) :
			<><Map/><Footer/></>
		}
	</>)
}

export default MapPage
