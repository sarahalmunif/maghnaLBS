import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomeScreen from "../screens/WelcomeScreen";
import HomeStack from "./HomeStackNavigator";
import MainTabNavigator from './MainTabNavigator';
import SignInScreen from '../screens/SignInScreen';
import WelcomeStackNavigator from './WelcomeStackNavigator';
import instructionsScreen from "../screens/instructionsScreen";

export default createAppContainer(
    createStackNavigator({
        // signIp:SignInScreen,
         // WelcomeScreen : WelcomeScreen,


       WelcomeStackNavigator: {
       screen: WelcomeStackNavigator,
             },

     //  HomeStack: HomeStack,
       instructions: {screen: instructionsScreen},
        Main: {
          screen: MainTabNavigator,
            
        },
    },
    {
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false,
            backgroundColor: '#2d8cb1',
          },
        initialRouteName: 'WelcomeStackNavigator'
    })
);
