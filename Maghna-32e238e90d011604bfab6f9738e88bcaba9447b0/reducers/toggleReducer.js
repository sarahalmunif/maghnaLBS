
import { UPDATE_TOGGLE } from '../actions/types'
import * as firebase from 'firebase';
import { Alert } from 'react-native';







const initialState = {
    toggle1: false,
    toggle2: false,
    toggle3: false,
    toggle4: false
}
const toggle1 = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TOGGLE:
            console.log('status:  ', action.data);
            // doFirebase(!state.toggle1, 'come routine');

            console.log('status: ', action.data);
            console.log('btn: ', action.btn);

            if (action.btn == 1) {
                updateRoutine(action.data, 'come routine');
                return { ...state, toggle1: action.data };
            } else if (action.btn == 2) {
                updateRoutine(action.data, 'morning routine');

                return { ...state, toggle2: action.data };
            }
            else if (action.btn == 3) {
                updateRoutine(action.data, 'leave routine');

                return { ...state, toggle3: action.data };
            }
            else if (action.btn == 4) {
                updateRoutine(action.data, 'night routine');

                return { ...state, toggle4: action.data };
            }
            else {
                return state;
            }



        default:
            return state;
    }

}


function updateRoutine(cond, routineName) {

    console.log("firebase: ", cond);

    let theId;
    let user = firebase.auth().currentUser;
    let userRoutineArr = [];

    let newStatus;

    if (cond) {
        newStatus = 1;
    } else {
        newStatus = 0;
    }


    firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
            let temp = item.val();
            if (temp.userID == user.uid) {
                userRoutineArr.push(temp.name);
            }//end if
            if (temp.name == routineName) {
                theId = item.key;
                firebase.database().ref('routine/' + theId).update({
                    status: newStatus,
                });
            }
        });//end forEach
        if (userRoutineArr.indexOf(routineName) == -1) {
            Alert.alert("عذراً", " لم تقم بإنشاء  هذا الوضع من قبل ، عليك أولاً إنشاؤه");
        }
    }); //end snapshot..





}
export default toggle1;