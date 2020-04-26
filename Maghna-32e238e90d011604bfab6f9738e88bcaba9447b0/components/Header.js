import React, { Component } from 'react';

import Text from 'react-native';
import { View } from 'native-base';
import STTButton from '../STTButton'


export default class Header extends Component {


    componentDidMount() {

        console.log('did mount!');

    }

    render() {



        return (


            
          <STTButton/>

        )
    }

}