import '../css/error.css'

import React from 'react'
import {
    Card as MantineCard,
    Center,
    Group,
    List,
    ListItem,
    MantineProvider,
    ScrollArea,
    Space,
    Title,
    useMantineTheme
} from '@mantine/core'
import {AlertCircle, AlertTriangle} from 'tabler-icons-react'
import {useSelector} from "react-redux";
import {themeSelector} from "../selectors";

interface IProps {
    errors: string[],
    warnings?: string[],
    stackTrace?: string
}

export const ErrorTemplate: React.FC<IProps> = (props: IProps) => {
    const {errors, warnings, stackTrace} = props
    const mantineTheme = useMantineTheme()
    const theme = useSelector(themeSelector)

    // TODO: there will be a crash if the backend will not respond
    return <MantineProvider theme={mantineTheme}>
        <div id='error-wrapper'>
            <Center p="xl">
                <MantineCard shadow="md">
                    <Center><Title order={3}><AlertTriangle/> ️Ошибка</Title></Center>
                    <Space h='sm'/>
                    <Group>
                        <List
                            icon={<AlertCircle color={mantineTheme.colors.red[5]}/>}>
                            {errors.map((err, i) => <ListItem key={i}>{err}</ListItem>)}
                        </List>
                    </Group>
                    {warnings && <>
                        <Space h='sm'/>
                        <Group>
                            <List icon={<AlertCircle color={mantineTheme.colors.yellow[5]}/>}>
                                {warnings?.map((warn, i) => <ListItem key={i}>{warn}</ListItem>)}
                            </List>
                        </Group>
                    </>}
                    {console.log(warnings)}
                    {stackTrace && <>
                        <Space h='sm'/>
                        <Group>
                            <ScrollArea
                                type='always'
                                style={{height: 480}}
                                className='error-stack'>{stackTrace}
                            </ScrollArea>
                        </Group>
                    </>}
                </MantineCard>
            </Center>
        </div>
    </MantineProvider>
}