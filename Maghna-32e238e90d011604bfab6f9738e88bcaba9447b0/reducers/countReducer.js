
import { ICN_COUNTER, STOP_COUNTER, SET_COUNTER } from '../actions/types'
import firebase from 'firebase';



const initialState = {
    count: 0
}
const count = (state = initialState, action) => {
    switch (action.type) {

        case SET_COUNTER:
            console.log(action.data);
            
            return { ...state, count: +action.data };

        case ICN_COUNTER:
            console.log('status:  ', state);

            return { ...state, count: ++state.count };

        case STOP_COUNTER:

            var user = firebase.auth().currentUser;
            var uid = user.uid;

            firebase.database()
                .ref('mgnUsers/' + uid)
                .update({ count: action.data })

            return state;

        default:
            return state;
    }

}

export default count;