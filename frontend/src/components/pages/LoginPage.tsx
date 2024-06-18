import React, {useEffect, useState} from 'react'
import {isLocalStorageAvailable} from "../utils/userUtils";
import {useForm, zodResolver} from "@mantine/form";
import {pipe, prop} from "ramda";
import {errorHandler, responseToNotification} from "../utils/apiUtils";
import {IMapMeta} from "../../model/model";
import {AlertCircle} from "tabler-icons-react";
import {Button, Group, Notification, PasswordInput, TextInput} from "@mantine/core";
import {z} from 'zod';
import {IApiResponse} from "../../model/rests";
import axios from 'axios';

export const LoginPage: React.FC = () => {
    const noLocalStorage = !isLocalStorageAvailable();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        schema: zodResolver(z.object({
            email: z.string().email('Введите корректный адрес почты'),
            password: z.string().min(8, {message: 'Пароль должен быть не короче 8 символов'})
        })),
    });

    const onSubmit = (values: { email: string, password: string }) => axios
        .post(`/api/login`, {}, {params: values})
        .then(pipe(prop('data'), setResponse))
        .catch(pipe(errorHandler, setResponse))

    const [response, setResponse] = useState<IApiResponse<IMapMeta[]>>()
    useEffect(() => {
        if (response?.success) {
            const timer = setTimeout(() => {
                document.location = '/';
                localStorage.setItem('user', JSON.stringify({email: form.getInputProps('email').value}));
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [response])

    return <>
        {!response ? <></> : responseToNotification(response)}
        {isLocalStorageAvailable() ? <></> :
            <Notification disallowClose icon={<AlertCircle floodColor='red'/>} color="red">
                Для входа требуется включенное в настройках браузера локальное хранилище (local storage)
            </Notification>}
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput
                label='E-mail'
                disabled={noLocalStorage}
                {...form.getInputProps('email')}
                required
            />
            <PasswordInput
                label='Пароль'
                disabled={noLocalStorage}
                {...form.getInputProps('password')}
                required
            />

            <Group position='left' mt='md'>
                <Button type='submit' disabled={noLocalStorage}>Вход</Button>
            </Group>
        </form>
    </>
}

