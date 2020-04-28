import { UPDATE_TOGGLE } from './types'

export const updateToggle = (status,btn) => ({
    type: UPDATE_TOGGLE,
    data: status,
    btn: btn
});

