import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen"
import WelcomeScreen from "../screens/WelcomeScreen";
import forgetPassword from "../screens/forgetPassword";
import locationPage from "../screens/locationPage";


const welcomeStack = createStackNavigator(
    {
      welcome: WelcomeScreen,
      SignIn: SignInScreen,
      SignUp:SignUpScreen,
      forgetPassword:forgetPassword,
      locationPage:locationPage,

    },
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
            backgroundColor: '#2d8cb1',
        },
        initialRouteName: 'welcome'
    }
);

export default createAppContainer(welcomeStack);
