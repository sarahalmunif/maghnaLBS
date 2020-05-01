import { TOGGLE_LIGHT } from "../actions/types";

const initialState = {
    lightStatus: false
}
const toggleLight = (state = initialState, action) => {
    switch (action.type) {

        case TOGGLE_LIGHT:
            return { ...state, lightStatus: action.data };

        default:
            return state;
    }

}

export default toggleLight;