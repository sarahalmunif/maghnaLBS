import { TOGGLE_LIGHT } from "./types";



export const toggleLight = (flag) => ({
    type: TOGGLE_LIGHT,
    data: flag
});