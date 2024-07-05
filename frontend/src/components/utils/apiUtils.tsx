import {AxiosError} from "axios";
import {Errors} from "../../model/model";
import {IApiResponse, IFailResponse} from "../../model/rests";
import {Notification} from "@mantine/core";
import {AlertCircle, AlertTriangle, CircleCheck} from "tabler-icons-react";
import React from "react";
import {isLocalStorageAvailable} from "./userUtils";
import {defaultTo, hasIn} from "ramda";

export const errorHandler: (e: AxiosError) => IFailResponse = (e) => {
    console.error(`${JSON.stringify(e)}`) // TODO: error messages only
    if (e.code === 'ECONNREFUSED' || e.code === 'ECONNABORTED') {
        return {
            success: false,
            errors: [Errors.BACKEND_IS_UNAVAILABLE(e.message)]
        }
    } else if (e.response?.status === 401 && hasIn('errors', e.response?.data)) {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem('user');
            // ⬑ that's kinda cursed
        }
        return {
            success: false,
            errors: e.response.data.errors
        }
    } else {
        return {
            success: false,
            errors: [Errors.BAD_BACKEND_RESPONSE(e.message)]
        }
    }
}

export function responseToNotification<T>(response: IApiResponse<T>) {
    return response.success
        ? <Notification disallowClose icon={<CircleCheck/>} color="teal">
            {typeof response?.body === 'string' ? response.body : 'OK'}
        </Notification>
        : (defaultTo([], response.warnings).map((warn, i) =>
                <Notification disallowClose icon={<AlertTriangle/>} color='gold' key={`w${i}`}>{warn}</Notification>
            )
        ).concat(
            defaultTo([], response.errors).map((err, i) =>
                <Notification disallowClose icon={<AlertCircle/>} color="red" key={`e${i}`}>{err}</Notification>
            )
        )
}
