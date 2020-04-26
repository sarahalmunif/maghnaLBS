import React ,{ Component } from 'react';
import { ScrollView,
 StyleSheet,
 Text,
 View,
 TextInput,
 Button,
 TouchableHighlight,
 Image,
 Alert,
 ImageBackground,
 TouchableOpacity,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import WelcomeScreen from './WelcomeScreen';
import locationPage from './locationPage';
import {LinearGradient} from 'expo-linear-gradient';
import * as firebase from 'firebase';

export default class forgetPassword extends Component{

constructor(props) {
    super(props);
    this.state = {
        email: "",
        errorMsg:null,
    };


}

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

handelForgetPassword = () => {
    const { navigation } = this.props;

    firebase
    .auth()
    .sendPasswordResetEmail(this.state.email)
    .then(function() {
    try {
    navigation.navigate('SignIn')}
    catch (e){console.log(e.message)}
    Alert.alert("فضلًا تفقد بريدك الإلكتروني");


    })
    .catch((error) => {

      if (error.message == 'There is no user record corresponding to this identifier. The user may have been deleted.')
      {
        this.setState({errorMsg: 'لا يوجد مستخدم بهذا البريد الإلكتروني'})
        this.setState({visibilty: 'flex'})
      }
      else if(error.message == 'The email address is badly formatted.'){
        this.setState({errorMsg: 'فضلًا، قم بإدخال بريد إلكتروني صحيح'})
        this.setState({visibilty: 'flex'})
      }


      });


}

render(){
    return (

  <View>

  <View style={styles.container}>

  <View style={{backgroundColor :"#3E82A7", height:"19%",width:"100%", justifyContent: 'center',
     alignItems: 'center'}}>

     <Text style={styles.header}> استرجاع كلمة المرور </Text>

     </View>

  <ImageBackground source={require('../assets/images/halfBlue.png') } style={{ height:"100%",justifyContent: 'center',alignItems: 'center'}}>

  <Text style={styles.perInfo}>──  فضلاً أدخل بريدك الإلكتروني ──</Text>

  <View style={styles.smallContainer}>



  <View style={styles.inputContainer}>

  <TextInput style={styles.inputs}
  placeholder="البريد الإلكتروني"
  keyboardType="email-address"
  underlineColorAndroid='transparent'
  onChangeText={(text) => { this.setState({email: text}) }}
  />
  </View>


         <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={this.handelForgetPassword} >
         <LinearGradient
                              colors={['#1784ab', '#9dd1d9']} style={styles.gradient}
                              start={{ x: 0, y: 1 }}
                              end={{ x: 1, y: 1 }}
                          >
       <Text style={styles.signUpText}>  إرسال  </Text>
       </LinearGradient>
     </TouchableHighlight>


    </View>
  </ImageBackground>
    </View>

    </View>

  );
  }
}
forgetPassword.navigationOptions = ({navigation})=> ({

  headerTint:'#F7FAFF',
 // headerTitle: 'التسجيل ',
  headerRight:()=>(
    <TouchableOpacity onPress={()=>{navigation.navigate('WelcomeScreen')}} style={{marginRight:15}}>
      <AntDesign name="right" size={24} color="#CDCCCE" />
    </TouchableOpacity>

  ),

  headerStyle: {
    backgroundColor: '#4b9cb5',
    color:'white'

 },
 headerTitleStyle: {
  color: '#fff'
}
}
);

const styles = StyleSheet.create({


  header:{
    marginTop:130,
    color: 'white',
    fontSize:25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },

  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
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

  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderWidth: 1,
    width:250,
    height:35,
    marginBottom:19,
    bottom: 20,
    borderColor: '#3E82A7',
    shadowOpacity: 0.1,

  },

  smallContainer:{
    margin:70,
   marginTop:5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius:30,
      width:300,
      height:200,
      shadowOpacity: 0.1


  },

  perInfo:{
    color: '#9F9F9F',
    fontSize: 20,
    bottom: 30,
    marginTop: -300,
    marginBottom:20,
  },

  inputs:{
    overflow:'visible',
      //flex:1,
      height:40,
      alignSelf:'flex-end',
      borderColor: '#EAEAEA',
      marginRight:20,
     //marginLeft:-50,

  },
  firstContainer:{
  marginTop:40,
  },

  buttonContainer: {
   height:45,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom:10,
   width:250,
   borderRadius:30,
   shadowOpacity: 0.17

  },
  gradient: {
   // flex: 1,
   // borderRadius: 32,
   // height: 46,
    //justifyContent: 'center',
    marginTop:20,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    width:255,
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
   //backgroundColor: "#3E82A7",

  },

  LocationButtonContainer:{

    // height:45,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop:10,
   // marginBottom:20,
    width:'85%',
    borderRadius:45,
    borderColor:'#6FA0AF',
    borderWidth:1,
    shadowOpacity: 0.14,
    height:35,

   },

   AddlocationButton: {
    backgroundColor: "#ffffff",
    marginTop:-10,
    marginBottom:15,

  },

  addLocationText:{
    color: '#6FA0AF',
    fontSize:15,
  },

  signUpText: {
    color: 'white',
    fontSize:15,
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

});

const navigationConnected =withNavigation(forgetPassword)
export {navigationConnected as forgetPassword}
