import React, {useEffect, useState} from 'react'
import {Center, Loader, Notification, Table} from "@mantine/core";
import {Edit, InfoCircle} from "tabler-icons-react";
import {Link} from "react-router-dom";
import {DATETIME_FORMAT, DEFAULT_FEATURE_NAME} from "../../const";
import dayjs from "dayjs";
import {ErrorTemplate} from "../ErrorTemplate";
import {errorHandler} from "../utils/apiUtils";
import {pipe, prop} from "ramda";
import axios from 'axios';
import {IApiResponse} from "../../model/rests";
import {IMapMeta} from "../../model/model";

export const MapListPage: React.FC = () => {
    const [response, setResponse] = useState<IApiResponse<IMapMeta[]>>()

    useEffect(() => {
        axios.get('/api/meta')
            .then(pipe(prop('data'), setResponse))
            .catch(pipe(errorHandler, setResponse))
    }, [])

    return (<>
        {!response
            ? <div id="error-wrapper"><Center><Loader/></Center></div>
            : !response.success
                ? <ErrorTemplate errors={response.errors} warnings={response.warnings}/>
                : !response.body.length
                    ? <Notification disallowClose icon={<InfoCircle floodColor='indigo'/>}>У вас ещё нет карт.
                        Попробуйте <Link to='/create'>создать</Link> свою первую карту.</Notification>
                    : <><Table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Язык</th>
                            <th>Создана</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {response.body.map((row, i) => <tr key={i}>
                                <td><Link to={`/${row.identifier}`}>{row.identifier}</Link></td>
                                <td>{row.title ?? DEFAULT_FEATURE_NAME}</td>
                                <td>{row.lang}</td>
                                <td>{dayjs(row.createdAt).format(DATETIME_FORMAT)}</td>
                                <td>
                                    <td><Link to={`/${row.identifier}/edit`}><Edit/></Link></td>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table></>
        }
    </>)
}
