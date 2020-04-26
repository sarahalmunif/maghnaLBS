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
import { ifIphoneX } from 'react-native-iphone-x-helper'

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  async redirectRoute(route) {
    const { navigation }  = this.props;
    navigation.navigate(route);
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <LinearGradient colors={['#1784ab', '#9dd1d9']} style={{flex: 1}}>
          <View style={styles.view}>
            <View style={styles.form}>
              <Image source={require('../assets/images/logo.png')} style={styles.logo} />
              <TextInput style={styles.input} placeholder="اسم المستخدم" />
              <TextInput style={styles.input} placeholder="كلمة المرور " />
              <Button style={styles.button} onPress={() => this.redirectRoute('Home', {name: 'Jane'})}>
                <LinearGradient 
                  colors={['#1784ab', '#9dd1d9']} style={styles.gradient}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>تسجيل الدخول </Text>
                </LinearGradient>
              </Button>
              <Text style={styles.note}>هل نسيت كلمة المرور؟</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
      height: 0.65 * height,
    }, {
      width: 0.8 * width,
      height: 0.75 * height,
    }),
  },
  logo: {
    alignSelf: 'center',
    width: 0.6 * width,
    height: 0.3 * height,
    marginTop: 30,
  },
  input: {
    alignSelf: 'center',
    borderColor: '#7db4cb',
    textAlign: 'right',
    borderWidth: 1,
    height: 46,
    width: 250,
    ...ifIphoneX({
      margin: 0.02 * height,
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
    borderRadius: 32,
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
    marginRight: 38,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});




