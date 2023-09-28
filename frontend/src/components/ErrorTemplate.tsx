import '../css/error.css'

import React from 'react'
import {Card as MantineCard, Center, Group, List, ListItem, ScrollArea, Space, Title} from '@mantine/core'
import {AlertCircle, AlertTriangle} from 'tabler-icons-react'

interface IProps {
    errors: string[],
    stackTrace?: string
}

export const ErrorTemplate: React.FC<IProps> = (props: IProps) => {
    const {errors, stackTrace} = props

    return <div className={'error-wrapper'}>
        <Center p="xl">
            <MantineCard shadow="md">
                <Group>
                    <Title order={4}><AlertTriangle style={{verticalAlign: 'top'}}/> ️Ошибка</Title>
                </Group>
                <Space h='sm'/>
                <Group>
                    <List icon={<AlertCircle/>}>
                        {errors.map((err, i) => <ListItem key={i}>{err}</ListItem>)}
                    </List>
                </Group>
                {stackTrace && <>
                    <Space h='sm'/>
                    <Group>
                        <ScrollArea
                            type='always'
                            style={{height: 480}}
                            className='error-stack'>{stackTrace}
                        </ScrollArea>
                    </Group></>}
            </MantineCard>
        </Center>
    </div>
}