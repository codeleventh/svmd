import {IUser} from "../../model/model";

export const isLocalStorageAvailable = () => !!window.localStorage && typeof window.localStorage === 'object'

export const getUser: () => IUser | null = () => {
    if (!isLocalStorageAvailable())
        return null

    const user = localStorage.getItem('user')
    if (!!user) return JSON.parse(user) as IUser
    else return null
}