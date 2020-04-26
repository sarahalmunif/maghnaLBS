
import * as WebBrowser from 'expo-web-browser';
const {width, height} = Dimensions.get('window');
import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import {Input, Button} from 'native-base';
import {LinearGradient} from 'expo-linear-gradient';
import { ifIphoneX } from 'react-native-iphone-x-helper';
//import {LinearGradient} from 'expo-linear-gradient';


export default class WelcomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <Image 
                    style={{ width: 230, height: 190, bottom: 110 , marginTop:150 }}
                    source={require('../assets/images/white.png')} />
                <Text style={{ fontSize:25, color: '#ffffff', bottom: 93 }}>مرحبًا بك</Text>
    
                <View >
                    <Button title= "إنشاء حساب" color= 'white' style={styles.button}  onPress={() => this.props.navigation.navigate('SignUp')}  > 
                    <Text style={styles.TextInput}>
                   إنشاء حساب 
                    </Text>
                    </Button>
                </View>
    
                <View >
                    <Button title= "تسجيل دخول" color= '#6FA0AF' style={styles.button2} onPress={() => this.props.navigation.navigate('SignIn')} >
                    <Text style={styles.TextInput2}>
                      تسجيل الدخول 
                    </Text>
                    </Button>
                </View>
        </View>
        )
    }
  }





const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6FA0AF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button:
    { marginTop:60,
     
      alignItems: 'center',
    justifyContent: 'center',
     backgroundColor: '#6FA0AF',
     width: 260, 
     margin:10,
     borderRadius: 25, 
    marginHorizontal: 25, 
     paddingLeft: 2, 
    // top: 70,
     borderWidth: 4, 
     borderColor: '#fff'},
     TextInput:{
      color: 'white',
      fontSize:20,
     },
     button2:
     { 
       alignItems: 'center',
     justifyContent: 'center',
       backgroundColor: 'white',
      width: 260, 
      margin:10,
      borderRadius: 25, 
      marginHorizontal: 25, 
      paddingLeft: 2, 
      //top: 70,
      borderWidth: 4, 
      borderColor: '#fff'},
      TextInput:{
       color: 'white',
       fontSize:20,
      },

     TextInput2:{
      color: '#6FA0AF',
      fontSize:20,
     }, 
     gradient: {
      flex: 1,
      borderRadius: 32,
      height: 46,
      justifyContent: 'center',
    },


     
  });





