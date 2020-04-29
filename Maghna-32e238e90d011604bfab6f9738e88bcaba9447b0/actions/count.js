import { ICN_COUNTER, SET_COUNTER } from './types'
import { STOP_COUNTER } from './types'

export const incCounter = (count) => ({
    type: ICN_COUNTER,
    data: count
});


export const stopCounter = (count) => ({
    type: STOP_COUNTER,
    data: count
});


export const setCounter = (count) => ({
    type: SET_COUNTER,
    data: count
});

