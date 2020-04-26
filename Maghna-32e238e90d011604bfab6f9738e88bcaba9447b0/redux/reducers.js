/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */
import { combineReducers } from 'redux';
import initialState from './initialState';
// import { Alert } from 'react-native';
// import firebase from '../constants/FireBase.js';



const updateHomeSwitches = (state = initialState.homeSwitches, action) => {
  // console.log("--------------------------------------------");
  // console.log(initialState.homeSwitches);
  // console.log('------------///////////');
  // console.log(state);
  // console.log('============');
  // console.log(JSON.parse(JSON.stringify(state))
    switch (action.type) {
      case 'TOGGLE':
        // console.log("--------------------------------------------");
        // console.log(state.then(res => {
        //   console.log(res)
        // }));
        // var tempState = JSON.parse(JSON.stringify(state));
        // console.log(tempState)
        // _toggleWithFirebaseUpdate(tempState[action.index],action.index).then((response) => {
        //   tempState[action.index] = response;
        //   // let toggleState = state.toggle2 === undefined || Boolean(state.toggle2) === true ? true : false;
        //   // console.log({ ...state, toggle2: !toggleState })
        //   // console.log(state)
        //   // return { ...state, toggle2: !toggleState };
        //
        // });

        return {...state, toggle2: action.value};

      case 'SET':
        var tempState = JSON.parse(JSON.stringify(state));
        tempState[action.index] = action.value;
        return { ...tempState };
      case 'INITIAL':
        return state;
      default:
        return state;
    }
}



const _toggleWithFirebaseUpdate = async (toggleIndexValue,toggleIndex) =>
{

    let routineInfo = {
      toggle1: {
        name: "come routine",
        alert:
          " You haven't created a homecoming mode before, you must first create it",
      },
      toggle3: {
        name: "leave routine",
        alert: " You haven't created an exit home mode before, you first have to create it",
      },
      toggle2: {
        name: "morning routine",
        alert: " You haven't created Morning Mode before, you must first create it",
      },
      toggle4: {
        name: "night routine",
        alert: " You haven't created evening mode before, you have to first create it",
      },
    };
   let request = new Promise((resolve, reject) => {

      let theId;
      let routineName = routineInfo[toggleIndex].name;
      let user = firebase.auth().currentUser;
      let  userRoutineArr =[];
      let alertDisplay = false;
      let returnToggleValue = !toggleIndexValue;
      if (returnToggleValue){
         firebase.database().ref('/routine').on("value",snapshot=>{
            snapshot.forEach(item => {
               let temp = item.val();
               if(temp.userID == user.uid){

                  userRoutineArr.push(temp.name);
               }//end if
               if(userRoutineArr.indexOf(routineName)!= -1){
                  theId = item.key;
                  firebase.database().ref('routine/'+theId).update(  {
                     status: 1,

                  });
                  resolve(returnToggleValue);
               }

            });//end forEach
            if (userRoutineArr.indexOf(routineName)== -1){

               if(!alertDisplay)
               {
                  Alert.alert("عذراً", routineInfo[toggleIndex].alert);
                  alertDisplay = true;
                  resolve(!returnToggleValue);
               }
            }
         }); //end snapshot..

      }
      else {
         firebase.database().ref('/routine').on("value",snapshot=>{
            snapshot.forEach(item => {
               let temp = item.val();
               if(temp.userID == user.uid){

               userRoutineArr.push(temp.name);
               }//end if
               if(userRoutineArr.indexOf(routineName)!= -1){
                  theId = item.key;
                  firebase.database().ref('routine/'+theId).update(  {
                     status: 0,
                  });
               }
              resolve(returnToggleValue);
            });//end forEach
         }); //end snapshot..
      }
   });

   return request;
}

export default combineReducers({
  homeSwitches : updateHomeSwitches
})
