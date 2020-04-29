
import * as WebBrowser from 'expo-web-browser';
const {width, height} = Dimensions.get('window');
import React, {Component} from 'react';
import {Modal,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Alert,
  TouchableOpacity
} from 'react-native';
import {Input, Button} from 'native-base';
import {LinearGradient} from 'expo-linear-gradient';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      email: 'swereem@gmail.com' ,
      password: '123456',
      errorMessage: null,
      visibilty: 'none',
      emailBorders:'#7db4cb',
      passBorders:'#7db4cb',
      info:"",
  saveModal:false,

    }
}



  UNSAFE_componentWillMount(){

    const firebaseConfig = {


      apiKey: "AIzaSyCsKoPxvbEp7rAol5m-v3nvgF9t8gUDdNc",
    authDomain: "maghnatest.firebaseapp.com",
    databaseURL: "https://maghnatest.firebaseio.com",
    projectId: "maghnatest",
    storageBucket: "maghnatest.appspot.com",
    messagingSenderId: "769071221745",
    appId: "1:769071221745:web:1f0708d203330948655250",
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
  /*
  firebase
  .auth()
  .onAuthStateChanged(user=>{

    if(!user){
      this.email.clear();
      this.password.clear();
    }
  }
  );*/
/*
  this.setState({
    password: '',
    email:''})
*/

  }
  componentDidMount(){
    /*
    this.state.email='',
    this.state.password=''
    */
  }


  validateEmail = (email) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(this.state.email)== false)
    {
    this.setState({emailBorders:'red'})
      }
    else {
      this.setState({emailBorders:'#91b804'})
    }
  }//end validate

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
  handleLogin = () => {
      // first check the email and password are not empty .. 
    if (this.state.email == '') {
      this.setState({emailBorders: 'red'})
      return;
    }
    if ( this.state.password=='') {
      this.setState({passBorders: 'red'})
      return;
    }
    const {email, password} = this.state

    // authnticate the user using firebase by pass the password and email to it .. 
    firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userData) => {
      firebase
      .auth()
      .onAuthStateChanged( user => {
        if (user) {
          this.userId = user.uid;
          var username= this.username;
         // if the email is not active . 
          if (!user.emailVerified){
            this.setState({
              info:"فضلاً تفقد بريدك الإلكتروني لتفعيل حسابك",
          })
          this.showSaveModal();
          }
          // if the user information found in firebase then he/she can access the home screen .. 
          else{
            firebase.database().ref('mgnUsers/'+user.uid).on('value',
            async(snapshot)  => {
              this.email.clear();
              this.password.clear();
          
              if (snapshot.exists()){
                try {
                   await AsyncStorage.setItem("loggedIn", "friday");
                    this.props.navigation.navigate('HomeStack',{UID:user.uid})
                      } catch (error) {
                       
                            } // user full info are retrieved
              }  
          })
        }
  }
});
}).catch((error) => {
  console.log(error.message)
  this.setState({visibilty: 'flex'})
})
}

//this.props.navigation.navigate('HomeStack', {name: username })}


    /*
      async redirectRoute(route) {
        const { navigation }  = this.props;
        navigation.navigate(route);
      }*/

  render() {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>
            <LinearGradient colors={['#1784ab', '#9dd1d9']} style={{flex: 1}}>
                <View style={styles.view}>
                <View style={styles.form}>
                    <Image source={require('../assets/images/logo.png')} style={styles.logo} />

                    <View >
                    <Text style={[styles.fontStyle,styles.warning, {display: this.state.visibilty}]}> البريد الإلكتروني أو كلمة المرور غير صحيحة </Text>
                    </View>

                    <TextInput style={[styles.input,{borderColor:this.state.emailBorders}]}
                    ref={input=>this.email=input}
                    placeholder=" البريد الالكتروني"
                    value={this.state.email}
                    onChangeText={(text) => {
                      this.setState({email: text})
                      this.setState({visibilty: 'none'})
                      this.setState({emailBorders: '#7db4cb'})
                      this.setState({passBorders: '#7db4cb'})}}
                    keyboardType="email-address"
                    autoCapitalize="none"/>

                    <TextInput style={[styles.input,{borderColor:this.state.passBorders}]}
                     ref={input=>this.password=input}
                    placeholder="كلمه المرور "
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text) => {
                      this.setState({password: text})
                      this.setState({visibilty: 'none'})
                      this.setState({emailBorders: '#7db4cb'})
                      this.setState({passBorders: '#7db4cb'})}}/>


                    <Button style={styles.button} onPress={this.handleLogin}  /*onPress={() => this.props.navigation.navigate('HomeStack', {name: 'Jane'})}*/>
                        <LinearGradient
                            colors={['#1784ab', '#9dd1d9']} style={styles.gradient}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.buttonText} >تسجيل الدخول</Text>
                        </LinearGradient>
                    </Button>
                    <TouchableOpacity onPress={ () => {this.props.navigation.navigate('forgetPassword')}}>
                    <Text style={styles.note} >هل نسيت كلمه المرور؟</Text>
                    </TouchableOpacity>
                </View>
                <View>
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
                </View>
            </LinearGradient>
        </ScrollView>
      );
}
 }

//

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
      backgroundColor: '#fff',
     shadowOpacity: 0.1
    },
    scrollView: {
      backgroundColor: '#2d8cb1',
      width: width,
      height: height,
    },
    view: {
      width: width,
      height: height,
      justifyContent: 'center',
    },
    form: {
      backgroundColor: 'white',
      alignSelf: 'center',
      borderRadius: 40,
      ...ifIphoneX({
        width: 0.9 * width,
        height: 0.7 * height,
      }, {
        width: 0.8 * width,
        height: 0.75 * height,
      }),
    },
    logo: {
      alignSelf: 'center',
      width: 300,
      height: 0.29* height,
      marginTop: 30,
      marginBottom: 40,
    },
    input: {
      alignSelf: 'center',
      overflow:'visible',
      //marginTop:20,
      shadowOpacity: 0.1,
      borderColor: '#7db4cb',
      textAlign: 'center',
      borderWidth: 1,
      height: 46,
      width: 250,
      ...ifIphoneX({
        margin: 0.01 * height,
        borderRadius: 20,
      }, {
        margin: 0.02 * height,
        borderRadius: 0.05 * height,
      }),
    },
    button: {
      margin: 0.025 * height,
      borderRadius: 0.05 * height,
      backgroundColor: 'white',
      borderWidth: 0,
      width: 250,
      height: 46,
      alignSelf: 'center',
    },
    gradient: {
      flex: 1,
      borderRadius: 23,
      height: 46,
      justifyContent: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 20,
      textAlign: 'center',
    },
    note: {
      marginBottom: 30,
      color: '#4398b9',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    warning:{
      color: 'red',
      fontSize:10,
      textAlign:'center',
      marginBottom:10,
    },
  });

