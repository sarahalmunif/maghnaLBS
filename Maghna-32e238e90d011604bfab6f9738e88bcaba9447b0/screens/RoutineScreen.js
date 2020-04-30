import React ,{ Component ,useState}  from 'react';
import { ScrollView,
 StyleSheet,
 Text,
 View,
 TextInput,
 Button,
 TouchableHighlight,
 TouchableOpacity,
 Image,
 Alert,
 ImageBackground,
 Platform,
 Modal, 
 Linking,
 AppState,
} from 'react-native';
import { FontAwesome5 ,AntDesign,Feather,MaterialCommunityIcons,SimpleLineIcons, Entypo, FontAwesome} from "@expo/vector-icons";
import { Root, Popup } from 'popup-ui'
import { Ionicons} from '@expo/vector-icons';
import * as firebase from 'firebase';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import GeoFencing from 'react-native-geo-fencing';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import Permissions from 'expo';
import IntentLauncherAndroid from 'expo';
//import Modal from 'react-native-modal';


export default class RoutineScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
          uID:'',
          name:"",
          email: "",
          password: "",
          confPassword: "",
          errorMsg:null,
          latitude:0,
          longitude:0,
          isActive:false,
          amount:0,
          changePassword:false,
          timeText : "" ,
          isSelectTime: false,
          modalVisible:false,
          info:"",
          notTrue:false,
          clear:false,
          saveModal:false,
          acc:'',
    
          passwordBorder:'#3E82A7',
          conPasswordBorder:'#3E82A7',
          emailBorder:'#3E82A7',
        
          formErrorMsg:'',
          errorMsgVisibilty:'none',
          passError:'none',
          errorMsg:null,
          nameBorders:"#3E82A7",

          morning_toggle: false,
          home_exit_toggle: false,
          home_toggle: false,
          evening_toggle: false,

          toggle_button_array: [
              { image: require('../assets/images/222.png'), clicked: false },
              { image: require('../assets/images/222.png'), clicked: false },
              { image: require('../assets/images/222.png'), clicked: false },
              { image: require('../assets/images/222.png'), clicked: false },
              { image: require('../assets/images/222.png'), clicked: false },
              { image: require('../assets/images/222.png'), clicked: false }
              
          ],
          devices_array: [
              { Text: " التكييف", clicked: false },
              { Text: " آلة القهوة", clicked: false },
              { Text: " باب المنزل", clicked: false },
              { Text: " التلفاز", clicked: false },
              { Text: " البوابة", clicked: false },
              { Text: " الإضاءة", clicked: false },
              { Text: " التكييف", clicked: false }
          ],

          date_picker_display: false,
          hours_array: [],
          minute_array: [],
          isLocationModalVisible:false,
          appState: AppState.currentState,
          isRegistered: false,
          fetchDate: null,
        }
    } 
    componentWillUnmount(){
        AppState.removeEventListener('change',this.handleAppStateChange)  ;

    }
    showModal = () => {
        console.log('showModal')
      this.setState({
      
          
        modalVisible: true
      });
    
      setTimeout(() => {
          this.setState({
            modalVisible: false,
            
          })
          }, 3000);
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
        }, 3000);
    }
    handleAppStateChange=(nextAppState)=>{
        if(this.state.appState.match(/inactive|background/)&&
        nextAppState==='active'){
            console.log('App has come to the foreground');
            this._get
        }
        this.setState({appState: nextAppState});
    }

    UNSAFE_componentWillMount(){
    
    /* const firebaseConfig = {
    
/*
    apiKey: "AIzaSyAAM7t0ls6TRpHDDmHZ4-JWaCLaGWZOokI",
    authDomain: "maghnaapplication.firebaseapp.com",
    databaseURL: "https://maghnaapplication.firebaseio.com",
    projectId: "maghnaapplication",
    storageBucket: "maghnaapplication.appspot.com",
    messagingSenderId: "244460583192",
    appId: "1:244460583192:web:f650fa57532a682962c66d",

*/
/*apiKey: "AIzaSyBUBKLW6Wrk48NQ_TcgUerucTZFphw6l-c",
authDomain: "maghna-62c55.firebaseapp.com",
databaseURL: "https://maghna-62c55.firebaseio.com",
projectId: "maghna-62c55",
storageBucket: "maghna-62c55.appspot.com",
messagingSenderId: "21464439338",
appId: "1:21464439338:web:8c6bb486fb3673e5d14153",
measurementId: "G-R3BQPCTCTM"
     
      };
    
    
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }*/
      AppState.addEventListener('change',this.handleAppStateChange)  ;
    
    }
   async componentDidMount(){
        const firebaseConfig = {


            apiKey: "AIzaSyCsKoPxvbEp7rAol5m-v3nvgF9t8gUDdNc",
            authDomain: "maghnatest.firebaseapp.com",
            databaseURL: "https://maghnatest.firebaseio.com",
            projectId: "maghnatest",
            storageBucket: "maghnatest.appspot.com",
            messagingSenderId: "769071221745",
            appId: "1:769071221745:web:1f0708d203330948655250",
        }

           if (!firebase.apps.length) {
               firebase.initializeApp(firebaseConfig);
            }
      this.props.navigation.setParams({
        headerLeft: (<TouchableOpacity onPress={this.handelSignOut}>
           <SimpleLineIcons name="logout" size={24} color='white' style={{marginLeft:15}} />
        </TouchableOpacity>)
    })
    var lat;
    var lng;
    var iduser = firebase.auth().currentUser.uid;
    var usersArr =[];

    firebase.database().ref('mgnUsers/'+firebase.auth().currentUser.uid).once('value',(snap)=>{ 
       console.log("inside database with problem")
      lat= snap.val().latitude;
      lng= snap.val().longitude;
    
        
          })
          firebase.database().ref('routine/').once('value',(snap)=>{ 
            console.log("enter routine");
          snap.forEach(item => {
              var temp = item.val();
              if(temp.userID == iduser )
              usersArr.push(temp.userID);
              return false;
     });
     if (usersArr.indexOf(iduser)!= -1){
         console.log("I'm ture");
        
      
     } });

 // await AsyncStorage.setItem('latPoint',lat);
//await AsyncStorage.setItem('lngPoint',lng);
           
try{


let { status} = await Location.requestPermissionsAsync();

console.log("permission status is"+ status);
if(status !=='granted'){

}
else {
   // await Location.startLocationUpdatesAsync('locationTask', {
    //    accuracy: Location.Accuracy.Balanced,
    //  });
    if(!(lat==='0'&& lng==='0')){
    Location.startGeofencingAsync('locationTask',[
        {
            "identifier": "A",
            "latitude": lat,//await AsyncStorage.getItem('latPoint'),
            "longitude": lng, //await AsyncStorage.getItem('lngPoint'),
            "notifyOnEnter": true,
            "notifyOnExit": true,
            "radius":100
        }
    ])
}
    }
   }
    catch(error){
       // let status =Location.getProviderStatusAsync();
      //  if(!Location.hasServicesEnabledAsync()){
        //   this.setState({isLocationModalVisible: true});


    }

    }
      
  // }

    
   static createPolygon = async () => {

    const latValue= await AsyncStorage.getItem('latPoint');
    const lngValue= await AsyncStorage.getItem('lngPoint');
const polygon=[
    { lat: latValue+50, lng: lngValue+50 },
    { lat: latValue-50, lng: lngValue+50 },
    { lat: latValue-50, lng: lngValue-50 },
    { lat: latValue+50, lng: lngValue-50},
    { lat: latValue+50, lng: lngValue+50 }
]
return polygon

    }

    
    handelSignOut =() =>{
      var {navigation}=this.props;
      console.log("login method");
      
      console.log("inside");
      try{
        console.log(this.state);
       firebase
        .auth()
        .signOut()
        .then(function(){
       navigation.navigate('WelcomeStackNavigator')
        })
        
        .catch(error => console.log(error.message))
    
        }catch(e){console.log(e.message)}
        
    };
    
  

    UNSAFE_componentWillMount() {
        var hours_array = [];
        var minute_array = [];
        for(i = 0; i < 60; i ++) {
            if(i < 10) {
                if( i == 0) {
                    //hours_array.push({value: '0' + i.toString(), clicked: true})
                    minute_array.push({value: '0' + i.toString(), clicked: true})
                } else {
                    hours_array.push({value: '0' + i.toString(), clicked: false})
                    minute_array.push({value: '0' + i.toString(), clicked: false})
                }
                
            } else {
                if(i > 24) {
                    minute_array.push({value: i.toString(), clicked: false})
                } else {
                    hours_array.push({value: i.toString(), clicked: false})
                    minute_array.push({value: i.toString(), clicked: false})
                }
            }
        }
        this.setState({
            minute_array: minute_array,
            hours_array: hours_array,
           
        })
    }

    click_togglebutton(index) {
        var toggle_button_array = this.state.toggle_button_array;
        toggle_button_array[index].clicked = !toggle_button_array[index].clicked;
        this.setState({
            toggle_button_array: toggle_button_array
        })
    }

    release_button_action(index) {
        this.setState({
            timeText:""
                  })
        var user = firebase.auth().currentUser;
        if(index == 0) {
            this.setState({
                morning_toggle: true,
                home_exit_toggle: false,
                home_toggle: false,
                evening_toggle: false,
            })
           
                 
            var routineAcc  ;
            var routineTime ;
            firebase.database().ref('/routine').once("value",snapshot=>{
               snapshot.forEach(item => {
                var temp = item.val();
                console.log('for each')
                if(temp.userID == user.uid && temp.name == 'morning routine'){
                    console.log('in if')
                    console.log("yes have user");
                  
                   routineAcc= temp.actionsID[0];
                   console.log(routineAcc)
                   this.setState({
                       acc:routineAcc,
                   })
                     routineTime = temp.time;
                   console.log(temp.name);
                   console.log(routineTime);
                   this.setState({
                    timeText: "وقت النمط الذي قمت بتخزينه هو: " +routineTime
                          })
                }//end if 
               });//end forEach
               if (routineAcc =='001'){
  
                console.log('true123')
               this.click_togglebutton(5)
               
            } 
        
            });//end snapshot..
            console.log('1234')
            console.log(routineAcc + 'out')
            console.log('this' + this.state.acc)
            
           
         
            
        }
         else if(index == 1) {
            this.setState({
                morning_toggle: false,
                home_exit_toggle: true,
                home_toggle: false,
                evening_toggle: false,
            })
            var routineAcc ;
            var routineTime ;
            firebase.database().ref('/routine').once("value",snapshot=>{
               snapshot.forEach(item => {
                var temp = item.val();
                console.log('for each')
                if(temp.userID == user.uid && temp.name == 'leave routine'){
                    console.log('in if')
                    console.log("yes have user");
                   routineAcc= temp.actionsID[0];
                     routineTime = temp.time;
                   console.log(temp.name);
                }//end if 
               });//end forEach
               if (routineAcc =='001'){
  
                console.log('true123')
               this.click_togglebutton(5)
               
            } 
       
            });//end snapshot..
            
            
        } else if(index == 2) {
            this.setState({
                morning_toggle: false,
                home_exit_toggle: false,
                home_toggle: true,
                evening_toggle: false,
            })
            var routineAcc ;
            var routineTime ;
            firebase.database().ref('/routine').once("value",snapshot=>{
               snapshot.forEach(item => {
                var temp = item.val();
                console.log('for each')
                if(temp.userID == user.uid && temp.name == 'come routine'){
                    console.log('in if')
                    console.log("yes have user");
                   routineAcc= temp.actionsID[0];
                     routineTime = temp.time;
                   console.log(temp.name);
                }//end if 
               });//end forEach
               if (routineAcc =='001'){
  
                console.log('true123')
               this.click_togglebutton(5)
               
            } 
            });//end snapshot..
           
            
        } else if(index == 3) {
            this.setState({
                morning_toggle: false,
                home_exit_toggle: false,
                home_toggle: false,
                evening_toggle: true,
            })
            var routineAcc ;
            var routineTime ;
            firebase.database().ref('/routine').once("value",snapshot=>{
               snapshot.forEach(item => {
                var temp = item.val();
                console.log('for each')
                if(temp.userID == user.uid && temp.name == 'night routine'){
                    console.log('in if')
                    console.log("yes have user");
                   routineAcc= temp.actionsID[0];
                     routineTime = temp.time;
                   console.log(temp.name);
                   this.setState({
                    timeText: "وقت النمط الذي قمت بتخزينه هو: " +routineTime
                          })
                }//end if 
             
               });//end forEach
             
               if (routineAcc =='001'){
  
                console.log('true123')
               this.click_togglebutton(5)
               
            } 
            });//end snapshot..
          
            
        }
    }
     
    setActionTable = () =>{
        var action =0;
        var device="";
        var command ="";
      for (i = 1 ;i<=2 ;i++ ){
          switch(i){
              case 1: 
              action="001";
              device="001";
              command="Turn On Light";
              firebase.database().ref('action/'+action).set(
                {
                    actionID:action,
                deviceID: device,
                commandStatment: command,
    
                  
                 
                  
                })
              break;
              case 2: 
              action="002";
              device="001";
              command="Turn Off Light";
              firebase.database().ref('action/'+action).set(
                {
                    actionID:action,
                deviceID: device,
                commandStatment: command,
    
                  
                 
                  
                })
              break;}
            }
        }
 save_button_action(index) {
            var lat , lng , i;
           
            var user = firebase.auth().currentUser;
            console.log(user.uid)
            var routineName,routineTime , disRoutine
            var tmp_str = "" ;
            var actions = [];
            var i ,j;
            var flag = false
            var flagH = false ;
            firebase.database().ref('mgnUsers/'+firebase.auth().currentUser.uid).once('value',(snap)=>{ 
            
             lat= snap.val().latitude;
             console.log(''+lat);
             lng= snap.val().longitude;
            console.log(lng)})
        
            
        
                //var routineTable =  firebase.database().ref('routine/'); 
             // this.setActionTable();
                
                if(this.state.morning_toggle&&index==0) {
                    flagH = false ;
                    routineName = "morning routine";
           
                    disRoutine = "الوضع الصباحي";
                if(this.state.toggle_button_array[0].clicked||this.state.toggle_button_array[1].clicked||
                    this.state.toggle_button_array[2].clicked||this.state.toggle_button_array[3].clicked||
                    this.state.toggle_button_array[4].clicked){
                    console.log('is it door');
                  this.setState({
                      info:"الأجهزة غير مدعومة بعد ، الإنارة فقط مدعومة",
                    notTrue:true
                  })
                    this.showModal();
                    for(i=0 ; i<5;i++){
                        this.state.toggle_button_array[i].clicked=false
                    }
                    return;
                }
                    for(i =0;i<this.state.toggle_button_array.length;i++){
                        if (this.state.toggle_button_array[i].clicked){
                            var ac = i+1;
                            if (ac == 6 ){
                                actions.push("00"+1);
                            }
                          
        
                        }
                        else {
                            var num = i+8 ;
                           
                            
                                if (num == 13){
                                    actions.push("00"+2);  
                                }
                               
                            }
                            
                        
                    }
                         
                for(i = 0; i < this.state.hours_array.length; i ++) {
                    if( !flag&&this.state.hours_array[i].clicked) {
                        this.setState ({isSelectTime :true});
                          flagH = true;
                       
                        routineTime = this.state.hours_array[i].value;
                        break;
                    }
                  
                }
                if (!this.state.isSelectTime){
                    this.setState({
                        info:"عذراً، عليك اختيار وقت للوضع أولاً",
                      notTrue:true
                    })
                      this.showModal();
                   return;
                }
                //test it 
                for(j = 0; j < this.state.minute_array.length; j ++) {
                    if(!flag&&this.state.minute_array[j].clicked) {
                     
                        routineTime+= ":"+this.state.minute_array[j].value;
                        break;
                    }
                }
                
                }// end if for morning routine
                 else if(this.state.home_exit_toggle&&index==1) {
                  
                     console.log((lat === 0 && lng===0) + "have error");
                     if(lat === 0 && lng===0){
                        this.setState({
                            info:"عذراً، عليك تفعيل خاصية الموقع حتى يتم انشاء وضع الخروج",
                          notTrue:true
                        })
                          this.showModal();
                     }// end if check location
                     else {
                        if(this.state.toggle_button_array[0].clicked||this.state.toggle_button_array[1].clicked||
                            this.state.toggle_button_array[2].clicked||this.state.toggle_button_array[3].clicked||
                            this.state.toggle_button_array[4].clicked){
                            console.log('is it door');
                          this.setState({
                              info:"الأجهزة غير مدعومة بعد ، الإنارة فقط مدعومة"
                          })
                          for(i=0 ; i<5;i++){
                            this.state.toggle_button_array[i].clicked=false
                        }
                            this.showModal();
                            return;
                        }
                    routineName="leave routine";
                   
                     disRoutine = "وضع الخروج";
                     flag = true
                     routineTime = "empty"
                     // check location
                    for(i =0;i<this.state.toggle_button_array.length;i++){
                        if (this.state.toggle_button_array[i].clicked){
                            var ac = i+1;
                            if (ac = 6 ){
                                actions.push("00"+1);
                            }
                          
        
                        }
                        else {
                            var num = i+8 ;
                           
                            
                                if (num == 13){
                                    actions.push("00"+2);  
                                }
                               
                            }
                }//end loop
            }//end set info of leave routine.
                }// end if for leave routine
                 else if(this.state.home_toggle&&index==2) {
                    if(lat === 0 && lng===0){
                       
                        this.setState({
                            info:"عذراً، عليك تفعيل خاصية الموقع حتى يتم انشاء وضع العودة",
                          notTrue:true
                        })
                          this.showModal();
                     }
                     else {
                        if(this.state.toggle_button_array[0].clicked||this.state.toggle_button_array[1].clicked||
                            this.state.toggle_button_array[2].clicked||this.state.toggle_button_array[3].clicked||
                            this.state.toggle_button_array[4].clicked){
                            console.log('is it door');
                          this.setState({
                              info:"الأجهزة غير مدعومة بعد ، الإنارة فقط مدعومة"
                          })
                            this.showModal();
                            for(i=0 ; i<5;i++){
                                this.state.toggle_button_array[i].clicked=false
                            }
                            return;
                        }
                     
                    routineName="come routine";
                  
                    disRoutine="وضع العودة";
                    routineTime = "empty"
                    flag =true
                    // set If cindition for check location
                    for(i =0;i<this.state.toggle_button_array.length;i++){
                        if (this.state.toggle_button_array[i].clicked){
                            var ac = i+1;
                            if (ac == 6 ){
                                actions.push("00"+1);
                            }
                          
        
                        }
                        else {
                            var num = i+8 ;
                           
                            
                                if (num == 13){
                                    actions.push("00"+2);  
                                }
                               
                            }
                }//end loop
            }//end if for set info of come routine.
                }//end if for come routine
                 else if(this.state.evening_toggle&&index==3) {
                    if(this.state.toggle_button_array[0].clicked||this.state.toggle_button_array[1].clicked||
                        this.state.toggle_button_array[2].clicked||this.state.toggle_button_array[3].clicked||
                        this.state.toggle_button_array[4].clicked){
                        console.log('is it door');
                      this.setState({
                          info:"الأجهزة غير مدعومة بعد ، الإنارة فقط مدعومة"
                      })
                        this.showModal();
                        for(i=0 ; i<5;i++){
                            this.state.toggle_button_array[i].clicked=false
                        }
                        return;
                    }
                    flagH=false;
                    routineName="night routine";
                   
                    disRoutine="الوضع المسائي";
                    for(i =0;i<this.state.toggle_button_array.length;i++){
                        if (this.state.toggle_button_array[i].clicked){
                            var ac = i+1;
                            if (ac = 6 ){
                                actions.push("00"+1);
                            }
                          
        
                        }
                        else {
                            var num = i+8 ;
                           
                            
                                if (num == 13){
                                    actions.push("00"+2);  
                                }
                               
                            }
                }//end loop
                for(i = 0; i < this.state.hours_array.length; i ++) {
                    if( !flag&&this.state.hours_array[i].clicked) {
                        this.setState ({isSelectTime :true});
                          flagH = true;
                       
                        routineTime = this.state.hours_array[i].value;
                        console.log("print")
                        break;
                    }
                  
                }
                if (!this.state.isSelectTime){
                    this.setState({
                        info:"عذراً، عليك اختيار وقت للوضع أولاً",
                      notTrue:true
                    })
                      this.showModal();
                   return;
                }
                //test it 
                for(j = 0; j < this.state.minute_array.length; j ++) {
                    if(!flag&&this.state.minute_array[j].clicked) {
                        
                        routineTime+= ":"+this.state.minute_array[j].value;
                        break;
                    }
                }
                }//end if for night routine
               
           
                 if (( routineName == "morning routine" || routineName == "night routine" )){
                  
                     console.log("in if save")
                     var userRoutineArr = [];
                     var trueSave=false;
                     firebase.database().ref('/routine').once("value",snapshot=>{
                        snapshot.forEach(item => {
                         var temp = item.val();
                         if(temp.userID == user.uid){
                             console.log("yes have user");
                            userRoutineArr.push(temp.name);
                            console.log(temp.name);
                         }//end if 
                        });//end forEach
                
                    
                  
                    if(userRoutineArr.indexOf(routineName)!=-1){
                        console.log("enter if check")
                        firebase.database().ref('/routine').once("value" , (snapshot)=>{
                            snapshot.forEach(item => {
                                
                             var temp = item.val();
                             console.log(temp);
                             if(temp.userID == user.uid && temp.name == routineName){
                                 var theId = item.key;
                        
                            
                             firebase.database().ref('routine/'+theId).update(  {
                                name: routineName,
                               time: routineTime,
                                actionsID: actions,
                                day: ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"],
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
                              day: ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"],
                              userID: user.uid,
                              status: 1,
                
                            })//end set routine.
                            
                           
                    }
                 
               });//end snapshot..
              
                 
               this.setState({
                info:"تم حفظ  " + disRoutine,
                clear:true
        
            })
            this.showSaveModal();
                   this.setState({
                    morning_toggle: false,
                    home_exit_toggle: false,
                    home_toggle: false,
                    evening_toggle: false,})  
                    for(i=0;i<6;i++){
                        this.state.toggle_button_array[i].clicked==false
                    }
              
                   
               
             }//end set morning or night routine.
        
        
             //Leave come Firebase
              else if(routineName == "leave routine" || routineName == "come routine" 
                            && user.longitude != 0 && user.latitude !=0 ){
                                var userRoutineArr = [];
                                firebase.database().ref('/routine').once("value",snapshot=>{
                                   snapshot.forEach(item => {
                                    var temp = item.val();
                                    if(temp.userID == user.uid){
                                        console.log("yes have user");
                                       userRoutineArr.push(temp.name);
                                       console.log(temp.name);
                                    }//end if 
                                   });//end forEach
                           
                               
                             
                               if(userRoutineArr.indexOf(routineName)!=-1){
                                   console.log("enter if check")
                                   firebase.database().ref('/routine').once("value" , (snapshot)=>{
                                       snapshot.forEach(item => {
                                           
                                        var temp = item.val();
                                        console.log(temp);
                                        if(temp.userID == user.uid && temp.name == routineName){
                                            var theId = item.key;
                                   
                                       //Morning and night firebase
                                        firebase.database().ref('routine/'+theId).update(  {
                                           name: routineName,
                                          time: routineTime,
                                           actionsID: actions,
                                           day: ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"],
                                           userID: user.uid,
                                           status: 1,
                             
                                         }); 
                                        
                                      
                                     
                                        }//end if 
                                       });//end forEach
                               
                                    
                                    
                                    });//end snapshot..
                                    
                    }
                    else{
                    firebase.database().ref('routine/').push(
                        {
                          name: routineName,
                          time: routineTime,
                          actionsID: actions,
                          day: ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"],
                          userID: user.uid,
                          status: 1,
            
                        })//end set routine. 
                    
                    }  });//end snapshot..
                    console.log('will appear' + disRoutine);
                    this.setState({
                        info:"تم حفظ  " + disRoutine,
                        clear:true
                
                    })
                    console.log('yes I set');
                    
                    this.showSaveModal();
                           this.setState({
                            morning_toggle: false,
                            home_exit_toggle: false,
                            home_toggle: false,
                            evening_toggle: false,})  
                            for(i=0;i<6;i++){
                                this.state.toggle_button_array[i].clicked==false
                            } }
              
                console.log("save routine");
                
        
        
                if(index == 0) {
                    this.setState({
                        morning_toggle: false,
                    })
                } else if(index == 1) {
                    this.setState({
                        home_exit_toggle: false,
                    })
                } else if(index == 2) {
                    this.setState({
                        home_toggle: false,
                    })
                } else if(index == 3) {
                    this.setState({
                        home_toggle: false,
                    })
                }
                var toggle_button_array = this.state.toggle_button_array;
                for(i = 0; i < toggle_button_array.length; i ++) {
                    toggle_button_array[i].clicked = false;
                }
                this.setState({
                    toggle_button_array: toggle_button_array
                });
        
                this.init_hourminute_array()
            }

            select_hour(index) {
                this.setState ({isSelectTime:true})
                var hours_array = this.state.hours_array;
                for(i = 0; i < hours_array.length; i ++) {
                    if(i == index) {
                        hours_array[i].clicked = true;
                    } else {
                        hours_array[i].clicked = false;
                    }
                }
                this.setState({
                    hours_array: hours_array
                })
            }// end save action..
              
            select_hour(index) {
                var hours_array = this.state.hours_array;
                for(i = 0; i < hours_array.length; i ++) {
                    if(i == index) {
                        hours_array[i].clicked = true;
                    } else {
                        hours_array[i].clicked = false;
                    }
                }
                this.setState({
                    hours_array: hours_array
                })
            }

    select_minute(index) {
        var minute_array = this.state.minute_array;
        for(i = 0; i < minute_array.length; i ++) {
            if(i == index) {
                minute_array[i].clicked = true;
            } else {
                minute_array[i].clicked = false;
            }
        }
        this.setState({
            minute_array: minute_array
        })
    }


    init_hourminute_array() {
        this.setState ({isSelectTime:false})
        var hours_array = this.state.hours_array;
        for(i = 0; i < hours_array.length; i ++) {
           
                hours_array[i].clicked = false;
            
            
        }
        var minute_array = this.state.minute_array;
        for(i = 0; i < minute_array.length; i ++) {
            if(i == 0) {
                minute_array[i].clicked = true;
            } else {
                minute_array[i].clicked = false;
            }
            
        }
        this.setState({
            hours_array: hours_array,
            minute_array: minute_array
        })
    }

    openSetting =()=>{
        if(Platform.OS=='ios')
        {
            Linking.openURL('app-settings:')
        }
        else{
           IntentLauncherAndroid.startActivityAsync(
               IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
           ) 
        }
        this.setState({openSetting: false})

    }

    cancelSave (){
        this.setState({
            morning_toggle: false,
            home_exit_toggle: false,
            home_toggle: false,
            evening_toggle: false,})  
            for(i=0;i<6;i++){
                this.state.toggle_button_array[i].clicked==false
            }
            this.init_hourminute_array(); 
    }
    render() {
        return (


                 
      
            <View style={styles.container}>
       

               
                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.date_picker_display}
                    backdropColor = {'#999999'}
                    backdropOpacity = {0.3}
                    onRequestClose={() => {
                        Alert.alert('تم إغلاق النمط');
                    }}>
                    <View style = {{flex: 1, }}>
                        <View style = {{width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, backgroundColor: '#000000', opacity: 0.5, justifyContent: 'center', alignItems: 'center'}}/>
                        <View style = {{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                            <View style = {{width: '70%', height: 300, backgroundColor: '#ffffff', borderRadius: 5}}>
                                <View style = {{width: '100%', justifyContent: 'center', marginTop: 15, marginBottom: 15}}>
                                    <Text style = {styles.modalTitle}>{"قم باختيار الوقت المناسب"}</Text>
                                </View>
                                <View style = {{width: '100%', flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style = {{width: '45%', height: '100%'}}>
                                        <View style = {{width: '100%', alignItems: 'center'}}>
                                            <Text style={styles.signUpText}>الساعة</Text>
                                        </View>
                                        <ScrollView style = {{width: '100%'}}>
                                        {
                                            this.state.hours_array.map((item, index) => 
                                            <TouchableOpacity key = {index} style = {{width: '100%', height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: item.clicked ? '#e8e8e8' : null}} onPress = {() =>{ this.select_hour(index); this.setState ({isSelectTime:true})}}>
                                                <Text style={styles.signUpText}>{item.value}</Text>
                                            </TouchableOpacity>
                                            )
                                        }
                                        </ScrollView>
                                    </View>
                                    <View style = {{width: '45%', height: '100%'}}>
                                        <View style = {{width: '100%', alignItems: 'center'}}>
                                            <Text style={styles.signUpText}>الدقيقة</Text>
                                        </View>
                                        <ScrollView style = {{width: '100%'}}>
                                        {
                                            this.state.minute_array.map((item, index) => 
                                            <TouchableOpacity key = {index} style = {{width: '100%', height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: item.clicked ? '#e8e8e8' : null}} onPress = {() => this.select_minute(index)}>
                                                <Text style={styles.signUpText}>{item.value}</Text>
                                            </TouchableOpacity>
                                            )
                                        }
                                        </ScrollView>
                                    </View>
                                </View>
                                <View style = {{width: '100%', justifyContent: 'space-around', marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                                    <TouchableHighlight 
                                    style={[styles.buttonContainer, styles.signupButton,styles.timersButton , {color: '#8abbc6', marginTop: 1}]} onPress={() => this.setState({date_picker_display: false})} >
                                        <Text style={styles.signUpText ,{color: '#8abbc6',}}> حفظ </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.signupButton, styles.timersButton ,{marginTop: 0}]} onPress={() => {this.setState({date_picker_display: false}); this.init_hourminute_array()}} >
                                        <Text style={styles.signUpText}> إلغاء </Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ImageBackground source={require('../assets/images/halfBlue.png') } style={{ height:"100%",justifyContent: 'center',alignItems: 'center', marginTop:20, }}>
                <ScrollView>
                   <Root>
                    <ScrollView style = {{height:"100%", width: '100%'}}>
                        <View style={styles.smallContainer}>
                            <View style={{flexDirection: 'row' }} > 
                            <Ionicons style={styles.iconsSTY} name="md-sunny" color="#2287ac" size={70} />
                                    <Text style={styles.routineTitle}>
                                    الوضع الصباحي
                                    </Text>
                
                            </View>
                            
                            
                        {
                            this.state.morning_toggle &&
                            <View style = {{width: '100%', marginTop: 6}}>
                                <Text style={styles.routineTimeStyle}>{this.state.timeText} </Text>
                                <ScrollView style = {{width: '100%', height: 80}} horizontal = {true}>
                                {
                                    this.state.toggle_button_array.map((item, index) => 
                                     
                                    <TouchableOpacity key = {index} style = {[styles.toggle_button, {marginRight: 5}, item.clicked ? {backgroundColor: '#2287ac'} : {backgroundColor: '#c0c0c0'}]} onPress = {() => this.click_togglebutton(index)}>
                                    {
                                        (index == 0) &&
                                        < Entypo
                                        
                                            name="air"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                           
                                        />

                                    }
                                    {
                                        (index == 1) &&
                                        <MaterialCommunityIcons
                                            name="coffee-outline"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 2) &&
                                        <MaterialCommunityIcons
                                        name="door"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 3) &&
                                        <FontAwesome
                                            name="tv"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                            />
                                    }
                                    {
                                        (index == 4) &&
                                        <MaterialCommunityIcons
                                        name="garage"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 5) &&
                                        <MaterialCommunityIcons
                                            name="lightbulb-on-outline"
                                            size={40}
                                            color=
                                            {'white'}
                                            />
                                    }
                                  

                                    </TouchableOpacity>
                                    
                                    )
                                    
                                }
                           
                                </ScrollView>
                                
                                <View style = {{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton,{color: '#8abbc6',}]} onPress={() => this.save_button_action(0)} >
                                        <Text style={styles.signUpText,{color: '#8abbc6',}}> حـفـظ </Text>
                                           
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.setState({date_picker_display: true})} >
                                        <Text style={styles.signUpText}> المؤقت </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.cancelSave ()} >
                                        <Text style={styles.signUpText}> إلـغـاء </Text>
                                    </TouchableHighlight>
                                </View>
                                <Modal
                               animationType="slide"
                                 transparent={true}
                                 visible={this.state.modalVisible}
                                 onRequestClose={() => {
                                    console.log('Modal has been closed.');}}>
                                   
                                <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                 <Text style={styles.modelStyle}>{this.state.info}</Text>
                             </View>
                              </View>
                                    </Modal>
                            </View>
                        }
                        {
                            !this.state.morning_toggle &&
                            <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} 
                                onPress={() =>
                                        // Popup.show({
                                        // type: 'Success', 
                                        // title: 'تحرير النمط ',
                                        // button: false,
                                        // textBody: 'will chnage it to a new page ', 
                                        // buttontext: ' ',
                                        // callback: () => Popup.hide()
                                        // })
                                        this.release_button_action(0)
                                    } 
                            >
                                <Text style={styles.signUpText}>  تحرير </Text>
                            </TouchableHighlight>
                        }
                        </View>

                        <View style={styles.smallContainer}  >
                            <View style={{flexDirection: 'row'}}  >  
                            <MaterialCommunityIcons style={styles.iconsSTY} color="#2287ac" name="door-open" size={70} />
                                <Text style={styles.routineTitle} >
                            وضع الخروج
                                </Text>
                            </View>
                        {
                            this.state.home_exit_toggle &&
                            <View style = {{width: '100%', marginTop: 15}}>
                                <ScrollView style = {{width: '100%', height: 80}} horizontal = {true}>
                                {
                                    this.state.toggle_button_array.map((item, index) => 
                                    <TouchableOpacity key = {index} style = {[styles.toggle_button, {marginRight: 5}, item.clicked ? {backgroundColor: '#2287ac'} : {backgroundColor: '#c0c0c0'}]} onPress = {() => this.click_togglebutton(index)}>
                                        {/* <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {item.image}></Image> */}
                                        {
                                        (index == 0) &&
                                        < Entypo
                                            name="air"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                           
                                          
                                        />

                                    }
                                    {
                                        (index == 1) &&
                                        <MaterialCommunityIcons
                                            name="coffee-outline"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 2) &&
                                        <MaterialCommunityIcons
                                        name="door"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 3) &&
                                        <FontAwesome
                                            name="tv"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                            />
                                    }
                                    {
                                        (index == 4) &&
                                        <MaterialCommunityIcons
                                        name="garage"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 5) &&
                                        <MaterialCommunityIcons
                                            name="lightbulb-on-outline"
                                            size={40}
                                            color=
                                            {'white'}
                                            />
                                    }
                                   

                                    </TouchableOpacity>
                                    )
                                }
                                </ScrollView>
                                <View style = {{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton,{color: '#8abbc6'}]} onPress={() => this.save_button_action(1)} >
                                        <Text style={[styles.signUpText,{color: '#8abbc6',}]}> حـفـظ </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.cancelSave ()} >
                                        <Text style={styles.signUpText}> إلـغـاء </Text>
                                    </TouchableHighlight>
                                    {/* <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.setState({date_picker_display: true})} >
                                        <Text style={styles.signUpText}> المؤقت </Text>
                                    </TouchableHighlight> */}
                                </View>
                                <Modal
                               animationType="slide"
                                 transparent={true}
                                 visible={this.state.modalVisible}
                                 onRequestClose={() => {
                                    console.log('Modal has been closed.');}}>
                                   
                                <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                 <Text style={styles.modelStyle}>{this.state.info}</Text>
                             </View>
                              </View>
                                    </Modal>
                            </View>
                        }
                        {
                            !this.state.home_exit_toggle &&
                            <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={()=>{this.release_button_action(1)}}>
                                <Text style={styles.signUpText}>  تحرير </Text>
                            </TouchableHighlight>
                        }
                        </View>

                        <View style={styles.smallContainer}>
                            <View style={{flexDirection: 'row'}} > 
                                <AntDesign name="home" size={70} color="#2287ac" />
                                <Text style={styles.routineTitle}>
                                وضع العودة 
                                </Text>
                            </View>
                        {
                            this.state.home_toggle &&
                            <View style = {{width: '100%', marginTop: 15}}>
                                <ScrollView style = {{width: '100%', height: 80}} horizontal = {true}>
                                {
                                    this.state.toggle_button_array.map((item, index) => 
                                    <TouchableOpacity key = {index} style = {[styles.toggle_button, {marginRight: 5}, item.clicked ? {backgroundColor: '#2287ac'} : {backgroundColor: '#c0c0c0'}]} onPress = {() => this.click_togglebutton(index)}>
                                        {/* <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {item.image}></Image> */}
                                        {
                                        (index == 0) &&
                                        < Entypo
                                            name="air"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                        />

                                    }
                                    {
                                        (index == 1) &&
                                        <MaterialCommunityIcons
                                            name="coffee-outline"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 2) &&
                                        <MaterialCommunityIcons
                                        name="door"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 3) &&
                                        <FontAwesome
                                            name="tv"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                            />
                                    }
                                    {
                                        (index == 4) &&
                                        <MaterialCommunityIcons
                                        name="garage"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                    }
                                    {
                                        (index == 5) &&
                                        <MaterialCommunityIcons
                                            name="lightbulb-on-outline"
                                            size={40}
                                            color=
                                            {'white'}
                                            />
                                    }
                                    {
                                        (index == 6) &&
                                        < Entypo
                                            name="air"
                                            size={40}
                                            color=
                                            {'#8abbc6'}
                                        />
                                    }

                                    </TouchableOpacity>
                                    )
                                }
                                </ScrollView>
                                <View style = {{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton,{color: '#8abbc6',}]} onPress={() => this.save_button_action(2)} >
                                        <Text style={styles.signUpText,{color: '#8abbc6',}}> حـفـظ </Text>

                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.cancelSave ()} >
                                        <Text style={styles.signUpText}> إلـغـاء </Text>
                                    </TouchableHighlight>
                                    {/* <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.setState({date_picker_display: true})} >
                                        <Text style={styles.signUpText}> المؤقت </Text>
                                    </TouchableHighlight> */}
                                </View>
                                <Modal
                               animationType="slide"
                                 transparent={true}
                                 visible={this.state.modalVisible}
                                 onRequestClose={() => {
                                    console.log('Modal has been closed.');}}>
                                   
                                <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                 <Text style={styles.modelStyle}>{this.state.info}</Text>
                             </View>
                              </View>
                                    </Modal>
                            </View>
                        }
                        
                        {
                            !this.state.home_toggle &&
                            <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} 
                            onPress={() =>
                                    // Popup.show({
                                    // type: 'Success', 
                                    // title: 'تحرير النمط ',
                                    // button: false,
                                    // textBody: 'will chnage it to a new page ', 
                                    // buttontext: ' ',
                                    // callback: () => Popup.hide()
                                    // })
                                    this.release_button_action(2)
                                } >
                                <Text style={styles.signUpText}>  تحرير </Text>
                            </TouchableHighlight>
                        }
                        </View>

                        <View style={styles.smallContainer}>
                            <View style={{flexDirection: 'row'}} > 
                                <MaterialCommunityIcons name="weather-night" size={70} color="#2287ac" style={styles.iconsSTY}  />
                                <Text style={styles.routineTitle}>
                                الوضع المسائي
                                </Text>
                            </View>
                        {
                            this.state.evening_toggle &&
                            <View style = {{width: '100%', marginTop: 15 ,   marginBottom:60}}>
                                <Text style={styles.routineTimeStyle}>{this.state.timeText} </Text>
                                <ScrollView style = {{width: '100%', height: 80}} horizontal = {true}>
                                {
                                    this.state.toggle_button_array.map((item, index) => 
                                    <TouchableOpacity key = {index} style = {[styles.toggle_button, {marginRight: 5}, item.clicked ? {backgroundColor: '#2287ac'} : {backgroundColor: '#c0c0c0'}]} onPress = {() => this.click_togglebutton(index)}>
                                    {/* <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {item.image}></Image> */}
                                    {
                                    (index == 0) &&
                                    < Entypo
                                        name="air"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                    />

                                }
                                {
                                    (index == 1) &&
                                    <MaterialCommunityIcons
                                        name="coffee-outline"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                    />
                                }
                                {
                                    (index == 2) &&
                                    <MaterialCommunityIcons
                                    name="door"
                                    size={40}
                                    color=
                                    {'#8abbc6'}
                                    />
                                }
                                {
                                    (index == 3) &&
                                    <FontAwesome
                                        name="tv"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                        />
                                }
                                {
                                    (index == 4) &&
                                    <MaterialCommunityIcons
                                    name="garage"
                                    size={40}
                                    color=
                                    {'#8abbc6'}
                                    />
                                }
                                {
                                    (index == 5) &&
                                    <MaterialCommunityIcons
                                        name="lightbulb-on-outline"
                                        size={40}
                                        color=
                                        {'white'}
                                        />
                                }
                                {
                                    (index == 6) &&
                                    < Entypo
                                        name="air"
                                        size={40}
                                        color=
                                        {'#8abbc6'}
                                    />
                                }

                                </TouchableOpacity>
                                )
                                }
                                </ScrollView>
                                <View style = {{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton,{color: '#8abbc6',}]} onPress={() => this.save_button_action(3)} >
                                        <Text style={styles.signUpText,{color: '#8abbc6',}}> حـفـظ </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.setState({date_picker_display: true})} >
                                        <Text style={styles.signUpText}> المؤقـت </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonContainer, styles.sTButton]} onPress={() => this.cancelSave ()} >
                                        <Text style={styles.signUpText}> إلـغـاء </Text>
                                    </TouchableHighlight>
                                </View>
                                <Modal
                               animationType="slide"
                                 transparent={true}
                                 visible={this.state.modalVisible}
                                 onRequestClose={() => {
                                    console.log('Modal has been closed.');}}>
                                   
                                <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                 <Text style={styles.modelStyle}>{this.state.info}</Text>
                             </View>
                              </View>
                                    </Modal>
                            </View>
                        }
                        {
                            !this.state.evening_toggle &&
                            <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} 
                                onPress={() =>
                                        // Popup.show({
                                        // type: 'Success', 
                                        // title: 'تحرير النمط ',
                                        // button: false,
                                        // textBody: 'will chnage it to a new page ', 
                                        // buttontext: ' ',
                                        // callback: () => Popup.hide()
                                        // })
                                        this.release_button_action(3)
                                    } >
                                <Text style={styles.signUpText}>  تحرير </Text>
                            </TouchableHighlight>
                        }
                        </View>
                    </ScrollView>
                    </Root>
                    </ScrollView>
                </ImageBackground>
        
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
            </View>
          
       
        

        );
        
    }



}
    




RoutineScreen.navigationOptions = ({navigation})=> ({

  headerTitle: 'الأنماط الشخصية',
 /* headerRight:()=>(
    <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={{marginRight:15}}>
      <AntDesign name="right" size={24} color="#fff"  />
    </TouchableOpacity>

  ),*/
  headerLeft:navigation.state.params && navigation.state.params.headerLeft,
  headerStyle: {
    backgroundColor: '#8BC4D0',
    color:'white'
    
 },
 headerTitleStyle: {
  color: '#fff'
}

});



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
     
    
  container: {
    
    //flex: 1,
   justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
  },

  backgroundIMG:{
   flex:1,
   width:'100%',
   height:'100%',
 
  },
  routineTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2287ac',
    marginLeft:80,
    marginBottom:10,
    
  },
  modelStyle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#8abbc6',
    marginLeft:10,
    
    marginBottom:20,
    
  },
  routineTimeStyle: {
    fontSize: 12.25,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#8abbc6',
    marginLeft:80,
   
    marginBottom:20,
    
  },
  iconsSTY:{
    marginLeft:-10,
    //marginTop:20,
 
    
  },
  inputContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderWidth: 1,
      width:250,
      height:35,
      marginBottom:15,
      bottom: 20,
      borderColor: '#EAEAEA'
  },

  smallContainer:{
    margin:20,
   // marginTop:-100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius:10,
    width:350,
    // height:140,
     //flexDirection: 'row'
     padding: 20,
     shadowOpacity: 0.1,
     opacity: 0.9,
  },
  perInfo:{
    color: '#9F9F9F',
    fontSize: 20,
    bottom: 30,
    marginTop: 20,
    marginBottom:20,
  },

  inputs:{
      //flex:1,
      height:40,
      alignSelf:'flex-end',
      borderColor: '#EAEAEA',
      marginRight:20,
     //marginLeft:-50,
 
  },
 

 icons:{
 // size : 30

 },

 buttonContainer: {
  //height:100,
 marginRight:-70,
  flexDirection: 'row',
  
  justifyContent: 'center',
  alignItems: 'center',
 //marginBottom:30,
  marginTop:-28,
  //width:70,
  borderRadius:20,
 },

  AnalysisButtonContainer:{
    height:45,
    width:70,
 borderWidth:1,
 marginRight:150,
 marginBottom:10,
 backgroundColor:'#3E82A7',
 //backgroundColor: this.sate.active?'#3E82A7':'red',
   //height:45,
   //flexDirection: 'row',
   //justifyContent: 'center',
   //alignItems: 'center',
   //marginBottom:10,
   //width:100,
   borderRadius:20,
  },

  AnalysisButton:{
    height:45,
    width:70,
   backgroundColor:'#BBCCCF',
   alignItems:'center',
   justifyContent:'center',
   borderRadius:20,
   //left:this.state.active ? 50 : 0 
   //marginRight:150,
  },

  signupButton: {

    height:30,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom:10,
   width:70,
   borderRadius:45,
   borderColor:'#BBCCCF',
   borderWidth:1,
   //marginRight:100,
   
    
  },  
  timersButton:{

    marginRight:7,

  },
  sTButton: {

    height:25,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   //marginBottom:10,
   width:70,
   borderRadius:45,
   borderColor:'#BBCCCF',
   borderWidth:1,
   marginTop:20,
   marginLeft:-100,
    
  },

  LocationButtonContainer:{
   height:45,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom:10,
   width:'80%',
   borderRadius:45,
   borderColor:'#BBCCCF',
   borderWidth:1,
  },
 
  AddlocationButton: {
   backgroundColor: "#ffffff",
   margin:7,
 
 },
 
 addLocationText:{
   color: '#BBC3D4',
   fontSize:15,
 },
 
  signUpText: {
    color: '#BBCCCF',
    fontSize:17,
    alignItems: 'center',
  },

  AnalysisText:{
   color: '#BBCCCF',
   marginLeft:150,
   marginBottom:-200,
   marginTop:10,
   
  },

  inline:{
   //flex:1,
   flexDirection:'row',
   justifyContent:'center',
   //marginRight:50,
   //marginLeft:50,
   
  },
  toggle_button: {
      height: '100%',
      aspectRatio: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2287ac',
    
  },
});