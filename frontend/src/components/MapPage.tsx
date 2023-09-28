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
				console.error(`⚠ ${JSON.stringify(e)}`)
				if (e.code === 'ECONNABORTED') setResponse({
					success: false,
					errors: [Errors.BACKEND_IS_UNAVAILABLE(e.message)]
				})
				else setResponse({success: false, errors: [Errors.BAD_BACKEND_RESPONSE(e.message)]})
			})
	}, [mapId])

	const dispatch = useDispatch()
	if (response?.success) {
		const {warnings} = response
		const {metadata, geojson, directives} = response

		dispatch(Actions.setMeta(metadata))
		dispatch(Actions.setDirectives(directives))
		dispatch(Actions.setFeatures(geojson.features.map((f, i) => ({...f, id: i}))))

		if (metadata.title) document.title = metadata.title + ' · ' + document.title
		warnings?.forEach((warning) => console.log(`⚠ ${warning}`))
	}

	return (
		<>
			{!response ? (
				<div className="error-wrapper">
					<Center>
						<Loader/>
					</Center>
				</div>
			) : !response.success ? (<ErrorTemplate errors={response.errors}/>) : <>
				<Map/><Footer/>
			</>}
		</>
	)
}

export default MapPage
