import React, {useState, useEffect,Component} from 'react';
import { ScrollView, StyleSheet,Text,View,TouchableHighlight, Alert,TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import { withNavigation } from 'react-navigation';
import { FontAwesome5 ,AntDesign,Feather,MaterialCommunityIcons,SimpleLineIcons} from "@expo/vector-icons";
import * as firebase from 'firebase';

  export default class locationPage extends Component {

    constructor(props) {
      super(props);
      this.state = {

        visibilty: 'none',
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

      }
  }
  // we have to put 2 1- for registered people  2- for thr unregisted people
  componentDidMount(){
    console.log("inside location page did ");
    console.log("this.props.state.uID"+ this.state.uID);
    if(firebase.auth().currentUser!==null){
      console.log("inside location page has user ");
    firebase
    .auth()
    .onAuthStateChanged((user) => {
    if (user) {
      console.log("find the user ")
    var userId = firebase.auth().currentUser.uid;
    //email= firebase.auth().currentUser.email;
    firebase
    .database()
    .ref('mgnUsers/'+userId)
    .on('value', snapshot => {
      console.log("sirst snap did "+ snapshot)
      this.setState({
        uID : userId,
      latitude :snapshot.val().latitude,
      longitude:snapshot.val().longitude
    });
    console.log(JSON.stringify(snapshot)) });
    }
    }

    )}


     this.getCurrentPosition()

    }//end componentDidMount

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
    sleep=(ms)=>{

      return new Promise(resolve=>setTimeout(resolve,ms));

    }

    getCurrentPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
                 // direct get the lat and lng of user using GPS and set it to the user .. 
            var userId =  this.props.navigation.getParam('id', '');
            var lat= position.coords.latitude;
            console.log("lat: "+lat);
            var long= position.coords.longitude;
            console.log("long: "+long);
          //end update
            // maybe then user want not to update  he/she location ..
        setTimeout(()=>{Alert.alert(
          'هل تريد تحديث موقعك ؟' ,
          '',
          [
            {text:'إلغاء',
            onPress:()=>
              console.log("cancel is pressed"),
              style:'cancel'
            },{text:'نعم',
               // if the user really want to update he/she location then set the lng and lat to him/her in firebase .. 
            onPress:()=>{

              if (this.state.uID!==''){
                console.log("if");
                firebase
                .database()
                .ref('mgnUsers/'+this.state.uID)
                .update({
                  latitude: lat,
                  longitude: long,

               })
               this.props.navigation.state.params.updateData(lat,long);
               console.log("if is done ");
              }
              else{
                console.log("else");
                this.props.navigation.goBack()
                this.props.navigation.state.params.updateData(lat,long);

              }

              console.log("save is pressed")},
              style:'ok'
            }



          ]
          );},5000);
          })

        setTimeout(()=>{this.props.navigation.goBack();},7000);
            }


  //for saving user location
  /*
  const [coordinates, setCoordinates] = useState({
    latitude: 24.76989911,
    longitude: 46.66837581,
  });

  setCoordinates({latitude:4567,longitude:45678})
  useEffect(() => {

    Alert.alert('hello');
  },[]);
    */
    render() {
  return (

    <View style={styles.container}>

    <View style={styles.container}>

    <MapView

      style={styles.mapStyle}
      initialRegion={{
        latitude: 24.7136,
        longitude: 46.6753,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      followsUserLocation={true}
      showsUserLocation={true}
      >


        </MapView>

    </View>


  </View>
  );
}}

locationPage.navigationOptions = ({navigation})=> ({


  headerTint:'#F7FAFF',
  headerTitle: ' الموقع',

  headerRight:()=>(
    <TouchableOpacity onPress={()=>{navigation.navigate('profile')}} style={{marginRight:15}}>
      <AntDesign name="right" size={24} color="#CDCCCE" />
    </TouchableOpacity>

  ),

  headerLeft: null,

  headerStyle: {
    backgroundColor: '#8BC4D0',
    color:'white'

 },
 headerTitleStyle: {
  color: '#fff'
}

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    // height:100,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
    //marginBottom:10,
     marginTop:5,
     //width:70,
     marginLeft:30,
     shadowOpacity: 0.4,
     borderRadius:20,
    },

  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },


  navigationFilename: {
    marginTop: 5,
  },

  mapStyle: {
    alignSelf: 'stretch',
    height:'100%',
    //flex:1,
    marginTop : -25,
  },
  signupButton: {

    height:40,
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom:10,
   width:350,
   borderRadius:45,
   borderColor:'#BBCCCF',
   borderWidth:1,
   backgroundColor: "#3E82A7",
   //paddingBottom:10


  },
  signUpText: {
    color: 'white',
    fontSize:15,
  },

  });




const navigationConnected =withNavigation(locationPage)
export {navigationConnected as locationPage}
