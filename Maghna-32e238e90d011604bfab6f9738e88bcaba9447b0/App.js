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
import * as TaskManager from 'expo-task-manager';
import NavigationService from "./navigation/NavigationService";
import * as firebase from 'firebase';
/*
 *  Redux for state management
 */
import { Provider } from "react-redux";
import configureStore from "./redux/createStore";
let store = configureStore();

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
                   //   axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
                   //   {'on':true} )
                  // .then(res => res.json())
                    }
                    else {
                      console.log("the light must be turend off user entern")
                   //   axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
                   //   {'on':false} )
                  //  .then(res => res.json())
                    }
              }

            }
            if (data.region.state===2){
             // console.log("the light must be turend on user leave before")
                if(child.val().name==='leave routine' ){
                  console.log("inside leave home")
                  if(child.val().actionsID[0]==='001'){
                      console.log("the light must be turend on user leave")
                    // axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
                     // {'on':true} )
                   // .then(res => res.json())
                    }
                    else {
                      console.log("the light must be turend off user leave")
                     // axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
                     // {'on':false} )
                   // .then(res => res.json())
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
