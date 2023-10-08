import '../css/map/card.css'
import '@splidejs/react-splide/css'

import React, {useMemo} from 'react'
import {Popup, Tooltip} from 'react-leaflet'
import {flatten, head, pair, prop} from 'ramda'
import {useSelector} from 'react-redux'
import {headerByDirectiveSelector, headersByDirectiveSelector} from '../selectors'
import {hyphenateSync} from 'hyphen/ru' // TODO: bear in mind that localizations are planned also
import {CARD_LINK_TEXT, DEFAULT_FEATURE_NAME, DEFAULT_PADDING} from '../const'
import {Splide, SplideSlide} from '@splidejs/react-splide'
import Markdown from 'markdown-to-jsx'
import {Anchor, Group, Space, Text, Title} from '@mantine/core'

import {notEmpty, splitTags} from '../util'
import {Directive, IFeature} from '../model'

interface IProps {
    cursedMargin: number;
    feature: IFeature;
}

export const Card: React.FC<IProps> = (cardProps) => {
    // TODO: maybe there should be multiple <Card> layouts for each level of detail
    // (should it be defined for each object or for entire map?)

    const {cursedMargin, feature} = cardProps
    const {properties} = feature

    const name = useSelector(headerByDirectiveSelector(Directive.NAME))
    const previews = useSelector(
        headersByDirectiveSelector(Directive.CARD_PREVIEW)
    )
    const cardInfos = useSelector(
        headersByDirectiveSelector(Directive.CARD_INFO)
    )
    const cardLink = useSelector(headerByDirectiveSelector(Directive.CARD_LINK))
    const cardText = useSelector(headerByDirectiveSelector(Directive.CARD_TEXT))
    const cardColumns = useMemo(() => flatten(
        [previews, cardText, cardInfos, cardLink].filter(notEmpty)
    ), [])

    const isNameUsed = name?.length
    const isCardUsed = useMemo(() =>
        !!cardColumns.length &&
        cardColumns.map((column) => properties[column!]).filter(notEmpty).length
        , [cardColumns])

    const featureName = splitTags(properties[name!]).join(', ')

    const link = properties[cardLink!]

    const images = previews.map((header) => properties[header]).filter(notEmpty)

    const cardInfosJsx = cardInfos
        .map((propName) =>
            pair(propName, splitTags(prop(propName)(properties)).join(', '))
        ).filter((pair) => notEmpty(pair[1]))
        .map((pair, i) => (
            <Text key={i} size="sm" sx={{lineHeight: '1.2'}}>
                <b>{pair[0]}</b>: {pair[1]}
            </Text>
        ))

    return useMemo(() => {
        if (!isCardUsed) {
            return (isNameUsed && featureName) ?
                <Tooltip><Text>{featureName ?? DEFAULT_FEATURE_NAME}</Text></Tooltip> : (<></>)
        } else {
            return <Popup
                className="card"
                autoPanPaddingTopLeft={[DEFAULT_PADDING, cursedMargin + DEFAULT_PADDING]}
                closeOnEscapeKey
            >
                <Title className="cardTitle" align={'center'} order={4}>
                    {featureName ?? DEFAULT_FEATURE_NAME}
                </Title>
                <Group>
                    {!images.length ? (
                        <></>
                    ) : images.length === 1 ? (
                        <div
                            className="cardPhoto"
                            style={{backgroundImage: `url(${head(images)})`}}
                        />
                    ) : (
                        <div className="cardSlides">
                            <Splide
                                options={{
                                    cover: true,
                                    fixedWidth: '380px',
                                    height: '255px'
                                }}>
                                {images.map((image, i) => (
                                    <SplideSlide key={i}>
                                        <img
                                            src={image}
                                            onClick={() => document.open(image)}
                                            alt=""
                                        />
                                        {/* TODO: clickable previews */}
                                    </SplideSlide>
                                ))}
                            </Splide>
                        </div>
                    )}
                </Group>

                <div className="cardInfo">{!cardInfosJsx.length ? <></> : <><Space/>{cardInfosJsx}</>}</div>

                <Text className="cardText">
                    {notEmpty(properties[cardText!]) ? <Space h="xs"/> : <></>}
                    <Markdown options={{
                        overrides: {
                            // <a> => <Anchor>
                            a: {
                                component: Anchor,
                                props: {style: {lineHeight: 'inherit'}}
                            },
                            // <img> => void
                            img: {component: React.Fragment}
                        }
                    }}>{hyphenateSync(properties[cardText!] ?? '')}</Markdown>
                </Text>

                {notEmpty(link) && (
                    <>
                        <Space/>
                        <Anchor href={link} target="_blank" title={CARD_LINK_TEXT}>
                            {CARD_LINK_TEXT}
                        </Anchor>
                    </>
                )}
            </Popup>
        }
    }, [feature, isCardUsed, isNameUsed])
}
