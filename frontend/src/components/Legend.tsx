import '../css/map/legend.css'

import React, {useEffect, useMemo, useState} from 'react'
import {Group, Select} from '@mantine/core'
import {useDispatch, useSelector} from 'react-redux'
import {featuresSelector, headersByDirectiveSelector} from '../selectors'
import {headerToUniqueProps, normalizeValues, notEmpty} from '../util'
import {fromPairs, head, keys, last, pipe} from 'ramda'
import {Actions} from '../actions'
import {LEGEND_COLORS, TRANSITION_DURATION} from '../const'
import {Directive} from '../model'
import {ValuesWithHeader} from '../types'

export const Legend: React.FC = () => {
	const dispatch = useDispatch()

	const features = useSelector(featuresSelector)
	const legendHeaders = useSelector(
		headersByDirectiveSelector(Directive.FOOTER_LEGEND)
	)

	const propsByHeader: Record<string, string[]> = useMemo(() => fromPairs(
		legendHeaders
			.map(headerToUniqueProps(features))
			.filter((header) => notEmpty(head(header)))
			.map<ValuesWithHeader>(([header, props]) => [
				header,
				normalizeValues(props)
			]).filter(pipe(last, notEmpty))
	), [legendHeaders])

	const headers = useMemo(() => keys(propsByHeader), [])
	// TODO: prove that it cannot be null
	const [selectedHeader, setSelectedHeader] = useState(head(headers)!)

	useEffect(() => {
		dispatch(Actions.setLegend(propsByHeader))
		dispatch(Actions.setLegendHeader(selectedHeader))
	}, [features, selectedHeader])

	return (
		<Group style={{gap: '12px 16px'}}>
			{headers.length > 1 && (
				<Select
					id="legendSelect"
					size="sm"
					data={headers}
					onChange={(value) => {
						setSelectedHeader(value!)
						dispatch(Actions.setLegendHeader(value!))
					}}
					value={selectedHeader}
					clearable={false}
					searchable={false}
					dropdownPosition="top"
					allowDeselect={false}
					transition="skew-down"
					transitionDuration={TRANSITION_DURATION}
				/>
			)}

			{propsByHeader[selectedHeader].map((label, i) => (
				<Group key={i} className="legendEntity" spacing={6}>
					<div
						className="legendBox"
						style={{background: LEGEND_COLORS[i % LEGEND_COLORS.length]}}
					/>
					<div className="legendText" color={'dimmed'}>
						{label}
					</div>
				</Group>
			))}
		</Group>
	)
}
