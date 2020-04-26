
import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Platform,
    StyleSheet, Text, View, Image, Button, backgroundColor, Alert, border, WIDTH, TouchableHighlight,
    TouchableOpacity, ScrollView, ImageBackground, AsyncStorage
} from 'react-native';
import { FontAwesome,FontAwesome5 ,AntDesign,Feather,MaterialCommunityIcons,SimpleLineIcons , Entypo} from "@expo/vector-icons";
import { MonoText } from '../components/StyledText';
import {LinearGradient} from 'expo-linear-gradient';
import STTButton from '../STTButton'
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import { Audio } from 'expo-av';
import * as Helper from "../components/Helper";

const soundObject = new Audio.Sound();

export default class  supdevicesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uID:'',
      name:"",
      email: "",
      password: "",
      confPassword: "",
      // errorMsg:null,
      latitude:0,
      longitude:0,
      isActive:false,
      amount:0,
      changePassword:false,

      passwordBorder:'#3E82A7',
      conPasswordBorder:'#3E82A7',
      emailBorder:'#3E82A7',

      formErrorMsg:'',
      errorMsgVisibilty:'none',
      passError:'none',
      errorMsg:null,
      nameBorders:"#3E82A7",
      isLambConnected :'غير متصله',
      isLambOn : 'مغلقه' ,
      lambColor :'#2cb457',
      textColor: styles.openText,
      read : false,
      playbackInstance: null,
    }
  }

  async componentDidMount(){


    this.didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      () => this.pause()
    )
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      async() => {
        var lampStatus = await Helper.getLightStatus();

        if(lampStatus==true)
        {
          this.setState({lambColor :'#2cb457'});
          this.setState({textColor :styles.openText});
          this.getAudio(); 
        }
        else {
            this.setState({lambColor:'#6FA0AF'});
            this.setState({textColor:styles.colseText});
            this.FgetAudio();
        }
      }
    )

    // this._unsubscribe = this.props.navigation.addListener('willFocus',async() => {

    //     var lampStatus = await Helper.getLightStatus();

    //     if(lampStatus==true)
    //     {
    //       this.setState({lambColor :'#2cb457'});
    //       this.setState({textColor :styles.openText});
    //       this.getAudio(); 
    //     }
    //     else {
    //         this.FgetAudio();
    //         this.setState({lambColor:'#6FA0AF'});
    //         this.setState({textColor:styles.colseText});
    //     }

    // });

    this.props.navigation.setParams({
        headerLeft: (<TouchableOpacity onPress={this.handelSignOut}>
          <SimpleLineIcons name="logout" size={24} color='white' style={{marginLeft:15}} />
        </TouchableOpacity>)
    })

  }

  async replay(){
    await soundObject.replayAsync()
  }

  async pause(){
      await soundObject.stopAsync()
  }

  async getAudio () {
    var lampStatus = await Helper.getLightStatus();
    if(lampStatus==true){
     console.log("Hi get audio ");
    alert("get");
      let fileURL = '';
      const text =  ' الأجهزة المُتَّصِلَه ، الإنَارَهْ ، مُتَّصِلَه ';

      axios.post(`http://45.32.251.50`,  {text} )
        .then(res => {
          console.log("----------------------Hi--------------------------"+res.data);
          fileURL = res.data;
              console.log(fileURL);

              this.playAudio(fileURL);

      })}

      else{    let fileURL = '';
      const text =  ' الأجهزة المُتَّصِلَه ، الإنَارَهْ ،غَيْرْ مُتَّصِلَه ';
      alert("forget")
      axios.post(`http://45.32.251.50`,  {text} )
        .then(res => {
          console.log("----------------------xxxx--------------------------"+res.data);
          fileURL = res.data;
              console.log(fileURL);
  
              this.playAudio(fileURL);
  
      })}
  }


  async FgetAudio () {
    var lampStatus = await Helper.getLightStatus();
    if(lampStatus==false){
    let fileURL = '';
    const text =  ' الأجهزة المُتَّصِلَه ، الإنَارَهْ ،غَيْرْ مُتَّصِلَه ';
    alert("forget")
    axios.post(`http://45.32.251.50`,  {text} )
      .then(res => {
        console.log("----------------------xxxx--------------------------"+res.data);
        fileURL = res.data;
            console.log(fileURL);

            this.playAudio(fileURL);

    })}
}
  async playAudio(fileURL){


    await Audio.setAudioModeAsync({
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

      // OR
      try {
        await soundObject.loadAsync({uri: fileURL});
        await soundObject.playAsync();
          // Your sound is playing!
      } catch (error) {
      // An error occurred!
      }
    }

    // async showLambStatus(){
    //   axios.get('https://192.168.100.17/api/gFkvbAB2-8SKjoqdgiTg5iWEHnpRtpo-gR9WVzoR/lights/3')
    //   .then(res => res.json())
    //   .then(res => {
    //     console.log(res.state.on)
    //   })

    //   .catch(error => {console.log(error);

    //   })

    //   if(res.state.on == true){
    //     isLambConnected = 'متصله',
    //     isLambOn = 'مفتوحه'
    //     lambColor = '#2cb457'
    //     textColor = styles.openText

    //     let fileURL = '';
    //     const text =  'الأجهزة المُتَّصِلَه ، الإنَارَهْ ، مُتَّصِلَه وَ مَفْتُوحَه ، التِّلْفَازْ ، غَيْر مُتَّصِل ومُغْلَق ، البَّوابَهْ غَيْر مُتَّصِلَه وَ مُغْلَقَهْ';

    //            axios.post(`http://45.32.251.50`,  {text} )
    //              .then(res => {
    //                 console.log("----------------------xxxx--------------------------"+res.data);
    //                fileURL = res.data;
    //                    console.log(fileURL);
    //                    this.playAudio(fileURL);

    //              })
    //   }


    //   if(res.state.on == false){
    //     isLambConnected = 'متصله',
    //     isLambOn = 'مغلقه'
    //     lambColor = '#6FA0AF'
    //     textColor = styles.colseText

    //     let fileURL = '';
    //     const text =  ' الأجهزة المُتَّصِلَه ، الإنَارَهْ ، مُتَّصِلَه وَ مُغْلَقَهْ ، التِّلْفَازْ ، غَيْر مُتَّصِل ومُغْلَق ، البَّوابَهْ غَيْر مُتَّصِلَه وَ مُغْلَقَهْ';

    //            axios.post(`http://45.32.251.50`,  {text} )
    //              .then(res => {
    //                 console.log("----------------------xxxx--------------------------"+res.data);
    //                fileURL = res.data;
    //                    console.log(fileURL);
    //                    this.playAudio(fileURL);

    //              })
    //   }

    //   else {  isLambConnected = 'غير متصله',
    //   isLambOn = 'مغلقه'
    //   lambColor = 'grey'
    //   textColor = styles.NotConnText

    //   let fileURL = '';
    //   const text =  'الأجهزة المُتَّصِلَه ، الإنَارَهْ ، غَيْر مُتَّصِلَه وَ مُغْلَقَهْ ، التِّلْفَازْ ، غَيْر مُتَّصِل ومُغْلَق ، البَّوابَهْ غَيْر مُتَّصِلَه وَ مُغْلَقَهْ';

    //          axios.post(`http://45.32.251.50`,  {text} )
    //            .then(res => {
    //               console.log("----------------------xxxx--------------------------"+res.data);
    //              fileURL = res.data;
    //                  console.log(fileURL);
    //                  this.playAudio(fileURL);

    //            })}
    // }


  UNSAFE_componentWillMount(){

  const firebaseConfig = {


    apiKey: "AIzaSyAAM7t0ls6TRpHDDmHZ4-JWaCLaGWZOokI",
    authDomain: "maghnaapplication.firebaseapp.com",
    databaseURL: "https://maghnaapplication.firebaseio.com",
    projectId: "maghnaapplication",
    storageBucket: "maghnaapplication.appspot.com",
    messagingSenderId: "244460583192",
    appId: "1:244460583192:web:f650fa57532a682962c66d",


    /*
    apiKey: "AIzaSyBUBKLW6Wrk48NQ_TcgUerucTZFphw6l-c",
    authDomain: "maghna-62c55.firebaseapp.com",
    databaseURL: "https://maghna-62c55.firebaseio.com",
    projectId: "maghna-62c55",
    storageBucket: "maghna-62c55.appspot.com",
    messagingSenderId: "21464439338",
    appId: "1:21464439338:web:8c6bb486fb3673e5d14153",
    measurementId: "G-R3BQPCTCTM"
      */
  };


  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

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

async componentWillUnMount(){
  this._unsubscribe();
  this.didBlurSubscription.remove()
  this.didFocusSubscription.remove()
  await soundObject.stopAsync();

}

render() {

    return (

      // here we need to specify which to read.
        <View style={{ width:'100%' , height:'100%', flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F7FAFF'}}>

          <ImageBackground source={require('./otherhalf.png')} style={{ width:'100%' , height:'120%', flex: 1, justifyContent: "center", alignItems: "center"}}>

          <ScrollView  style={styles.scrollView}>

          <View style={styles.scontainer}>

          <Text style={this.state.textColor}>الإنارة</Text>
          <MaterialCommunityIcons style={{ right:190, bottom: 17}} name="lightbulb-on-outline" size={55} color= {this.state.lambColor} />

          </View>


          <View style={styles.scontainer}>
          <Text style={styles.NotConnText}>التلفاز</Text>

          <FontAwesome style={{ right:190, bottom: 17}} name="tv" size={55} color= {'grey'} />
          </View>


          <View style={styles.scontainer}>
          <Text style={styles.NotConnText}>البوابة</Text>

          <MaterialCommunityIcons style={{ right:190, bottom: 17}} name="garage" size={55} color= {'grey'} />
          </View>


          <View style={styles.scontainer}>
          <Text style={styles.NotConnText}>الانترنت</Text>

          <Feather style={{ right:190, bottom: 17}} name="wifi" size={55} color= {'grey'} />
          </View>

          <View style={styles.scontainer}>
          <Text style={styles.NotConnText}>التكييف</Text>
          < Entypo style={{ right:190, bottom: 17}} name="air" size={55} color= {'grey'} />
          </View>


          <View style={styles.scontainer}>
          <Text style={styles.NotConnText}>آلة القهوة</Text>
          <MaterialCommunityIcons style={{ right:190, bottom: 17}} name="coffee-outline" size={55} color= {'grey'} />
          </View>

          </ScrollView>

          </ImageBackground>

      </View>
    );
  }

}

supdevicesScreen.navigationOptions = ({navigation})=> ({

  headerTitle:  'الأجهزة المتصلة',

 /* headerRight:()=>(
    <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={{marginRight:15}}>
      <AntDesign name="right" size={24} color="#fff" />
    </TouchableOpacity>
  ),
  */
  headerLeft:navigation.state.params && navigation.state.params.headerLeft,
  headerStyle: {
    backgroundColor: '#8BC4D0',
    color:'white'

 },
 headerTitleStyle: {
  color: '#fff'
},

});

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

  tabBarInfoText: {
    fontSize: 17,
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },

  mapStyle: {
    alignSelf: 'stretch',
    height:'100%'
    //flex:1,
    //margin : 70,
  },
  signupButton: {

    height:40,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom:10,
   width:70,
   borderRadius:45,
   borderColor:'#BBCCCF',
   borderWidth:1,
   backgroundColor: "#3E82A7",
   //paddingBottom:10
  },

  scrollView: {
  },
  signUpText: {
    color: 'white',
    fontSize:15,
  },

  scontainer:{
    fontSize:25,
    backgroundColor:'white',
    color: '#6FA0AF',
    justifyContent: 'center',
    width: 295,
    height: 90,
    left:8,
    marginTop:20,
    borderRadius: 25,
    marginHorizontal: 25,
    paddingLeft: 220,
    paddingRight:10,
    paddingBottom: 15,
    bottom: -40,
    shadowOpacity: 0.1,
    opacity: 0.9,

  },

    colseText:{
      color: '#6FA0AF' ,
      fontWeight: 'bold',
      fontSize:19,
      top:37,
      width:200,
      marginLeft:-20,
    },

      bottomText:{
        color: 'grey' ,
        fontWeight: 'bold',
        fontSize:12,
        paddingTop:8,
        paddingRight:13,
        top:40,
        width:80,
        marginLeft:-20,

      },

      openText:
      {color: '#2cb457' ,
      fontWeight: 'bold',
      fontSize:22,
      top:37,
      //width:80,

      marginLeft:-20,

    },
    NotConnText:{
      color: 'grey' ,
      fontWeight: 'bold',
      fontSize:22,
      top:37,
      marginLeft:-20,
    }
});
