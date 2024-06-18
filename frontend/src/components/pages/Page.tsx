import {AppShell, Center, SimpleGrid, Space} from "@mantine/core";
import React from "react";
import {Menu} from "../Menu";

interface IProps {
    childComponent: React.ReactNode
}

export const Page: React.FC<IProps> = (props) => {
    const {childComponent} = props

    return <AppShell
        padding="lg"
        header={<><Space h='lg'/><Menu/></>}
        fixed
    >
        <Space h='md'/>
        <Center>
            <SimpleGrid style={{width: '600px'}}>
                {childComponent}
            </SimpleGrid>
        </Center>
        <Space h='xl'/>
    </AppShell>
}