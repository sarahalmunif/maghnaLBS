import { combineReducers } from 'redux';
import toggle1Reducer from './toggleReducer';
import countReducer from './countReducer';
import lightReducer from './lightReducer';

export default combineReducers({
    toggle1Reducer: toggle1Reducer,
    countReducer: countReducer,
    lightReducer: lightReducer,
});