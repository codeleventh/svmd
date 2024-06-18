import {Center, Group, Image, Space, Text} from "@mantine/core";
import {Link, NavLink} from "react-router-dom";
import React from "react";

export const Menu: React.FC = () => {
    return <Center>
        <Group id="menu">
            <NavLink to={"/"}>
                <Image
                    id="logo"
                    src={require('../img/logo-dark-48px.png')}
                    height={48}
                    width='auto'
                    alt=''
                /></NavLink>
            <Space h='md'/>
            <Text size='lg'>
                <Link to={"/create"}>Создать карту</Link>&nbsp;·&nbsp;
                <Link to={"/maplist"}>Мои карты</Link>&nbsp;·&nbsp;
                <Link to={"/manual"}>Справка</Link>&nbsp;·&nbsp;
                <Link to={"/about"}>О проекте</Link>
            </Text>
        </Group>
    </Center>
}