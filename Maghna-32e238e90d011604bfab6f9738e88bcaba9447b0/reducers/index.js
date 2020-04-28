import { combineReducers } from 'redux';
import toggle1Reducer from './toggleReducer';

export default combineReducers({
    toggle1Reducer: toggle1Reducer,
});