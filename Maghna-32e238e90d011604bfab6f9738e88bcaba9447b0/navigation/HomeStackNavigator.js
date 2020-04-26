import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import instructionsScreen from "../screens/instructionsScreen";
import HomeScreen from "../screens/HomeScreen";
import supdevicesScreen from '../screens/supdevicesScreen';
import RoutineScreen from '../screens/RoutineScreen';
import reportScreen from '../screens/reportScreen';
import profileScreen from '../screens/profileScreen';


const HomeStack = createStackNavigator(
    {
        HomeScreen: HomeScreen,
        instructions:instructionsScreen,
        supdevices:supdevicesScreen,
        Routine:RoutineScreen,
        report:reportScreen,
        profile:profileScreen
    },
    {
        navigationOptions: {
            backgroundColor: '#2d8cb1',
        },
    }
);

export default createAppContainer(HomeStack);
