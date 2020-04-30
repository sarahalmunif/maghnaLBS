import React, { Component } from "react";
import {
  StyleSheet, AppState,
  View,
  Platform,
  AsyncStorage,
  Image, Text
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import axios from "axios";
import { Audio } from "expo-av";
import NavigationService from "./navigation/NavigationService";
import * as Helper from "./components/Helper";
import * as firebase from "firebase";
import { Button, ThemeConsumer } from "react-native-elements";
import moment from "moment";
// Here I use this time, I open the package
const rnTimer = require("react-native-timer");
import { connect } from 'react-redux';
import { updateToggle } from './actions/toggle'
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Alert } from 'react-native';
import firebaseInitial from './constants/FireBase.js';
import { incCounter, stopCounter, setCounter } from "./actions/count";
import { toggleLight } from "./actions/light";
const BACKGROUND_FETCH_TASK = 'background-fetch';
const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: 'row'
  },
  Indicator: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    top: 90,

  },
  Indicator1: {
    alignSelf: 'center',
    width: 110,
    height: 110,
    top: 90,

  },

  text: {
    color: "#fff",
  },
});

class SpeechToTextButton extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    routineArr = [];

    this.state = {
      isFetching: false,
      isRecording: false,
      transcript: "",
      appState: AppState.currentState,
      status: null, //status for backfetch
      isRegistered: false,
      //This is the dueation
      //this variable here in STTButton I use to store the duration in seconds in
      curTime: 0,
      isOn: true,
      TTSInstruction: false,
      TTSConnectedDevices: false,
      TTSReport: false,

      info: "",

    };

  }



  TTSInstruction = async () => {
    try {
      await AsyncStorage.setItem("TTSInstruction", "" + this.state.TTSInstruction);
    } catch (error) {
      // Error saving data
    }
  };


  TTSConnectedDevices = async () => {
    try {
      await AsyncStorage.setItem("TTSConnectedDevices", "" + this.state.TTSConnectedDevices);
    } catch (error) {
      // Error saving data
    }
  };


  TTSReport = async () => {
    try {
      await AsyncStorage.setItem("TTSReport", "" + this.state.TTSReport);
    } catch (error) {
      // Error saving data
    }
  };



  storeData = async () => {
    try {
      await AsyncStorage.setItem("currentTime", "" + this.state.curTime);
    } catch (error) {
      // Error saving data
    }
  };

  storeStatus = async () => {
    try {
      await AsyncStorage.setItem("status", "" + this.state.isOn);
    } catch (error) {
      // Error saving data
    }
  };

  onTimer() {
    this.setState(
      (prevState) => {
        // change here ? it works! but the stopping
        return { curTime: prevState.curTime + 1 };
      },
      function () {
        console.log(this.state.curTime);
      }
    );
  }

  myInterval;
  async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  handleAppStateChange = nextAppState => {
    console.log('enter handle');
    if (nextAppState === 'active') {

      this.checkStatusAsync();
    }
  };
  async checkStatusAsync() {
    console.log('check!');
    try {

      console.log("enter if register");
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60, // 1 minute
      });
      BackgroundFetch.setMinimumIntervalAsync(60);

    }
    catch (error) {
      console.log("saadly" + error);
    }
    BackgroundFetch.setMinimumIntervalAsync(60);
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    console.log({ status, isRegistered });
    this.setState({ status, isRegistered });
    try {
      if (!this.state.isRegistered || this.state.isRegistered) {
        console.log("enter if register");
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60, // 1 minute
        });
        BackgroundFetch.setMinimumIntervalAsync(60);
      }
    }
    catch (error) {
      console.log("saadly" + error);
    }

  }
  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    AppState.addEventListener('change', this.handleAppStateChange);
    const firebaseConfig = {

      apiKey: "AIzaSyCsKoPxvbEp7rAol5m-v3nvgF9t8gUDdNc",
      authDomain: "maghnatest.firebaseapp.com",
      databaseURL: "https://maghnatest.firebaseio.com",
      projectId: "maghnatest",
      storageBucket: "maghnatest.appspot.com",
      messagingSenderId: "769071221745",
      appId: "1:769071221745:web:1f0708d203330948655250",
    };
    var that = this;


    var userId = firebase.auth().currentUser.uid;

    var firebaseRef = firebase.database().ref('mgnUsers/' + userId);
    firebaseRef.once('value')
      .then(function (snap) {
        that.props.setCounter(snap.val().count);
      });





    while (true) {
      await this.startRecording();
      await this.wait(3000);
      await this.stopRecording();
      await this.gettranscription();
      await this.resetRecording();
    }
  }
  _handleAppStateChange = (nextAppState) => {
    console.log('+' + nextAppState);
    console.log('enter second handle');
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active" || nextAppState === "inactive" || this.state.appState.match('active')) {
      console.log('App has come to the foreground!')
      this._interval = setInterval(() => {
        console.log('in process');

        var hourInt;
        var hour24;
        var user = firebase.auth().currentUser;
        var actionArr = [];
        var date = new Date();
        var hour = date.getHours();
        var mins = date.getMinutes();

        console.log(hour + ":" + mins)
        var timez = date.toLocaleTimeString();
        console.log("the Time:" + timez);
        console.log('am/pm');
        console.log('after ' + timez.substring(0, 2))
        var timeH = timez.substring(0, 2);
        hourInt = parseInt(timeH);
        console.log('hourGlobal :' + hourInt);
        if (timez.substring(8) == 'PM' || hour == 0) {


          hour24 = 12 + hourInt;
          console.log("hour in " + hour24);

        }
        else {
          hour24 = hour;
        }


        var timeM = timez.substring(2, 4);
        var minInt = parseInt(mins);
        ;



        //var user = context.auth;
        var routineArr = [];

        var routineTrig = [];

        var j, i;
        var routineName;
        var routineTime;
        var RminInt, RhourInt;

        firebase.database().ref('/routine').once("value").then((snapshot) => {
          console.log("enter to database");


          snapshot.forEach(item => {
            var temp = item.val();
            actionArr = temp.actionsID;
            console.log(actionArr);
            routineName = temp.name;
            console.log(routineName)
            routineTime = temp.time;
            hour = routineTime.substring(0, 2);
            minute = routineTime.substring(3);
            RminInt = parseInt(minute);
            RhourInt = parseInt(hour);
            console.log('data' + RhourInt + ":" + RminInt);
            console.log("the time in r " + hour24 + "min" + mins)
            if (hour24 == RhourInt && RminInt == mins && temp.status == 1 && temp.userID == user.uid) {
              if (temp.actionsID.indexOf("001") != -1) {
                console.log("It is true id is 001")
                axios.put('https://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                  { on: true })
                  .then(res => res.json())
                console.log("I turn on");
                this.props.toggleLight(true);
                this.setState({ isOn: true });
                Helper.setLightStatus(true);
              }
              else if (temp.actionsID.indexOf("002") != -1) {
                axios.put('https://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state',
                  { on: false })
                  .then(res => res.json())
                  this.props.toggleLight(false);
                this.setState({ isOn: false });
                Helper.setLightStatus(false);
              }
            }

            return false;
          }); //end forEach ..
        });

        return true;
      }, 60000);


      console.log(this.setState({ appState: nextAppState }));
    }
  }


  analysis = async (actionid) => {
    //check if it is't the first command
    console.log("before definition of flage");
    let flag = false;
    console.log("hiii");
    await firebase
      .database()
      .ref("userActions/")
      .once("value", async (snap) => {
        console.log("iafter definition ");
        await snap.forEach((child) => {
          if (
            child.val().userID === firebase.auth().currentUser.uid &&
            child.val().ActionID == actionid &&
            child.val().day === moment().format("dddd")
          )
            if (
              child.val().time === new Date().getHours() ||
              (new Date().getHours() === (child.val().time + 1) % 24 &&
                new Date().getMinutes <= 10) ||
              (new Date().getHours() === (child.val().time - 1 + 24) % 24 &&
                new Date().getMinutes() >= 49)
            ) {
              let plus = parseInt(child.val().Repetition) + 1;
              console.log("before first use");
              flag = true;
              console.log("before first use 2");
              firebase
                .database()
                .ref("userActions/" + child.key)
                .update({
                  Repetition: plus,
                })
                .then(() => {
                  console.log("inserted the update");
                })
                .catch((error) => {
                  console.log(error);
                });
            }
        });
      })
      .finally(() => {
        if (flag === false) this.insertUserAction();
      });
  };

  insertUserAction = async () => {
    console.log("inside inserUserAction");
    let userActionKey = firebase.database().ref().child("userActions").push()
      .key;
    firebase
      .database()
      .ref("userActions/" + userActionKey)
      .set({
        userID: firebase.auth().currentUser.uid,
        ActionID: "001",
        time: new Date().getHours(),
        day: moment().format("dddd"),
        Repetition: "1",
        inRoutine: "0",
        insertedDate:
          new Date().getFullYear() +
          "/" +
          new Date().getMonth() +
          "/" +
          new Date().getDate(),
      })
      .then(() => {
        console.log("inserted");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  insertRoutine = async () => {
    console.log("inside inserRoutine");
    let routineKey = await firebase.database().ref().child("routine").push()
      .key;
    await firebase
      .database()
      .ref("userActions/")
      .once("value", async (snap) => {
        snap.forEach((child) => {
          let date1 = new Date(
            new Date().getFullYear() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getDate()
          );
          console.log("print date1" + date1);
          let date2 = new Date(child.val().insertedDate);
          let timeDiff = date1.getTime() - date2.getTime();
          console.log("data1 get time " + date1.getTime());
          console.log("data2 get time " + date2.getTime());
          console.log("print timeDiff" + timeDiff);
          let dayDiff = timeDiff / (1000 * 3600 * 24);
          console.log("before if 19");
          console.log("dayDiff" + dayDiff);
          if (child.val().Repetition === 18)
            if (dayDiff <= 30)
              if (child.val().inRoutine === "0") {
                firebase
                  .database()
                  .ref("userActions/" + child.key)
                  .update({
                    inRoutine: "1",
                  });
                console.log("inside if 18 ");
                firebase
                  .database()
                  .ref("routine/" + routineKey)
                  .set({
                    name: "analysis",
                    actionID: child.val().ActionID,
                    userID: child.val().userID,
                    day: child.val().day,
                    time: child.val().time,
                    timeinserted: child.val().insertedDate,
                  });
              }
        });
      });
  };

  checkData = async () => {
    console.log("inside checkData  ");

    firebase
      .database()
      .ref("routine/")
      .once("value", (snap) => {
        snap.forEach((child) => {
          let date1 = new Date(
            new Date().getFullYear() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getDate()
          );
          let date2 = new Date(child.val().timeinserted);
          let timeDiff = date1.getTime() - date2.getTime();
          let dayDiff;
          console.log("check date data1" + date1);
          console.log("check date data2" + date2);
          console.log("check date timeDiff" + timeDiff);
          dayDiff = timeDiff / (1000 * 3600 * 24);
          if (dayDiff > 90) {
            firebase
              .database()
              .ref("routine/" + child.key)
              .remove();
          }
        });
      });
  };
  // I need this

  deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      // console.log('There was an error deleting recorded file', error)
    }
  };

  gettranscription = async () => {

    this.setState({ isFetching: true });
    try {
      const { uri } = await FileSystem.getInfoAsync(this.recording.getURI());

      const formData = new FormData();
      formData.append("file", {
        uri,
        type: Platform.OS === "ios" ? "audio/x-wav" : "audio/m4a",
        name: Platform.OS === "ios" ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
      });

      const { data } = await axios.post(
        "http://35.184.93.99:3004/speech",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      this.setState({ transcript: data.transcript });
    } catch (error) {
      // console.log('There was an error reading file', error)
      this.stopRecording();
      this.resetRecording();
    }

    const { transcript } = this.state;
    this.setState({ isFetching: false });

    if (this.state.timer == 2592000) {
      clearInterval(myInterval);
      this.setState(() => {
        return {
          countDown: false,
        };
      });
    }
    console.log(transcript);


    if (transcript == "تشغيل النور") {
      // did this part linked because this is the trigger to the change of state
      this.props.toggleLight(true);
      this.setState({ isOn: true });
      Helper.setLightStatus(true);

      //here the start
      rnTimer.setInterval(
        "duration",
        () => this.props.increaseCount(this.props.currentCount),
        1000
      );

      firebase
        .database()
        .ref("mgnUsers/" + firebase.auth().currentUser.uid)
        .once("value", (snap) => {
          if (snap.val().isActive === true) {
            this.analysis("001");
          }
        });

      this.analysis("001");
      axios
        .put(
          "http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state",
          { on: true }
        )
        // .then((res) => res.json())
        .then((res) => {
          RTCCertificate;
          // console.log(res)
        })
        .catch((error) => {
          console.log();
        });
    }

    if (transcript == "ايقاف النور") {
      // this.props.toggleLight(false);
      Helper.setLightStatus(false);

      // Here the stopping
      this.storeData();

      console.log("Hi");

      this.props.stopCounter(this.props.currentCount);
      rnTimer.clearInterval("duration");
      firebase
        .database()
        .ref("mgnUsers/" + firebase.auth().currentUser.uid)
        .once("value", (snap) => {
          if (snap.val().isActive === true) {
            this.analysis("002");
          }
        });
      axios
        .put(
          "http://192.168.1.23/api/T30IPOP1nrNExNxYSkOdqIok7HjkjaegZxSVvHxR/lights/2/state",
          { on: false }
        )
        // .then((res) => res.json())
        .then((res) => {
          // console.log(res)
        })
        .catch((error) => {
          // console.log(error);
        });
    }
    if (transcript == "قراءت التعليمات") {
      this.setState({ TTSInstruction: true });
      this.TTSInstruction();
      NavigationService.navigate("instructions");
    }

    if (transcript == "التعليمات") {
      this.setState({ TTSInstruction: false });
      this.TTSInstruction();
      NavigationService.navigate("instructions");
    }

    if (transcript == "قراءت التقارير") {
      this.setState({ TTSReport: true });
      this.TTSReport();
      NavigationService.navigate("report");
    }


    if (transcript == "قراءت الاجهزه المتصله") {
      this.setState({ TTSConnectedDevices: true });
      this.TTSConnectedDevices();
      NavigationService.navigate("supdevices");
    }


    if (transcript == "الصفحه الشخصيه") {
      NavigationService.navigate("profile");
    }


    if (transcript == "الانماط") {
      NavigationService.navigate("Routine");
    }


    if (transcript == "رجوع") {
      NavigationService.navigate("Home");
    }
    if (transcript == "التقارير") {
      this.setState({ TTSReport: false });
      this.TTSReport();
      NavigationService.navigate("report");
    }
    if (transcript == "الاجهزه المتصله") {
      this.setState({ TTSConnectedDevices: true });
      this.TTSConnectedDevices();
      NavigationService.navigate("supdevices");
    }
    //starting from here all the methods and variables related to homescreen
    if (transcript == "تفعيل الصباحي") {
      this.props.update(true, 2);

    }
    if (transcript == "تفعيل المسائي") {
      this.props.update(true, 4);

    }

    if (transcript == "تفعيل الخروج ") {
      this.props.update(true, 3);

    }
    if (transcript == "تفعيل العوده ") {
      this.props.update(true, 1);


    }

    if (transcript == "الغاء الصباحي") {

      this.props.update(false, 2);
    }
    if (transcript == "الغاء المسائي") {
      this.props.update(false, 4);
    }

    if (transcript == "الغاء الخروج") {

      this.props.update(false, 3);
    }
    if (transcript == "الغاء العوده") {
      this.props.update(false, 1);
    }

    if (transcript == "الوضع الصباحي") {
      routineArr.push('morning routine');
      console.log(" mmmmmoooorrrning");
    }

    if (transcript == "الوضع المسائي") {
      routineArr.push('night routine');
    }
    if (transcript == "وضع الخروج") {
      routineArr.push('leave routine');
    }

    if (transcript == "وضع العوده") {
      routineArr.push('back routine');
    }

    if (routineArr[0] == 'morning routine' || routineArr[0] == 'night routine'
      || routineArr[0] == 'leave routine' || routineArr[0] == 'back routine') {
      if (transcript == "تشغيل النور") {
        routineArr.push('turnOnLight');
        console.log("llllliiighhhttt");
      }

      if (transcript == "إغلاق النور") {
        routineArr.push('turnOffLight');
      }
    }

    if (routineArr.length == 2) {
      if (transcipt == "الساعة الواحدة صباحاً") {
        // hours = 01
        routineArr.push(0)
      }
      if (transcipt == "الساعة الثانية صباحاً") {
        // hours = 02
        routineArr.push(1)
      }
      if (transcipt == "الساعة الثالثة صباحاً") {
        //hours = 03
        routineArr.push(2)
      }
      if (transcipt == "الساعة الرابعة صباحاً") {
        // hours = 04
        routineArr.push(3)
      }
      if (transcipt == "الساعة الخامسة صباحاً") {
        // hours = 05
        routineArr.push(4)
      }
      if (transcipt == "الساعة السادسة صباحاً") {
        // hours = 06
        routineArr.push(5)
      }
      if (transcipt == "الساعة السابعة صباحاً") {
        // hours = 07
        routineArr.push(6)
      }
      if (transcipt == "الساعة الثامنة صباحاً") {
        // hours = 08
        routineArr.push(7)
      }
      if (transcipt == "الساعة التاسعة صباحاً") {
        // hours = 09
        routineArr.push(8)
      }
      if (transcipt == "الساعة العاشرة صباحاً") {
        //  hours = 10
        routineArr.push(9)
      }
      if (transcipt == "الساعة الحادية عشر صباحاً") {
        // hours = 11
        routineArr.push(10)
      }
      if (transcipt == "الساعة الثانية عشر صباحاً") {
        // hours = 12
        routineArr.push(11)
      }
    }

    if (routineArr.length == 3) {
      if (transcipt == "دقيقة") {
        // mins= 01
        routineArr.push(1)
      }
      if (transcipt == "دقيقتان") {
        // mins= 02
        routineArr.push(2)
      }
      if (transcipt == "ثلاث دقائق") {
        // mins= 03
        routineArr.push(3)
      }
      if (transcipt == "أربع دقائق") {
        //  mins= 04
        routineArr.push(4)
      }
      if (transcipt == "خمس دقائق") {
        // mins= 05
        routineArr.push(5)
      }
      if (transcipt == "ست دقائق") {
        // mins= 06
        routineArr.push(6)
      }
      if (transcipt == "سبع دقائق") {
        // mins= 07
        routineArr.push(7)
      }
      if (transcipt == "ثمان دقائق") {
        // mins= 08
        routineArr.push(8)
      }
      if (transcipt == "تسع دقائق") {
        // mins= 09
        routineArr.push(9)
      }

      if (transcipt == "عشر دقائق") {
        // mins= 10
        routineArr.push(10)
      }
      if (transcipt == "احدى عشر دقيقة") {
        // mins= 11
        routineArr.push(11)
      }
      if (transcipt == "اثنا عشر دقيقة") {
        // mins= 12
        routineArr.push(12)
      }
      if (transcipt == "ثلاث عشر دقيقة") {
        // mins= 13
        routineArr.push(13)
      }
      if (transcipt == "اربعة عشر دقيقة") {
        // mins= 14
        routineArr.push(14)
      }
      if (transcipt == "خمسة عشر دقيقة") {
        // mins= 15
        routineArr.push(15)
      }
      if (transcipt == " ستة عشر دقيقة") {
        //  mins= 16
        routineArr.push(16)
      }
      if (transcipt == "سبعة عشر دقيقة") {
        //  mins= 17
        routineArr.push(17)
      }
      if (transcipt == "ثمانية عشر دقيقة") {
        // mins= 18
        routineArr.push(18)
      }
      if (transcipt == "تسعة عشر دقيقة") {
        //  mins= 19
        routineArr.push(19)
      }
      if (transcipt == " عشرون دقيقة") {
        //mins= 20
        routineArr.push(20)
      }
      if (transcipt == " واحد وعشرون دقيقة") {
        // mins= 21
        routineArr.push(21)
      }
      if (transcipt == " اثنان وعشرون دقيقة") {
        // mins= 22
        routineArr.push(22)
      }
      if (transcipt == " ثلاث وعشرون دقيقة") {
        //mins= 23
        routineArr.push(23)
      }
      if (transcipt == " اربعة وعشرون دقيقة") {
        // mins= 24
        routineArr.push(24)
      }
      if (transcipt == " خمسة وعشرون دقيقة") {
        // mins= 25
        routineArr.push(25)
      }
      if (transcipt == " ستة وعشرون دقيقة") {
        // mins= 26
        routineArr.push(26)
      }
      if (transcipt == " سبعة وعشرون دقيقة") {
        // mins= 27
        routineArr.push(27)
      }
      if (transcipt == "ثمانية وعشرون دقيقة") {
        // mins= 28
        routineArr.push(28)
      }
      if (transcipt == "تسعة وعشرون دقيقة") {
        //  mins= 29
        routineArr.push(29)
      }
      if (transcipt == "ثلاثون دقيقة") {
        //  mins= 30
        routineArr.push(30)
      }
      if (transcipt == "واحد وثلاثون دقيقة") {
        //  mins= 31
        routineArr.push(31)
      }
      if (transcipt == "اثنان وثلاثون دقيقة") {
        //  mins= 32
        routineArr.push(32)
      }
      if (transcipt == "ثلاث وثلاثون دقيقة") {
        //  mins= 33
        routineArr.push(33)
      }
      if (transcipt == "اربعة وثلاثون دقيقة") {
        // mins= 34
        routineArr.push(34)
      }
      if (transcipt == "خمسة وثلاثون دقيقة") {
        //  mins= 35
        routineArr.push(35)
      }
      if (transcipt == "ستة وثلاثون دقيقة") {
        //  mins= 36
        routineArr.push(36)
      }
      if (transcipt == "سبعة وثلاثون دقيقة") {
        //  mins= 37
        routineArr.push(37)
      }
      if (transcipt == "ثمانية وثلاثون دقيقة") {
        //  mins= 38
        routineArr.push(38)
      }
      if (transcipt == "تسعة وثلاثون دقيقة") {
        //  mins= 39
        routineArr.push(39)
      }
      if (transcipt == "اربعون دقيقة") {
        //  mins= 40
        routineArr.push(40)
      }
      if (transcipt == "واحد واربعون دقيقة") {
        //  mins= 41
        routineArr.push(41)
      }
      if (transcipt == "اثنان واربعون دقيقة") {
        //  mins= 42
        routineArr.push(42)
      }
      if (transcipt == "ثلاث واربعون دقيقة") {
        //  mins= 43
        routineArr.push(43)
      }
      if (transcipt == "اربعة واربعون دقيقة") {
        //  mins= 44
        routineArr.push(44)
      }
      if (transcipt == "خمسة واربعون دقيقة") {
        //  mins= 45
        routineArr.push(45)
      }
      if (transcipt == "ستة واربعون دقيقة") {
        // mins= 46
        routineArr.push(46)
      }
      if (transcipt == "سبعة واربعون دقيقة") {
        //  mins= 47
        routineArr.push(47)
      }
      if (transcipt == "ثمانية واربعون دقيقة") {
        //  mins= 48
        routineArr.push(48)
      }
      if (transcipt == "تسعة واربعون دقيقة") {
        //  mins= 49
        routineArr.push(49)
      }
      if (transcipt == "خمسون دقيقة") {
        //  mins= 50
        routineArr.push(50)
      }
      if (transcipt == "واحد وخمسون دقيقة") {
        //  mins= 51
        routineArr.push(51)
      }
      if (transcipt == "اثنان وخمسون دقيقة") {
        //  mins= 52
        routineArr.push(52)
      }
      if (transcipt == "ثلاث وخمسون دقيقة") {
        //  mins= 53
        routineArr.push(53)
      }
      if (transcipt == "اربعة وخمسون دقيقة") {
        //  mins= 54
        routineArr.push(54)
      }
      if (transcipt == "خمسة وخمسون دقيقة") {
        //  mins= 55
        routineArr.push(55)
      }
      if (transcipt == "ستة وخمسون دقيقة") {
        //  mins= 56
        routineArr.push(56)
      }
      if (transcipt == "سبعة وخمسون دقيقة") {
        //  mins= 57
        routineArr.push(57)
      }
      if (transcipt == "ثمانية وخمسون دقيقة") {
        //  mins= 58
        routineArr.push(58)
      }
      if (transcipt == "تسعة وخمسون دقيقة") {
        //  mins= 59
        routineArr.push(59)
      }
    }
    if (transcript == "حفظ") {
      routineArr.push('save');
      console.log("sssaaaaavvveee");
      this.routineSpeechValidate();

    }
  };



  async routineSpeechValidate() {

    if (routineArr[0] === 'morning routine') {
      if (routineArr.length == 5) {
        if (routineArr[1] === 'turnOffLight' || routineArr[1] === 'turnOnLight') {
          if (routineArr[4] === 'save') {
            this.save_button_action(0);

          }

        }
        else {
          // here alerat with aduio 
          alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");

        }
      }
      else {
        // here alerat with aduio 
        alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");
      }
    }

    if (routineArr[0] === 'night routine') {
      if (routineArr.length == 5) {
        if (routineArr[1] === 'turnOffLight' || routineArr[1] === 'turnOnLight') {
          if (routineArr[4] === 'save') {
            this.save_button_action(3);
          }

        }
        else {
          // here alerat with aduio 
          alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");
        }
      }
      else {
        // here alerat with aduio 
        alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");
      }
    }

    else

      if (routineArr[0] === 'leave routine') {
        if (routineArr.length == 3) {

          if (routineArr[1] === 'turnOffLight' || routineArr[1] === 'turnOnLight') {
            if (routineArr[2] === '0') {
              this.save_button_action(1);
            }

          }
          else {
            // here alerat with aduio 
            alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");
          }
        }
        else {
          // here alerat with aduio 
          alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");
        }
      }

    if (routineArr[0] === 'back routine') {
      if (routineArr.length == 3) {
        if (routineArr[1] === 'turnOffLight' || routineArr[1] === 'turnOnLight') {
          if (routineArr[2] === '0') {
            this.save_button_action(2);
          }

        }
        else {
          // here alerat with aduio 
          alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");

        }
      }
      else {
        // here alerat with aduio 
        alert(" عذرا، اتبع نفس الطريقة التي بالتعليمات");

      }
    }





  }

  save_button_action(index) {
    var lat, lng, i;

    var user = firebase.auth().currentUser;
    console.log(user.uid)
    var routineName, routineTime, disRoutine
    var tmp_str = "";
    var actions = [];
    var i, j;
    var flag = false
    var flagH = false;
    firebase.database().ref('mgnUsers/' + firebase.auth().currentUser.uid).once('value', (snap) => {

      lat = snap.val().latitude;
      lng = snap.val().longitude;
    })



    //var routineTable =  firebase.database().ref('routine/'); 
    // this.setActionTable();

    if (index == 0) {
      flagH = false;
      routineName = "morning routine";

      disRoutine = "الوضع الصباحي";

      if (routineArr[1] === 'turnOnLight') {
        actions.push("001");
      }
      else {
        actions.push("002");
      }
      routineTime = routineArr[2] + ":" + routineArr[3];



    }// end if for morning routine
    else if (index == 1) {


      if (lat === 0 && lng === 0) {

        //here alerat with aduio 
        alert("عذراً، عليك تفعيل خاصية الموقع حتى يتم انشاء وضع الخروج");

      }// end if check location
      else {

        routineName = "leave routine";

        disRoutine = "وضع الخروج";
        flag = true
        routineTime = "empty"
        // check location


        if (routineArr[1] === 'turnOnLight') {
          actions.push("001");
        }
        else {
          actions.push("002");
        }
      }//end loop

    }// end if for leave routine
    else if (index == 2) {
      if (lat === 0 && lng === 0) {


        //here alerat with aduio
        alert("عذراً، عليك تفعيل خاصية الموقع حتى يتم انشاء وضع العودة");
      }
      else {


        routineName = "come routine";

        disRoutine = "وضع العودة";
        routineTime = "empty"
        flag = true
        // set If cindition for check location

        if (routineArr[1] === 'turnOnLight') {
          actions.push("001");
        }
        else {
          actions.push("002");
        }
      }//end loop

    }//end if for come routine
    else if (index == 3) {

      flagH = false;
      routineName = "night routine";

      disRoutine = "الوضع المسائي";

      if (routineArr[1] === 'turnOnLight') {
        actions.push("001");
      }
      else {
        actions.push("002");
      }

      routineTime = routineArr[2] + ":" + routineArr[3];



    }//end if for night routine


    if ((routineName == "morning routine" || routineName == "night routine")) {

      console.log("in if save")
      var userRoutineArr = [];
      var trueSave = false;
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          var temp = item.val();
          if (temp.userID == user.uid) {
            console.log("yes have user");
            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if 
        });//end forEach



        if (userRoutineArr.indexOf(routineName) != -1) {
          console.log("enter if check")
          firebase.database().ref('/routine').once("value", (snapshot) => {
            snapshot.forEach(item => {

              var temp = item.val();
              console.log(temp);
              if (temp.userID == user.uid && temp.name == routineName) {
                var theId = item.key;


                firebase.database().ref('routine/' + theId).update({
                  name: routineName,
                  time: routineTime,
                  actionsID: actions,
                  day: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
                  userID: user.uid,
                  status: 1,

                });



              }//end if 
            });//end forEach

          });//end snapshot..
        }
        else {
          firebase.database().ref('routine/').push(
            {
              name: routineName,
              time: routineTime,
              actionsID: actions,
              day: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
              userID: user.uid,
              status: 1,

            })//end set routine.


        }

      });//end snapshot..



      //here alerat with aduio
      alert("تم حفظ  " + disRoutine);





    }//end set morning or night routine.


    //Leave come Firebase
    else if (routineName == "leave routine" || routineName == "come routine"
      && user.longitude != 0 && user.latitude != 0) {
      var userRoutineArr = [];
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          var temp = item.val();
          if (temp.userID == user.uid) {
            console.log("yes have user");
            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if 
        });//end forEach



        if (userRoutineArr.indexOf(routineName) != -1) {
          console.log("enter if check")
          firebase.database().ref('/routine').once("value", (snapshot) => {
            snapshot.forEach(item => {

              var temp = item.val();
              console.log(temp);
              if (temp.userID == user.uid && temp.name == routineName) {
                var theId = item.key;

                //Morning and night firebase
                firebase.database().ref('routine/' + theId).update({
                  name: routineName,
                  time: routineTime,
                  actionsID: actions,
                  day: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
                  userID: user.uid,
                  status: 1,

                });



              }//end if 
            });//end forEach



          });//end snapshot..

        }
        else {
          firebase.database().ref('routine/').push(
            {
              name: routineName,
              time: routineTime,
              actionsID: actions,
              day: ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"],
              userID: user.uid,
              status: 1,

            })//end set routine. 

        }
      });//end snapshot..

      // here alerat with aduio

      alert("تم حفظ  " + disRoutine);


      console.log("save routine");



    }
  }

  startRecording = async () => {
    // console.log(recording)
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== "granted") return;

    this.setState({ isRecording: true });
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });
    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      // console.log(error)
      this.stopRecording();
    }

    this.recording = recording;
  };

  stopRecording = async () => {
    this.setState({ isRecording: false });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // noop
    }
  };

  resetRecording = () => {
    this.deleteRecordingFile();
    this.recording = null;
  };

  click_btn = async () => {

    const toggleIndex = 'toggle3';
    const toggleIndexValue = this.props.toggle3;
    this.props.dispatch({ type: 'TOGGLE', index: 'toggle3', value: !toggleIndexValue });



  }

  render() {
    const { isRecording, transcript, isFetching } = this.state;

    return (
      <View style={styles.container}>





        <View
          onPressIn={this.startRecording}
        // onPressOut={this.handleOnPressOut}
        >

          {isFetching && <Image source={require('./crop2.gif')} style={styles.Indicator} />}
          {!isFetching && <Image source={require('./crop.gif')} style={styles.Indicator1} />}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    toggle: state.toggle1Reducer,
    currentCount: state.countReducer.count,
    lightStatus: state.lightReducer.lightStatus,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (status, btn) => dispatch(updateToggle(status, btn)),
    increaseCount: (count) => dispatch(incCounter(count)),
    stopCounter: (count) => dispatch(stopCounter(count)),
    setCounter: (count) => dispatch(setCounter(count)),
    toggleLight: (status) => dispatch(toggleLight(status))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SpeechToTextButton);

