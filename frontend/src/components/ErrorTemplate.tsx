import '../css/error.css';

import React from "react";
import {Card as MantineCard, Center, Group, List, ListItem, Title} from "@mantine/core";
import {AlertCircle, AlertTriangle} from "tabler-icons-react";

interface IProps {
    errors: string[],
}

export const ErrorTemplate: React.FC<IProps> = (props: IProps) => {
    const errors = props.errors

    return <div className={'error-wrapper'}>
        <Center p="xl">
            <MantineCard shadow="md">
                <Group>
                    <Title order={4}><AlertTriangle style={{verticalAlign: 'top'}}/> ️Ошибка</Title>
                </Group>
                <Group>
                    <List icon={<AlertCircle/>}>
                        {errors.map(err => <ListItem>{err}</ListItem>)}
                    </List>
                </Group>
            </MantineCard>
        </Center>
    </div>
}