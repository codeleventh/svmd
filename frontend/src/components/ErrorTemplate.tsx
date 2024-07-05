import '../css/error.css'

import React, {useEffect} from 'react'
import {Alert, Center, Group, List, ListItem, MantineProvider, ScrollArea, Space, useMantineTheme} from '@mantine/core'
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

    useEffect(() => console.log(warnings))
    // TODO: there will be a crash if the backend will not respond
    return <MantineProvider theme={mantineTheme}>
        <div id="error-wrapper">
            <Center p="xl">
                <Alert title="Ошибка" color="red">
                    <List
                        icon={<AlertCircle color={mantineTheme.colors.red[5]}/>}>
                        {errors.map((err, i) => <ListItem key={i}>{err}</ListItem>)}
                    </List>
                    {warnings && <>
                        <Space h="sm"/>
                        <Group>
                            <List icon={<AlertTriangle color={mantineTheme.colors.yellow[5]}/>}>
                                {warnings?.map((warn, i) => <ListItem key={i}>{warn}</ListItem>)}
                            </List>
                        </Group>
                    </>}
                    {stackTrace && <>
                        <Space h="sm"/>
                        <Group>
                            <ScrollArea
                                type="always"
                                style={{height: 480}}
                                className="error-stack">{stackTrace}
                            </ScrollArea>
                        </Group>
                    </>}
                </Alert>
            </Center>
        </div>
    </MantineProvider>
}