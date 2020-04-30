import React, { Component } from 'react';

import {
  StyleSheet,
  ActivityIndicator, Text, View, Image,
  Alert, TouchableOpacity, Button , Modal
} from 'react-native';
import {
  FontAwesome5, AntDesign, Feather
  , MaterialCommunityIcons, SimpleLineIcons
} from "@expo/vector-icons";

import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import axios from 'axios'
import { Audio } from 'expo-av';
import * as firebase from 'firebase';
import moment from 'moment';
import NavigationService from "../navigation/NavigationService";
import { connect } from 'react-redux';
import { updateToggle } from '../actions/toggle';

class HomeScreen extends Component {

  constructor(props) {

    super(props);
    this.state = {
      toggle: false,
      
    };
    super(props)
    this.recording = null
    this.state = {
      isFetching: false,
      isRecording: false,
      transcript: '',
      userRoutineArr: [],
      info:"",
      saveModal:false,
    }

  }




  showSaveModal = () => {
    console.log('showModal')
  this.setState({
  
      
    saveModal: true
  });
  setTimeout(() => {
    this.setState({
     
      saveModal:false
    })
    }, 4000);
}

  async checkRoutine() {


    let user = firebase.auth().currentUser;
    firebase.database().ref('/routine').once("value", snapshot => {
      snapshot.forEach(item => {
        let temp = item.val();
        if (temp.userID == user.uid) {
          console.log(temp.name + ": " + temp.status);
          switch (temp.name) {
            case 'come routine':
              if (temp.status == 1)
                this.props.update(true, 1)
              break;

            case 'morning routine':
              if (temp.status == 1) this.props.update(true, 2)
              break;

            case 'leave routine':
              if (temp.status == 1) this.props.update(true, 3)
              break;

            case 'night routine':
              if (temp.status == 1) this.props.update(true, 4)
              break;
          }

        }
      });
    });

  }


  async  wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }




  async componentDidMount() {
    this.checkRoutine();
    this.props.navigation.setParams({
      headerLeft: (<TouchableOpacity onPress={this.handelSignOut}>
        <SimpleLineIcons name="logout" size={24} color='white' style={{ marginLeft: 15 }} />
      </TouchableOpacity>)

    })


    const firebaseConfig = {


      /* apiKey: "AIzaSyAAM7t0ls6TRpHDDmHZ4-JWaCLaGWZOokI",
       authDomain: "maghnaapplication.firebaseapp.com",
       databaseURL: "https://maghnaapplication.firebaseio.com",
       projectId: "maghnaapplication",
       storageBucket: "maghnaapplication.appspot.com",
       messagingSenderId: "244460583192",
       appId: "1:244460583192:web:f650fa57532a682962c66d",
     };*/
      apiKey: "AIzaSyCsKoPxvbEp7rAol5m-v3nvgF9t8gUDdNc",
      authDomain: "maghnatest.firebaseapp.com",
      databaseURL: "https://maghnatest.firebaseio.com",
      projectId: "maghnatest",
      storageBucket: "maghnatest.appspot.com",
      messagingSenderId: "769071221745",
      appId: "1:769071221745:web:1f0708d203330948655250",
    };


    /*   while(true){
     await this.startRecording()
     await this.wait(3000);
     await this.stopRecording();
     await  this.getTranscription();
     await this.resetRecording();
     firebase.database().ref('mgnUsers/'+firebase.auth().currentUser.uid).once('value',(snap)=>{
 if(snap.val().isActive)
 {
    this.insertRoutine();
    this.checkData();
   console.log("in if is active "+snap.val().isActive);
 }
     })

       }*/
    //this._onPress1()
    // this._onPress2()
    //this._onPress3()
    // this._onPress4()
  }


  deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI())
      await FileSystem.deleteAsync(info.uri)
    } catch (error) {
      console.log('There was an error deleting recorded file', error)
    }
  }

  getTranscription = async () => {
    this.setState({ isFetching: true })
    try {
      const { uri } = await FileSystem.getInfoAsync(this.recording.getURI())

      const formData = new FormData()
      formData.append('file', {
        uri,
        type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
        name: Platform.OS === 'ios' ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
      })

      const { data } = await axios.post('http://localhost:3004/speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      this.setState({ transcript: data.transcript })
    } catch (error) {
      console.log('There was an error reading file', error)
      this.stopRecording()
      this.resetRecording()
    }

    const {
      transcript
    } = this.state
    this.setState({ isFetching: false })
    if (transcript == "تشغيل النور") {

      firebase.database().ref('mgnUsers/' + firebase.auth().currentUser.uid).once('value', (snap) => {
        if (snap.val().isActive === true) {
          this.analysis('001');
        }

      })

      this.analysis('001');
      axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
        { 'on': true })
        .then(res => res.json())
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error);
        })
    }

    if (transcript == "اطفاء النور") {

      firebase.database().ref('mgnUsers/' + firebase.auth().currentUser.uid).once('value', (snap) => {
        if (snap.val().isActive === true) {
          this.analysis('002');
        }

      })



      axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
        { 'on': false })
        .then(res => res.json())
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error);
        })
    }

    if (transcript == "التعليمات") {
      this.props.navigation.navigate('instructions');
    }

  }


  startRecording = async () => {
    console.log(recording)
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
    if (status !== 'granted') return

    this.setState({ isRecording: true })
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })
    const recording = new Audio.Recording()

    try {
      await recording.prepareToRecordAsync(recordingOptions)
      await recording.startAsync()
    } catch (error) {
      console.log(error)
      this.stopRecording()
    }

    this.recording = recording
  }

  stopRecording = async () => {
    this.setState({ isRecording: false })
    try {
      await this.recording.stopAndUnloadAsync()
    } catch (error) {
      // noop
    }
  }

  resetRecording = () => {
    this.deleteRecordingFile();
    this.recording = null
  };


  analysis = async (actionid) => {


    //check if it is't the first command
    console.log('before definition of flage')
    let flag = false;
    console.log('hiii')
    await firebase.database().ref('userActions/').once('value', async (snap) => {
      console.log("iafter definition ")
      await snap.forEach((child) => {
        if (child.val().userID === firebase.auth().currentUser.uid && child.val().ActionID == actionid && child.val().day === moment().format('dddd'))

          if (child.val().time === new Date().getHours() || (new Date().getHours() === ((child.val().time + 1) % 24) && (new Date().getMinutes <= 10)) || (new Date().getHours() === ((child.val().time - 1 + 24) % 24) && new Date().getMinutes() >= 49)) {
            let plus = parseInt(child.val().Repetition) + 1;
            console.log("before first use")
            flag = true;
            console.log("before first use 2")
            firebase.database().ref('userActions/' + child.key).update(
              {



                Repetition: plus,
              }

            ).then(() => {
              console.log('inserted the update')
            }).catch((error) => {
              console.log(error)
            });
          }
      })
    }
    ).finally(() => {
      if (flag === false)
        this.insertUserAction();
    });

  }

  insertUserAction = async () => {
    console.log("inside inserUserAction")
    let userActionKey = firebase.database().ref().child('userActions').push().key;
    firebase.database().ref('userActions/' + userActionKey).set(
      {

        userID: firebase.auth().currentUser.uid,
        ActionID: '001',
        time: new Date().getHours(),
        day: moment().format('dddd'),
        Repetition: '1',
        inRoutine: '0',
        insertedDate: new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate(),
      }).then(() => {
        console.log('inserted')
      }).catch((error) => {
        console.log(error)
      });
  }


  insertRoutine = async () => {
    console.log("inside inserRoutine");
    let routineKey = await firebase.database().ref().child('routine').push().key;
    await firebase.database().ref('userActions/').once('value', async (snap) => {
      snap.forEach((child) => {
        let date1 = new Date(new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate());
        console.log("print date1" + date1)
        let date2 = new Date(child.val().insertedDate);
        let timeDiff = date1.getTime() - date2.getTime();
        console.log("data1 get time " + date1.getTime())
        console.log("data2 get time " + date2.getTime())
        console.log("print timeDiff" + timeDiff)
        let dayDiff = timeDiff / (1000 * 3600 * 24);
        console.log("before if 19")
        console.log("dayDiff" + dayDiff)
        if (child.val().Repetition === 18)
          if (dayDiff <= 30)
            if (child.val().inRoutine === '0') {
              firebase.database().ref('userActions/' + child.key).update(
                {



                  inRoutine: '1',
                }

              )
              console.log("inside if 18 ");
              firebase.database().ref('routine/' + routineKey).set(
                {
                  name: 'analysis',
                  actionID: child.val().ActionID,
                  userID: child.val().userID,
                  day: child.val().day,
                  time: child.val().time,
                  timeinserted: child.val().insertedDate,

                }
              )

            }

      })
    })
  }


  checkData = async () => {
    console.log("inside checkData  ");

    firebase.database().ref('routine/').once('value', (snap) => {
      snap.forEach((child) => {
        let date1 = new Date(new Date().getFullYear() + '/' + new Date().getMonth() + '/' + new Date().getDate());
        let date2 = new Date(child.val().timeinserted);
        let timeDiff = date1.getTime() - date2.getTime();
        let dayDiff;
        console.log("check date data1" + date1);
        console.log("check date data2" + date2);
        console.log("check date timeDiff" + timeDiff);
        dayDiff = timeDiff / (1000 * 3600 * 24);
        if (dayDiff > 90) {
          firebase.database().ref('routine/' + child.key).remove();
        }

      })

    })

  }





  handelSignOut = () => {
    let { navigation } = this.props;
    console.log("logout method");

    console.log("inside");
    try {
      console.log(this.state);
      firebase
        .auth()
        .signOut()
        .then(function () {
          navigation.navigate('WelcomeStackNavigator')
        })

        .catch(error => console.log(error.message));
      console.log("after" + this.state.email);
    } catch (e) { console.log(e.message) }

  };



  static navigationOptions = ({ navigation }) => ({

    headerTint: '#F7FAFF',
    headerTitle: 'الصفحة الرئيسية',
    headerRight: () => (
      <TouchableOpacity onPress={() => { NavigationService.navigate("profile") }} style={{ marginRight: 15 }}>
        <FontAwesome5 name="user" size={24} color="#fff" />
      </TouchableOpacity>


    ),
    headerLeft: navigation.state.params && navigation.state.params.headerLeft,
    headerStyle: {
      backgroundColor: '#8BC4D0',
      color: 'white'

    },
    headerTitleStyle: {
      color: '#fff'
    }
  })

  newMethod() {
    return "before inserRoutine";
  }


  _onPress1() {
    const newState = !this.state.toggle1;
    let theId;
    let routineName = 'come routine';
    let user = firebase.auth().currentUser;
    let userRoutineArr = [];

    if (newState) {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 1,

            });
            this.setState({ toggle1: newState })
          }


        });//end forEach
        if (userRoutineArr.indexOf(routineName) == -1) {
          this.setState({
            info:"عذراً\n"+' لم تقم بإنشاء وضع الرجوع إلى المنزل من قبل ، عليك أولاً إنشاؤه',
          
    
        })
      
        
        this.showSaveModal();

          this.setState({ toggle1: !newState })


        }
      }); //end snapshot..

    }
    else {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 0,

            });
          }

          this.setState({ toggle1: newState })
        });//end forEach
      }); //end snapshot..
    }


    // });
    // }
  }

  _onPress2() {
    let theId;
    let routineName = 'morning routine';
    let user = firebase.auth().currentUser;
    let userRoutineArr = [];

    const newState = !this.state.toggle2;
    if (newState) {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 1,

            });
            this.setState({ toggle2: newState })
          }


        });//end forEach
        if (userRoutineArr.indexOf(routineName) == -1) {
          this.setState({
            info:"عذراً\n" + "لم تقم بإنشاء الوضع الصباحي من قبل ، عليك أولاً إنشاؤه",
          
      
        })
        this.showSaveModal();
         // Alert.alert("عذراً", " لم تقم بإنشاء الوضع الصباحي من قبل ، عليك أولاً إنشاؤه");
          this.setState({ toggle2: !newState })


        }
      }); //end snapshot..

    }
    else {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 0,

            });
          }

          this.setState({ toggle2: newState })
        });//end forEach
      }); //end snapshot..
    }


    // });

    // }
  }


  _onPress3() {
    let theId;
    let routineName = 'leave routine';
    let user = firebase.auth().currentUser;
    let userRoutineArr = [];

    const newState = !this.state.toggle3;
    if (newState) {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 1,

            });

            this.setState({ toggle3: newState })
          }


        });//end forEach
        if (userRoutineArr.indexOf(routineName) == -1) {
          this.setState({
            info:"عذراً\n" + "لم تقم بإنشاء وضع الخروج من المنزل من قبل ، عليك أولاً إنشاؤه",
          
      
        })
        this.showSaveModal();
        //  Alert.alert("عذراً", " لم تقم بإنشاء وضع الخروج من المنزل من قبل ، عليك أولاً إنشاؤه");
          this.setState({ toggle3: !newState })


        }
      }); //end snapshot..

    }
    else {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 0,

            });
            this.setState({ toggle3: newState })
          }


        });//end forEach
      }); //end snapshot..
    }

  }


  _onPress4() {
    let theId;
    let routineName = 'night routine';
    let user = firebase.auth().currentUser;
    let userRoutineArr = [];
    const newState = !this.state.toggle4;
    if (newState) {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 1,

            });
            this.setState({ toggle4: newState })
          }


        });//end forEach
        if (userRoutineArr.indexOf(routineName) == -1) {
          this.setState({
            info:"عذراً\n" + "لم تقم بإنشاء الوضع المسائي من قبل ، عليك أولاً إنشاؤه",
          
      
        })
        this.showSaveModal();
          //Alert.alert("عذراً", " لم تقم بإنشاء الوضع المسائي من قبل ، عليك أولاً إنشاؤه");
          this.setState({ toggle4: !newState })

        }
      }); //end snapshot..

    }
    else {
      firebase.database().ref('/routine').once("value", snapshot => {
        snapshot.forEach(item => {
          let temp = item.val();
          if (temp.userID == user.uid) {

            userRoutineArr.push(temp.name);
            console.log(temp.name);
          }//end if
          if (userRoutineArr.indexOf(routineName) != -1) {
            theId = item.key;
            firebase.database().ref('routine/' + theId).update({
              status: 0,

            });
          }

          this.setState({ toggle4: newState })
        });//end forEach
      }); //end snapshot..
    }

  }
  render() {

    const {
      isRecording, transcript, isFetching,
    } = this.state
    const { toggle1 } = this.state;
    const { toggle2 } = this.state;
    const { toggle3 } = this.state;
    const { toggle4 } = this.state;



    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F7FAFF' }}>


        <Modal
                               animationType="slide"
                                 transparent={true}
                                 visible={this.state.saveModal}
                                 onRequestClose={() => {
                                    console.log('Modal has been closed.');}}>
                                   
                                <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                 <Text style={styles.modelStyle}>{this.state.info}</Text>
                             </View>
                              </View>
                                    </Modal>
                                    
        <TouchableOpacity
          onPress={() => NavigationService.navigate("instructions")}
          style={{ fontSize: 20, justifyContent: 'center', width: 130, height: 90, left: 100, borderRadius: 25, marginHorizontal: 1, paddingLeft: 2, paddingRight: 10, paddingTop: -150, bottom: -220, shadowOpacity: 0.3 }}>
          <Ionicons style={{ left: 100, paddingLeft: -300, paddingTop: -300, bottom: 90, top: -20 }} name="ios-information-circle" size={40} color='#6FA0AF' />
        </TouchableOpacity>

        <Text style={{ fontSize: 25, color: '#6FA0AF', bottom: -200, paddingLeft: 180 }}>الأنماط الحياتية</Text>
        {/* <Text style={{ fontSize: 25, color: '#6FA0AF', bottom: -200, paddingLeft: 180 }}>  {JSON.stringify(this.props.toggle)}  </Text> */}






        <TouchableOpacity
          onPress={() => this.props.update(!this.props.toggle.toggle1, 1)}
          style={{ fontSize: 25, backgroundColor: this.props.toggle.toggle1 ? 'white' : '#6FA0AF', color: '#6FA0AF', justifyContent: 'center', width: 150, height: 140, left: 80, borderRadius: 25, marginHorizontal: 25, paddingLeft: 28, paddingRight: 10, paddingTop: 9, bottom: -250, shadowOpacity: 0.3 }}>
          <Ionicons style={{ left: 17, paddingLeft: -40, paddingRight: 5, paddingTop: 9, bottom: 90, top: -10 }} name="md-home" size={70} color={this.props.toggle.toggle1 ? '#6FA0AF' : 'white'} />
          <Text style={{ left: 0, paddingLeft: -40, paddingRight: 5, bottom: 90, top: -10, color: this.props.toggle.toggle1 ? '#6FA0AF' : 'white', fontWeight: 'bold', fontSize: 13 }}>الرجوع إلى المنزل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.update(!this.props.toggle.toggle2, 2)}
          style={{ fontSize: 25, backgroundColor: this.props.toggle.toggle2 ? 'white' : '#6FA0AF', color: '#6FA0AF', justifyContent: 'center', width: 150, height: 140, left: 80, borderRadius: 25, marginHorizontal: 25, paddingLeft: 28, paddingRight: 10, paddingTop: 9, bottom: -270, shadowOpacity: 0.3 }}>
          <Ionicons style={{ left: 17, paddingLeft: -40, paddingRight: 5, paddingTop: 9, bottom: 90, top: -10 }} name="md-sunny" size={70} color={this.props.toggle.toggle2 ? '#6FA0AF' : 'white'} />
          <Text style={{ left: 5, paddingLeft: -40, paddingRight: 5, bottom: 90, top: -10, color: this.props.toggle.toggle2 ? '#6FA0AF' : 'white', fontWeight: 'bold', fontSize: 13 }}>الوضع الصباحي</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.update(!this.props.toggle.toggle3, 3)}
          style={{ fontSize: 25, backgroundColor: this.props.toggle.toggle3 ? 'white' : '#6FA0AF', color: '#6FA0AF', justifyContent: 'center', width: 150, height: 140, left: -80, borderRadius: 25, marginHorizontal: 25, paddingLeft: 28, paddingRight: 10, paddingTop: 9, bottom: -130, shadowOpacity: 0.3 }}>
          <MaterialCommunityIcons style={{ left: 17, paddingLeft: -40, paddingRight: 5, paddingTop: 9, bottom: 90, top: -10 }} name="door-open" size={70} color={this.props.toggle.toggle3 ? '#6FA0AF' : 'white'} ></MaterialCommunityIcons>
          <Text style={{ left: 0, paddingLeft: -60, paddingRight: 5, bottom: 90, top: -10, color: this.props.toggle.toggle3 ? '#6FA0AF' : 'white', fontWeight: 'bold', fontSize: 13 }}>الخروج من المنزل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.update(!this.props.toggle.toggle4, 4)}
          style={{ fontSize: 25, backgroundColor: this.props.toggle.toggle4 ? 'white' : '#6FA0AF', color: '#6FA0AF', justifyContent: 'center', width: 150, height: 140, left: -80, borderRadius: 25, marginHorizontal: 25, paddingLeft: 28, paddingRight: 10, paddingTop: 9, bottom: 170, shadowOpacity: 0.3 }}>
          <MaterialCommunityIcons style={{ left: 17, paddingLeft: -40, paddingRight: 5, paddingTop: 9, bottom: 90, top: -10 }} name="weather-night" size={70} color={this.props.toggle.toggle4 ? '#6FA0AF' : 'white'} ></MaterialCommunityIcons>
          <Text style={{ left: 5, paddingLeft: -40, paddingRight: 5, bottom: 90, top: -10, color: this.props.toggle.toggle4 ? '#6FA0AF' : 'white', fontWeight: 'bold', fontSize: 13 }}>الوضع المسائي</Text>
        </TouchableOpacity>
      
        <View style={styles.container}>
          <TouchableOpacity
            onPressIn={this.startRecording}
            onPressOut={this.handleOnPressOut}
          >
            {isFetching && <ActivityIndicator color="#ffffff" />}
            {!isFetching &&
              <Text style={styles.text}>
                {isRecording ? 'انا اسمعك فضلاً تحدث...' : 'فهمت!'}
              </Text>
            }
          </TouchableOpacity>
          <Text>
            {`${transcript}`}
          </Text>
        </View>

        <Image
          style={{ width: 440, height: 360, bottom: -20 }}
          source={require('./222.png')} />
              
      </View>
    );
  }

}




const mapStateToProps = (state) => {
  return {
    toggle: state.toggle1Reducer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (status, btn) => dispatch(updateToggle(status, btn))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modelStyle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#8abbc6',
    marginLeft:10,
    
    marginBottom:20,
    
  },
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // container: {
  //   marginTop: 40,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  // },

  text: {
    color: '#fff',
  }
});

const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
