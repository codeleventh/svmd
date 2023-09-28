import {isEmpty, isNil} from 'ramda'

export const notEmpty = (x: unknown) => !isNil(x) && !isEmpty(x)
export const notNaN = (x: number) => !isNaN(x)
export const noop = () => {
}
