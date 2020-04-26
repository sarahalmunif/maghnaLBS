import React, { Component } from 'react';
const { width, height } = Dimensions.get('window');
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Button, 
  Alert
} from 'react-native';
import { Header, Left, Body, Right, Footer, FooterTab,Icon } from 'native-base';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome5 ,AntDesign,Feather,MaterialCommunityIcons,SimpleLineIcons} from "@expo/vector-icons";
import { withNavigation } from 'react-navigation';
import { Ionicons} from '@expo/vector-icons';
import { render } from 'react-dom';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import axios from 'axios'
import { Audio } from 'expo-av';

const soundObject = new Audio.Sound();

export default class instructionsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
        toggle: false
    };
    super(props)
    this.recording = null
    this.state = {
      isFetching: false,
      isRecording: false,
      transcript: '',
      read : false
    }
    
  }

  async componentDidMount(){

    this.getAudio();
    this.didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      () => this.pause()
    )
    this.didFocusSubscription = this.props.navigation.addListener(
      'didFocus',
      () => this.replay()
    )
      
    const content = await AsyncStorage.getItem('TTSInstruction');
    //This variable I use to play if it true play if false don't 
    this.setState({read:content});
    console.log(this.state.read);
  }

  async replay(){
    await soundObject.replayAsync()
  }

  async pause(){
      await soundObject.pauseAsync()
  }

  //Get for getting url 
  async getAudio () {  
    // Read report
           
    let fileURL = '';    
    const text = '  لِتَحْرِيْرْ اَلْأَنْمَاطْ، يَجِبْ عَلَيْكْ:  ،   قَوْلْ،  تَحْرِيْرْ اَلْأَنْمَاطْ اَلْحَيَاتِيَّة ،     ثُمَّ اخْتِيَارْ نَوْعْ النَّمَطْ،   وَمِنْ ثُمَّ تَحْدِيْدْ الأَجْهِزَهْ ،إِذَا كَانَ النَّمَطْ صَبَاحِيْ أَوْ مَسَائِيْ ، يَجِبْ عَلَيْكَ تَحْدِيْدْ الوَقْتْ ،       إِذَا كَانَ خُرُوْجْ أَوْ عَوْدَهْ،  يَجِبْ عَلَيْكَ حِفْظْ مَوْقِعْ المَنْزِلْ  ،   لِعَرْضْ التَّقْرِيْرْ يَجِبْ عَلَيْكْ:      ،  قَوْلْ ، التَّقْرِيْرْ" ،  يُمْكِنُكَ أَيْضًا عَرْضُهَا عَنْ طَرِيْقْ النَّقْرْ عَلَى خَانَةِ، التَّقَارِيْرْ" ،  لِعَرْضْ  الأَجْهِزَهْ الْمُتَّصِلَه، يَجِبْ عَلَيْكْ:،     قَوْلْ ، الأَجْهِزَهْ الْمُتَّصِلَهْ"  ،     يُمْكِنُكَ أَيْضًا عَرْضُهَا عَنْ طَرِيْقْ النَّقْرْ عَلَى خَانَةِ ، الأَجْهِزَهْ الْمُتَّصِلَهْ'
          
    
    axios.post(`http://45.32.251.50`,  {text} )
    .then(res => {
      console.log("----------------------xxxx----instructions----------------"+res.data);
      // alert(res.data)
      fileURL = res.data;
          console.log(fileURL);
          this.playAudio(fileURL);

    })
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
  
        try {
          await soundObject.loadAsync({uri: fileURL});
          await soundObject.playAsync();
           // Your sound is playing!
        } catch (error) {
        // An error occurred!
        }

    }

    async componentWillUnMount(){
      this._unsubscribe();
      this.didBlurSubscription.remove()
      this.didFocusSubscription.remove()
      await soundObject.stopAsync();
 
    }

    static navigationOptions = ({navigation})=> ({

      headerTint:'#F7FAFF',
      headerTitle: 'التعليمات ',
      headerRight:()=>(
        <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={{marginRight:15}}>
          <AntDesign name="right" size={24} color="#fff" />
        </TouchableOpacity>
    
      ),
      headerLeft:()=>(
        <TouchableOpacity onPress={()=>{navigation.navigate('')}} style={{marginLeft:15}}>
          <SimpleLineIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#8BC4D0',
        color:'white'
        
     },
     headerTitleStyle: {
      color: '#fff'
    }
    })
    
    render() {

        const {
            isRecording, transcript, isFetching,read

          } = this.state

        if(read == true)
        this.getAudio();
        
        return (
   
          <View style={styles.container}>
      
            <ImageBackground source={require('../assets/images/infobackground.png')} style={styles.bg_container}>


              <View >
                <View style={styles.articleView2}>
                  <Text style={styles.articleTitle}>تحرير الأنماط</Text>
                  <Text style={styles.articleDescription}>
                    لتحرير الأنماط يجب عليك:
                    قول "تحرير الأنماط الحياتية"
                    ثم اختيار نوع النمط
                    ومن ثم تحديد الاجهزه
                </Text>
                  <Text style={styles.articleFoot}>
                    اذا كان النمط صباحي / مسائي يجب عليك تحديد الوقت
                    اذا كان خروج/عودة يجب عليك حفظ موقع المنزل
                </Text>
                </View>
                <View style={styles.articleView}>
                  <Text style={styles.articleTitle}>عرض التقارير </Text>
                  <Text style={styles.articleDescription}>
                    لعرض الاجهزه المتصله يجب عليك:
                    قول "التقرير"
                    يمكنك ايضاً عرضها عن طريق النقر على خانه "التقارير"
                </Text>
                </View>
                <View style={styles.articleView}>
                  <Text style={styles.articleTitle}>عرض الاجهزه المتصله </Text>
                  <Text style={styles.articleDescription}>
                    لعرض  الاجهزه المتصله يجب عليك:
                    قول "الاجهزه المتصله"
                    يمكنك ايضاً عرضها عن طريق النقر على خانه " الاجهزه المتصله "
                </Text>
                </View>
              </View>
          

          </ImageBackground>

            <View style={styles.container}>
              <TouchableOpacity
                style={styles.button}
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
                
          </View>

        );
    }
    
}


const styles = StyleSheet.create({
  container: {
    marginTop:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
  },
  contentContainer: {
  },

  header: {
    height: 50,
    ...ifIphoneX({
      marginTop: 50
    }, {
      marginTop: 24
    }),
    justifyContent: 'center',
  },
  headerItem: {
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 75,
  },
  bg_container: {
   height:"100%",
    justifyContent: 'center',
    alignItems: 'center'
  },

  view: {
    width: width,
    height: height*0.1,
  },
  articleView: {
    shadowOpacity: 0.07,
    width: 0.9 * width,
    height:0.2*height,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    opacity: 0.9,
    marginTop: 20,
    borderRadius: 30,
    padding: 16,
  },
  articleView2: {
    shadowOpacity: 0.07,
    width: 0.9 * width,
    height:0.25*height,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    opacity: 0.9,
    marginTop: 20,
    borderRadius: 30,
    padding: 16,
  },
  articleTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2287ac',
  },
  articleDescription: {
    marginTop:20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#8abbc6',
  },
  articleFoot: {
    fontSize: 14,
    textAlign: 'right',
    color: '#8abbc6',
  },
  icon: {
    width: 30,
    height: 30,
  },

  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 20,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
    marginTop: 20,
  },
  text: {
    color: '#fff',
  }
  });
  
