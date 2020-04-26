import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import instructionsScreen from "../screens/instructionsScreen";
import supdevicesScreen from '../screens/supdevicesScreen';
import RoutineScreen from '../screens/RoutineScreen';
import reportScreen from '../screens/reportScreen';
import profileScreen from '../screens/profileScreen';
import SignInScreen from "../screens/SignInScreen";

const LogoutStack = createStackNavigator(
    {
        LogOutHome: HomeScreen,
        LogOutinstructions:instructionsScreen,
        LogOutsupdevices:supdevicesScreen,
        LogOutRoutine:RoutineScreen,
        LogOutreport:reportScreen,
       profile:profileScreen,
       SignIn:SignInScreen,
    },
    {
        navigationOptions: {
            backgroundColor: '#2d8cb1',
        },
    }
);

export default createAppContainer(LogoutStack);
