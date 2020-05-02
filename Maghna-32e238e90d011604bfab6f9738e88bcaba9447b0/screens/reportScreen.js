import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet, Text, View, Image, Button, backgroundColor, Alert, border, WIDTH, TouchableHighlight,
    TouchableOpacity, ScrollView, ImageBackground, AsyncStorage, ActivityIndicator
} from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign, Feather, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { MonoText } from '../components/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { StackActions } from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';
import ProgressCircle from 'react-native-progress-circle';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import axios from 'axios'
import { Audio } from 'expo-av';
import NavigationService from '../navigation/NavigationService';
import { connect } from 'react-redux';
import firebase from 'firebase';
const soundObject = new Audio.Sound();
class reportScreen extends Component {

    //here only conditional rendering for lamb if amount = 0 and if not 

    constructor(props) {

        super(props);
        console.log(props + "Hi props");
        this.state = {
            show_shape: true,
            //This value should be changed in calcuate consumption but it didn't
            // The initial value is not being change when calling getAudio  dont worry please check
            // Check what ? 
            profile_percent: 0,
            profile_color: '#ff3126',
            curTime: 0,
            // this screen I retrieve the value  
            amount: 0,
            show_click: true,
            read: false,

        }

    }

    async componentDidMount() {
        // making sure that the speeches are not interleaved




        var userId = firebase.auth().currentUser.uid;
        //this.state.uID=userId;
        this.setState({ uID: userId })
        console.log("user id " + userId)
        //console.log("user id "+uID)

        var email = firebase.auth().currentUser.email;

        let amountValue = 0;
        console.log("user email" + email)
 



        var that = this;
        var firebaseRef = firebase.database().ref('mgnUsers/' + userId);
        firebaseRef.once('value')
            .then(function (snap) {
                console.log();

                that.setState({
                    amount: snap.val().amount
                });
                console.log(that.state.amount);
                that._calcuateConsumptionAndReport();

            });

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            () => soundObject.unloadAsync()
        )
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            async () => {

                this._calcuateConsumptionAndReport();
                console.log(this.state.profile_percent + "Hi component did mount");
            }
        )

    }

    async  wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async replay() {
        await soundObject.replayAsync()
    }

    async pause() {
        await soundObject.pauseAsync()
    }
    getAudio() {
        // Read report from calculate total consumption so if there is no consumption no reading check it

        console.log(this.state.profile_percent + "Hi getAudio");
        let fileURL = '';
        const text = '  عزيزي المُسْتَخْدِم إجْمَالِي إسْتِهْلاكِكْ هُوَ ' + this.state.profile_percent +
            'بِالمِئَة مِن مُجْمَلِ فَاتُورَتِكَ المُدخَلهْ وَتَفْصِيْلْ الْإسْتِهْلاكْ هُوَ  الإنَارَه 100 بِالمِئَة       ';


        axios.post(`http://45.32.251.50`, { text })
            .then(res => {
                console.log("----------------------xxxx--------------------------" + res.data);
                fileURL = res.data;
                // console.log(fileURL);
                this.playAudio(fileURL);

            })
    }

    async playAudio(fileURL) {

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
            await soundObject.loadAsync({ uri: fileURL });
            await soundObject.playAsync();
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }

    }

    async componentWillUnmount() { await soundObject.unloadAsync();

    }

    async sendSpeechNotification() {

        // Send audio request 
        if (this.state.profile_percent == 50) {

            let fileURL = '';
            const text = 'ِعزيزي المُسْتَخْدِم لَقَدْ إستَهْلَكْتْ خَمْسُوووون بِالمِئَةِ مِن مُجْمَلِ فَاتُورَتِكَ المُدخَل';

            axios.post(`http://45.32.251.50`, { text })
                .then(res => {
                    console.log("Send Speech Notipication : " + res.data);
                    fileURL = res.data;

                    this.playAudio(fileURL);

                })
        }

        if (this.state.profile_percent == 80) {

            let fileURL = '';
            const text = 'ِعزيزي المُسْتَخْدِم لَقَدْ إستَهْلَكْتْ ثَمَانُووون بِالمِئَةِ مِن مُجْمَلِ فَاتُورَتِكَ المُدخَل';
            axios.post(`http://45.32.251.50`, { text })
                .then(res => {
                    console.log("----------------------xxxx--------------------------" + res.data);
                    fileURL = res.data;

                    this.playAudio(fileURL);

                })
        }


        if (this.state.profile_percent == 100) {

            let fileURL = '';
            const text = 'ِعزيزي المُسْتَخْدِم لَقَدْ إستَهْلَكْتْ 100 بِالمِئَةِ مِن مُجْمَلِ فَاتُورَتِكَ المُدخَل';

            axios.post(`http://45.32.251.50`, { text })
                .then(res => {
                    console.log("----------------------xxxx--------------------------" + res.data);
                    fileURL = res.data;

                    this.playAudio(fileURL);

                })
        }
    }

    _calcuateConsumptionAndReport = async () => {

        console.log("Here in calc sate amount: ",this.state.amount);
         console.log(this.props.currentCount+"calc current time")
        try {
            const curTime = this.props.currentCount;
            const amount = this.state.amount;


            if (amount > 0) {
                console.log('>>>0');
                
                // We choose to deal with the seconds as hours but we divide it by 6 for reasonable duration for testing purpose
                let workingHours = curTime/6;
                let bill = amount;
                let totalConsuming;
                let watts = 40;

                let kwh = watts * workingHours / 1000;

                if (kwh > 6000) {
                    totalConsuming = kwh * 0.3 * 100;
                }
                if (kwh <= 6000) {
                    totalConsuming = kwh * 0.18 * 100;
                }

                totalConsuming = Math.floor(totalConsuming)
                totalConsuming = parseInt(((totalConsuming * 100) / bill));
                let profileColor = this.state.profile_color;

                if (totalConsuming < 50) {
                    profileColor = '#56b058';
                }
                if (totalConsuming >= 50 && totalConsuming < 80) {
                    profileColor = '#fffb00';
                }
                if (totalConsuming >= 80 && totalConsuming < 100) {
                    profileColor = '#f58f00';
                }

                if (totalConsuming >= 100) {
                    profileColor = '#ff3126';
                }
                this.setState({ profile_color: profileColor, profile_percent: totalConsuming }, () => {
                    this.getAudio(totalConsuming);
                    this.setState({ show_shape: true });
                });


            }
            else {
                this.setState({ show_shape: false });
            }

        } catch (error) {
            // Error retrieving data
            this.setState({ show_shape: false });
        }

    }
    open_profile() {

        NavigationService.navigate('profile');

        // this.props.navigation.dispatch(navigateAction);
    }


    render() {

        const {
            profile_percent,
            profile_color
        } = this.state

        // if(this.state.read == true)


        return (
            <View style={styles.container}>
                <ImageBackground source={require('./otherhalf.png')} style={{ width: '100%', height: '150%', flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ScrollView style={{ width: '100%', padding: 20 }}>
                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <Text style={styles.routineTitle}> إجمالي الإستهلاك </Text>
                        </View>
                        {

                            !this.state.show_shape &&
                            <View style={{ width: '100%', borderRadius: 10, alignItems: 'center', padding: 15, backgroundColor: '#ffffff', marginTop: 10, marginBottom: 10, shadowOpacity: 0.1, opacity: 0.9, }}>
                                <Text style={styles.contentText}> إذا كنت تريد تفعيل هذة الخاصية يرجى ملء خانة "الحد الإئتماني للفاتورة" </Text>
                                <TouchableOpacity style={styles.button_style} onPress={() => this.open_profile()}>
                                    <Text style={styles.button_text}> أنقر هنا</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            this.state.show_shape &&
                            <View style={{ width: '100%', borderRadius: 10, alignItems: 'center', padding: 15, backgroundColor: '#ffffff', marginTop: 10, marginBottom: 10, opacity: 0.9, }}>
                                <ProgressCircle

                                    percent={this.state.profile_percent}
                                    radius={60}
                                    borderWidth={14}
                                    color={this.state.profile_color}
                                    shadowColor="#ffffff"
                                    bgColor="#fff"
                                >
                                    <Text style={{ fontSize: 16, color: "#757575" }}>{this.state.profile_percent}{"%"}</Text>
                                </ProgressCircle>
                            </View>
                        }

                        <View style={{ width: '100%', alignItems: 'flex-end' }}>
                            <Text style={styles.routineTitle}> تفصيل الإستهلاك </Text>
                        </View>

                        <View style={{ width: '100%', borderRadius: 10, alignItems: 'center', padding: 15, paddingBottom: 0, backgroundColor: '#ffffff', marginTop: 10, marginBottom: 10, shadowOpacity: 0.1, opacity: 0.9, }}>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>

                                    {this.state.show_shape &&
                                        <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 1]} style={styles.component_bar} />
                                    }
                                    {this.state.show_shape &&

                                        <Text style={styles.bar_text}> 100% </Text>
                                    }


                                    {!this.state.show_shape &&
                                        <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    }

                                    {!this.state.show_shape &&
                                        <Text style={styles.bar_text}> 0% </Text>
                                    }

                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> الإنارة </Text>
                                </View>
                            </View>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>
                                    <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    <Text style={styles.bar_text}> 0% </Text>
                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> التلفاز </Text>
                                </View>
                            </View>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>
                                    <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    <Text style={styles.bar_text}> 0% </Text>
                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> البوابة </Text>
                                </View>
                            </View>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>
                                    <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    <Text style={styles.bar_text}> 0% </Text>
                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> الانترنت </Text>
                                </View>
                            </View>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>
                                    <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    <Text style={styles.bar_text}> 0%</Text>
                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> التكييف </Text>
                                </View>
                            </View>
                            <View style={styles.component_view}>
                                <View style={styles.component_bar_view}>
                                    <LinearGradient colors={['#8abbc6', '#ffffff']} start={[0, 0]} end={[0, 0]} style={styles.component_bar} />
                                    <Text style={styles.bar_text}> 0%</Text>
                                </View>
                                <View style={styles.component_text_view}>
                                    <Text style={styles.contentText}> اله القهوه </Text>
                                </View>
                            </View>

                            {/* <STTButton/> */}

                        </View>
                        <View style={{ height: 30 }} />
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }



}//end class

const mapStateToProps = (state) => {
    return {
        toggle: state.toggle1Reducer,
        currentCount: state.countReducer.count,
    };
}

reportScreen.navigationOptions = ({ navigation }) => ({

    headerTitle: 'التقارير',

    /* headerRight:()=>(
       <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={{marginRight:15}}>
         <AntDesign name="right" size={24} color="#fff" />
       </TouchableOpacity>
     ),*/

    headerLeft: navigation.state.params && navigation.state.params.headerLeft,

    headerStyle: {
        backgroundColor: '#8BC4D0',
        color: 'white'

    },
    headerTitleStyle: {
        color: '#fff'
    }
});
export default connect(mapStateToProps)(reportScreen);







const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7FAFF'
    },
    routineTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2287ac',
        marginTop: 20,
        marginBottom: 10,
    },
    contentText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#8abbc6',
    },
    button_style: {
        width: 200,
        height: 40,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2287ac',
        marginTop: 20
    },
    button_text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
    },
    component_view: {
        width: '100%',
        marginBottom: 7,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    component_bar_view: {
        marginTop: 6,
        flex: 1,
        marginRight: 10,
        justifyContent: 'center'
    },
    component_text_view: {
        width: 100,
        justifyContent: 'flex-end'
    },
    component_bar: {
        width: '100%',
        height: 10,
        borderWidth: 0.5,
        borderColor: '#BBCCCF'
    },
    bar_text: {
        fontSize: 14,
        textAlign: 'center',
        color: '#8abbc6',
    }
});