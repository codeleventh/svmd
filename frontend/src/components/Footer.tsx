import '../css/footer.css'

import {SimpleGrid} from '@mantine/core'
import {Attribution} from './Attribution'
import React from 'react'

export const Footer: React.FC = () => {
    return <SimpleGrid
        id="footer"
        className={'leaflet-override'} spacing={'sm'}
        sx={(theme) => {
            const color = theme.colorScheme === 'dark' ? 'black' : 'white'
            return {
                boxShadow: `0 -5px 10px 0 ${color} !important`,
                backgroundColor: color
            }
        }}>
        <Attribution/>
    </SimpleGrid>
}