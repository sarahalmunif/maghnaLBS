const { width, height } = Dimensions.get('window');
import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Header, Left, Body, Right, Footer, FooterTab, Button, Icon } from 'native-base';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import {LinearGradient} from 'expo-linear-gradient';

export default class InfoScreen extends Component {

  constructor(props) {
    super(props)
    this.recording = null
    this.state = {
      isFetching: false,
      isRecording: false,
      transcript: '',
    }
  }


  async  wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }


  
  
  async componentDidMount(){
    
      while(true){
      await this.startRecording()
      await this.wait(3000);
       await this.stopRecording();
       await this.getTranscription();
       await this.resetRecording();
    }
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
        name: Platform.OS === 'ios' ? `${Date.now()}.wav` :`${Date.now()}.m4a`,
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
    if(    transcript == "تشغيل النور" ){


  axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
  {'on':true} )
.then(res => res.json())
.then(res => {
  console.log(res)
}) 
.catch(error => {console.log(error);
})
    }

    if(    transcript == "اطفاء النور" ){


      axios.put('http://192.168.100.14/api/1DQ8S2CiZCGaI5WT7A33pyrL19Y47F2PmGiXnv20/lights/3/state',
      {'on':false} )
    .then(res => res.json())
    .then(res => {
      console.log(res)
    }) 
    .catch(error => {console.log(error);
    })
        }

        if(    transcript == "التعليمات" ){
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


    static navigationOptions = ({navigation})=> ({

        headerTint:'#F7FAFF',
        headerTitle: 'الصفحة الرئيسية',
        headerRight:()=>(
          <TouchableOpacity onPress={()=>{navigation.navigate('instructions')}} style={{marginRight:15}}>
            <MaterialCommunityIcons name="settings-outline" size={24} color="#fff" />
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
        }
        
    }


  async redirectRoute(route) {
    const { navigation }  = this.props;
    navigation.navigate(route);
  }
  
  render() {
    return (
      <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <LinearGradient colors={['#1784ab', '#9dd1d9']} style={{flex: 1}}>
          <Header transparent style={styles.header}>
            <Left transparent style={styles.headerItem}>
              <Button transparent>
                <Image source={require('../assets/images/signOut.jpg')} style={styles.icon}></Image>
              </Button>
            </Left>
            <Body>
              <Text style={styles.headerText}>التعليمات </Text>
            </Body>
            <Right>
              <Button transparent>
                <Image source={require('../assets/images/backArrow.jpg')} style={styles.icon}></Image>
              </Button>
            </Right>
          </Header>
        </LinearGradient>
        <ImageBackground source={require('../assets/images/logo1.jpg')} style={styles.bg_container}>
          <View style={styles.view}>
            <View style={styles.articleView}>
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
        <LinearGradient colors={['#1784ab', '#9dd1d9']} style={{flex: 1}}>
          <Footer style={{backgroundColor: 'transport'}}>
            <FooterTab style={{backgroundColor: 'transport'}}>
              <Button>
                <Image source={require('../assets/images/personIcon.jpg')} style={styles.icon}></Image>
              </Button>
              <Button onPress={() => this.redirectRoute('Login')}>
                <Image source={require('../assets/images/backIcon.jpg')} style={styles.icon}></Image>
              </Button>
              <Button>
              </Button>
              <Button>
                <Image source={require('../assets/images/itemIcon.jpg')} style={styles.icon}></Image>
              </Button>
              <Button>
                <Image source={require('../assets/images/docIcon.jpg')} style={styles.icon}></Image>
              </Button>
            </FooterTab>
          </Footer>
        </LinearGradient>
      </ScrollView>
      </>
    );
  }
}
const styles = StyleSheet.create({
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
    width: width,
    ...ifIphoneX({
      height: height - 156 
    }, {
      height: height - 129
    }),
  },
  view: {
    width: width,
    height: height,
  },
  articleView: {
    width: 0.8 * width,
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
  }
});

