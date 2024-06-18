import React from 'react'
import {Anchor, MantineSize, Text} from '@mantine/core'
import {metadataSelector} from '../selectors'
import {useSelector} from 'react-redux'
import dayjs from 'dayjs'
import {PROJECT_START_YEAR, REPO_URL, SVMD_VERSION} from '../const'

export const Attribution: React.FC = () => {
    const {title, link} = useSelector(metadataSelector)

    const years = (() => {
        const currentDate = dayjs().year()
        return (PROJECT_START_YEAR == currentDate ? `${PROJECT_START_YEAR}–` : '') + currentDate
    })()

    const textSize: MantineSize = 'sm'
    return (
        <Text align="left" size={textSize}>
            {title && link && (
                <>
                    О&nbsp;проекте&nbsp;
                    <Anchor href={link} underline target="_blank" size={textSize}>«{title}»</Anchor>
                    &nbsp;·&nbsp;
                </>
            )}
            Made with&nbsp;
            <Anchor
                href="https://leafletjs.com"
                underline
                title="A JS library for interactive maps"
                size={textSize}
            >Leaflet</Anchor>
            &nbsp;· TMS by&nbsp;Basemaps ·&nbsp;
            <Anchor
                href="https://www.behance.net/gallery/85172675/NAMU-typefaces"
                underline
                title="NAMU font by Dmitry Rastvortsev"
                size={textSize}
            >NAMU</Anchor>
            &nbsp;font ·&nbsp;
            Powered by&nbsp;
            <Anchor href={REPO_URL} underline target="_blank" size={textSize}>svmd</Anchor>
            &nbsp;v{SVMD_VERSION}&nbsp;·&nbsp;{years}
        </Text>
    )
}
