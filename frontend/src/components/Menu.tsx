import {Center, Group, Image, Space, Text} from "@mantine/core";
import {Link, NavLink} from "react-router-dom";
import React from "react";
import {IUser} from "../model/model";
import {Logout, UserCircle} from "tabler-icons-react";
import {useCookies} from "react-cookie";
import {getUser} from "./utils/userUtils";
import axios from "axios";
import {noop} from "../util";

export const Menu: React.FC = () => {
    const user: IUser | null = getUser()
    const [cookies, setCookie, removeCookie] = useCookies();

    const logOut = () => {
        removeCookie('session');
        localStorage.removeItem('user');
        axios.post("/api/logout").then(noop);
    }

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
                <Link to={"/about"}>О проекте</Link>&nbsp;|&nbsp;
                {
                    !!user
                        ? <span className="profile"><UserCircle/> {user.email} <Link to="/logout"
                                                                                     onClick={logOut}><Logout/></Link></span>
                        : <Link to="/login">Вход</Link>
                }
            </Text>
        </Group>
    </Center>
}