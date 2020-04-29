import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppNavigator from "./navigation/AppNavigator";
//import Header from './components/Header';
import STTButton from "./STTButton";
import global from "./global";
import { AsyncStorage } from "react-native";
import NavigationService from "./navigation/NavigationService";
import * as firebase from 'firebase';

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
/*
 *  Redux for state management
 */
import { Provider } from "react-redux";
//import configureStore from "./redux/createStore";
const BACKGROUND_FETCH_TASK = 'background-fetch';
//let store = configureStore();

// import configureStore from "./redux/createStore";
 
import store from './store/index';
export default function App(props) {
  const [displayMic, setDisplayMic] = useState(false);
  const [buttonDisplay, setButtonDisplay] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    retrieveLoginStatus();
    console.log("displayMic is:" + displayMic);
  });

  async function retrieveLoginStatus() {
    if (displayMic) {
      return;
    }

    try {
      let display = await AsyncStorage.getItem("loggedIn");

      if (display == "friday") {
        console.log(
          "11- were inside retrieving from asyncStorage and display=" + display
        );
        setDisplayMic(true);
      }
    } catch (e) {
      console.log("error retrieving login status");
    }
  }

  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {/* <Header/> */}

          {Platform.OS === "ios" && <StatusBar barStyle="default" />}

          <AppNavigator
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            onNavigationStateChange={(prevState, currentState) => {
              if (
                currentState.routes[currentState.index].routeName ==
                "WelcomeStackNavigator"
              ) {
                setButtonDisplay(false);
              } else {
                setButtonDisplay(true);
              }
            }}
          ></AppNavigator>
          {buttonDisplay && (
            <View
              style={{
                position: "absolute",
                display: "flex",
                zIndex: 1000,
                bottom: 85,
                right: 20,
              }}
            >
              <View style={[styles.buttonContainer]} store={store} >
                <STTButton />
              </View>
            </View>
          )}
        </View>
      </Provider>
    );
  }
}
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
   // this will execute every minute when the app in background , we do the same thing when the app in foreground (method   _handleAppStateChange )in STTbutton class 
  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
 
  var hourInt;
  var hour24 ; 
 var user = firebase.auth().currentUser;
 var actionArr =[] ;
 var date = new Date();
var hour = date.getHours();
var mins = date.getMinutes();

console.log(hour + ":" + mins)
var timez = date.toLocaleTimeString();
console.log("the Time:"+ timez);
console.log('am/pm');
console.log('after ' + timez.substring(0,2))
var timeH = timez.substring(0,2);
hourInt = parseInt(timeH);
console.log('hourGlobal Task manager :'+hourInt);
if ( timez.substring(8) == 'PM' || hour == 0 ){
 

 hour24= 12+  hourInt;
 console.log("hour in manager " + hour24);

}
else {
  hour24 = hour ; 
}

var timeM= timez.substring(2,4);
var minInt = parseInt(mins);
;


var hourInRiyadh;
if(hourInt == 22 ){

 hourInRiyadh =1;
}
else if ( hourInt == 23){
 hourInRiyadh = 2 ;
}
else if ( hourInt ==24){
 hourInRiyadh = 3;
}
else {
 var hourInRiyadh = hourInt +3 ;
 console.log('Riyadh'+hourInRiyadh)
}

//var user = context.auth;
 var routineArr  = [];

var routineTrig = [];

var j,i;
var routineName ; 
var routineTime  ; 
var RminInt ,  RhourInt;

firebase.database().ref('/routine').once("value").then((snapshot)=>{
console.log("enter to database");


snapshot.forEach(item => {
 var temp = item.val();
 actionArr = temp.actionsID;
 console.log(actionArr);
 routineName = temp.name;
 console.log(routineName)
 routineTime= temp.time;
 hour = routineTime.substring (0,2);
 minute = routineTime.substring(3);
 RminInt = parseInt(minute);
 RhourInt = parseInt(hour);
 console.log('data' + RhourInt + ":" + RminInt);
 console.log("the time in r " + hour24 + "min" + mins)
 if(hour24 == RhourInt && RminInt == mins && temp.status == 1&& temp.userID == user.uid){
     if (temp.actionsID.indexOf("001")!= -1){
         console.log("It is true id is 001")
         axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
          {on:true} )
        .then(res => res.json())
        console.log("I turn on");
        this.setState({ isOn: true });
        Helper.setLightStatus(true);
     }
     else if(temp.actionsID.indexOf("002")!= -1) {
      console.log("It is true id is 002")
         axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
         {on:false} )
       .then(res => res.json())
       console.log("I turn off");
       this.setState({ isOn: false });
        Helper.setLightStatus(false);
     }
 }

 
}); //end forEach ..
});


      
  return BackgroundFetch.Result.NewData;
});
TaskManager.defineTask('locationTask', async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("I am at defienTask with error" );
    return;
  }
  if (data) {
    const { locations } = data;

   console.log("I am at defienTask with data" );
   console.log("Location "+ locations );
    console.log("data region "+data.region.state);
   // const polygon = RoutineScreen.createPolygon();
   /* const point= {
        lat: locations.coords.latitude,
        lng: locations.coords.longitude
    };*/
  //  GeoFencing.containsLocation(point,polygon)
   // .then(() =>
   console.log("before database");
    firebase.database().ref('routine/').once('value',(snap)=>{ 
        snap.forEach((child)=>{
            if(child.val().userID===firebase.auth().currentUser.uid )
            if (data.region.state===1){   
              console.log("data region "+data.region.state);
              if(child.val().name==='come routine')
              {
                  if(child.val().actionsID[0]==='001'){

                      console.log("the light must be turend on user entern")
                      axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                      {on:true} )
                   
                   .catch((error) => {
                    console.log();
                  });
                    }
                    else {
                      console.log("the light must be turend off user entern")
                      axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                      {on:false} )
                    
                    .catch((error) => {
                      console.log();
                    });
                    }
              }

            }
            if (data.region.state===2){
             // console.log("the light must be turend on user leave before")
                if(child.val().name==='leave routine' ){
                  console.log("inside leave home")
                  if(child.val().actionsID[0]==='001'){
                      console.log("the light must be turend on user leave")
                     axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                      {'on':true} )
                    
                    }
                    else {
                      console.log("the light must be turend off user leave")
                     axios.put('http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                      {'on':false} )
                    
                    }

                }


            }
            
   
    // do something with the locations captured in the background
    //console.log('point is within polygon');
       } )
      })
     // )
      }
  }); 
//await return AsyncStorage.getItem("loggedIn")
async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png"),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 65,
    width: 250,
    //     borderRadius:30,
    //     shadowOpacity: 0.17,
    //     backgroundColor: '#fff',
  },
});
