import React ,{ Component } from 'react';
import { ScrollView,Modal,
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

export default class SignUP extends Component{

  state = {
  name:"",
  email: "",
  password: "",
  confPassword: "",
  latitude:0,
  longitude:0,
  amount:0,
  isActive:true,
  info:"",
  saveModal:false,

  passwordBorder:'#3E82A7',
  conPasswordBorder:'#3E82A7',
  emailBorder:'#3E82A7',
  nameBorder: '#3E82A7',
  formErrorMsg:'',
  errorMsgVisibilty:'none',
  passError:'none',
  errorMsg:null,
};

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
validateEmail = (email) => {

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if(reg.test(this.state.email)== false)
  {
  this.setState({emailBorder:'red'})
    }
  else {
    this.setState({emailBorder:'#91b804'})
  }
}

/*validateName = (name) => {

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  if(reg.test(this.state.name)== true)
  {
  this.setState({nameBorder:'red'})
  this.setState({formErrorMsg: 'اسم المستخدم يحتوي على غير مقبولة'})
  this.setState({errorMsgVisibilty: 'flex'})
    }
  else {
    this.setState({nameBorder:'#3E82A7'})
  }
}*/


validateUser = (name) => {
  let  format =/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if(this.state.name != "")
  {
    if (this.state.name.length < 20) {
      if(format.test(this.state.name)){

        this.setState({nameBorder:'red'})
        this.setState({formErrorMsg: 'اسم المستخدم يحتوي على خانات غير مقبولة'})
        this.setState({errorMsgVisibilty: 'flex'})
      }else{
        this.setState({nameBorder:'#3E82A7'})
        this.setState({errorMsgVisibilty: 'none'})
      }
    }else{
      this.setState({formErrorMsg: ' يجب أن يكون اسم المستخدم أقل من ٢٠ خانة'})
      this.setState({errorMsgVisibilty: 'flex'})
      this.setState({nameBorder:'red'})
    }

  }  else {
    if(/\d/.test(myString))
    this.setState({formErrorMsg: 'اسم المستخدم يحتوي على ارقام  '})
    this.setState({nameBorder:'#3E82A7'})
    this.setState({errorMsgVisibilty: 'none'})
  }
  
/*
  /////////////
  if(this.state.name != "")
  {
    if (this.state.name.length > 20) {
      this.setState({formErrorMsg: ' يجب أن يكون اسم المستخدم أقل من ٢٠ خانة'})
      this.setState({errorMsgVisibilty: 'flex'})
     // this.setState({nameBorder:'red'})
    }
      else{
        this.setState({errorMsgVisibilty: 'none'})
  if(format.test(this.state.name)==false)
  {
  this.setState({nameBorder:'red'})
  this.setState({formErrorMsg: 'اسم المستخدم يحتوي على خانات غير مقبولة'})
  this.setState({errorMsgVisibilty: 'flex'})
    }
  else {
    this.setState({nameBorder:'#3E82A7'})
    this.setState({errorMsgVisibilty: 'none'})
  }}
  this.setState({nameBorder:'red'})

    }
  else {
    this.setState({nameBorder:'#3E82A7'})
    this.setState({errorMsgVisibilty: 'none'})
  }
  */

}//end validate phone number

identicalPass = (password) => {
  if (this.state.password !== this.state.confPassword){
    console.log("identical if ");
    this.setState({passError: 'flex'})
    this.setState({errorMsgVisibilty: 'flex'})
   this.setState({passwordBorder:'red'})
   this.setState({conPasswordBorder:'red'})
  }
  else {
    console.log("identical else ");
    this.setState({passError: 'none'})
  // this.setState({errorMsgVisibilty: 'none'})
   this.setState({passwordBorder:'#3E82A7'})
   this.setState({conPasswordBorder:'#3E82A7'})
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
handelSignUp =() =>{

  if (this.state.name == '' || this.state.email == ''||this.state.password == ''||this.state.confPassword=='') {
    this.setState({formErrorMsg: ' يرجى تعبأة جميع الحقول '})
    this.setState({errorMsgVisibilty: 'flex'})
    return;
  }


  if (this.state.password.length < 8) {
    this.setState({formErrorMsg: ' يجب أن تكون كلمة المرور أكثر من ٧ خانات'})
    this.setState({errorMsgVisibilty: 'flex'})
    this.setState({passwordBorder:'red'})

    return;
  }

  if (this.state.password.length > 20) {
    this.setState({formErrorMsg: ' يجب أن تكون كلمة المرور أقل من ٢٠ خانة'})
    this.setState({errorMsgVisibilty: 'flex'})
    this.setState({passwordBorder:'red'})

    return;
  }

  if (this.state.name.length > 20) {
    this.setState({formErrorMsg: ' يجب أن يكون اسم المستخدم أقل من ٢٠ خانة'})
    this.setState({errorMsgVisibilty: 'flex'})
    this.setState({nameBorder:'red'})

    return;
  }

  /*
  if (this.state.password!=this.state.confpassword){

    this.setState({formErrorMsg: ' يجب أن تكون كلمة المرور متطابقة'})
    this.setState({errorMsgVisibilty: 'flex'})
    this.setState({passwordBorder:'red'})
    return;

  }*/

   // if the user has any error in register steps .. 
  if (this.state.emailBorder == 'red'||this.state.passwordBorder == 'red'||this.state.conPasswordBorder=='red'){
    this.setState({formErrorMsg: 'فضًلا، قم بتصحيح  الأخطاء الحمراء'})
    this.setState({errorMsgVisibilty: 'flex'})
    return;
  }
  if (this.state.passError != 'none')  {
    return;
}

// if the user fills all required fields correctly .. 
    try{
  firebase .auth() .createUserWithEmailAndPassword(this.state.email, this.state.password)
  .then((data) => {

    firebase .auth() .onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid
        user.sendEmailVerification();
        firebase.database().ref('mgnUsers/'+user.uid).set(
          {
            name: this.state.name,
            latitude:this.state.latitude,
            longitude:this.state.longitude,
            amount:this.state.amount,
            isActive:this.state.isActive,
          })

         this.props.navigation.navigate('SignIn')
      }
    });
    this.name.clear();
    this.password.clear();
    this.email.clear();
    this.confPassword.clear();
    // display a successfull message for user 
    this.setState({
      info:"تم التسجيل بنجاح، تفقد بريدك الإلكتروني لغرض تفعيل الحساب",
  })
  this.showSaveModal();
    })
     // if the email was register before 
  .catch((error) => {
    // display an error message 
    this.setState({
      info:"نعتذر ، البريد الإلكتروني مسجل مسبقاٌ",
  })
  this.showSaveModal();
    this.setState({formErrorMsg: 'نعتذر، البريد الإلكتروني مسجل مسبقًا'})

  })

    }catch(e){console.log(e.message)}

};

  updateData = (long,lat) => {
  //(data);
    this.setState({
      longitude:long,
      latitude:lat,

    })
  console.log("udate: " + long +" "+lat);
    // some other stuff
  };

  render(){
  return (

<View>

<View style={styles.container}>

<View style={{backgroundColor :"#3E82A7", height:"19%",width:"100%", justifyContent: 'center',
   alignItems: 'center'}}>

   <Text style={styles.header}> التسجيل </Text>

   </View>

<ImageBackground source={require('../assets/images/halfBlue.png') } style={{ height:"100%",justifyContent: 'center',alignItems: 'center'}}>

<Text style={styles.perInfo}>──  المعلومات الشخصية  ──</Text>

<View style={styles.smallContainer}>



<View >
<Text style={[styles.warning, {display: this.state.errorMsgVisibilty}]}> {this.state.formErrorMsg} </Text>
</View>
<View >

<Text style={[styles.warning,styles.fontStyle, {display: this.state.passError}]}> يجب أن تكون كلمة المرور متطابقة </Text>
</View>

<View style={styles.firstContainer}>
<View style={[styles.inputContainer, {borderColor: this.state.nameBorder}]} >

<TextInput   style={[styles.input,{borderColor:this.state.nameBorder}]}
ref={input=>this.name=input}
placeholder="أسم المستخدم"
keyboardType="default"
underlineColorAndroid='transparent'
onChangeText={(text) => { this.setState({name: text})
this.setState({visibilty: 'none'})
this.setState({nameBorder: 'red'})
this.setState({passBorders: '#7db4cb'})}
}
onEndEditing={(name) => this.validateUser(name)}
value={this.state.name}
autoCapitalize="none"
/>
</View>
</View>
<View style={[styles.inputContainer , {borderColor: this.state.emailBorder}]}>

<TextInput
  style={[styles.input,{borderColor:this.state.emailBorders}]}
  ref={input=>this.email=input}
  placeholder=" البريد الإلكتروني"
  onChangeText={(text) => {
    this.setState({email: text})
    this.setState({visibilty: 'none'})
    this.setState({emailBorders: '#7db4cb'})
    this.setState({passBorders: '#7db4cb'})}}
    onEndEditing={(email) => this.validateEmail(email)}
    value={this.state.email}
  keyboardType="email-address"
  autoCapitalize="none"

/>
</View>


<View style={[styles.inputContainer, {borderColor: this.state.passwordBorder}]}>

<TextInput   style={[styles.input,{borderColor:this.state.emailBorders}]}
ref={input=>this.password=input}
  placeholder="كلمة المرور"
  secureTextEntry={true}
  underlineColorAndroid='transparent'
  onChangeText={(text) => {
    this.setState({password: text})
    this.setState({passwordBorder: '#3E82A7'})
  }}
  //onEndEditing={(password) =>{this.identicalPass(password)} }
  value={this.state.password}
  />
</View>

<View style={[styles.inputContainer,{borderColor: this.state.conPasswordBorder}]}>
<TextInput   style={[styles.input,{borderColor:this.state.emailBorders}]}
ref={input=>this.confPassword=input}
placeholder="تأكيد كلمة المرور"
secureTextEntry={true}
underlineColorAndroid='transparent'
onChangeText={(text) => {
  this.setState({confPassword: text})
  this.setState({conPasswordBorder: '#3E82A7'})
  this.setState({errorMsgVisibilty: 'none'})
  }}
  onEndEditing={(confPassword) =>{this.identicalPass(confPassword)} }
  //value={this.state.confPassword}
/>
</View>




<TouchableHighlight style={[styles.LocationButtonContainer, styles.AddlocationButton]} onPress={()=>{this.props.navigation.navigate('locationPage', {updateData: this.updateData})}} >
        <Text style={styles.addLocationText}> إضافة موقع</Text>
        </TouchableHighlight>


       <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={this.handelSignUp} >
       <LinearGradient
                            colors={['#1784ab', '#9dd1d9']} style={styles.gradient}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                        >
     <Text style={styles.signUpText}>  تسجيل جديد </Text>
     </LinearGradient>
   </TouchableHighlight>


  </View>

</ImageBackground>

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

);
}
}
SignUP.navigationOptions = ({navigation})=> ({

  headerTint:'#F7FAFF',
  headerTitle: 'التسجيل ',
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
      height:430,
      shadowOpacity: 0.1


  },

  perInfo:{
    color: '#9F9F9F',
    fontSize: 20,
    bottom: 30,
    marginTop: -170,
    marginBottom:20,
  },

  inputs:{
    alignSelf: 'center',
    textAlign: 'center',
    overflow:'visible',
      height:40,
      borderColor: '#EAEAEA',

  },

  input: {
    alignSelf: 'center',
    overflow:'visible',
    marginTop:-5,
    textAlign: 'center',
    height: 46,
    width: 250,
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

  warning:{
    color: 'red',
    fontSize:12,
    marginBottom:10,
    textAlign:'center'
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

const navigationConnected =withNavigation(SignUP)
export {navigationConnected as SignUP}

