import React from "react";
import { View, StyleSheet, TouchableHighlight, Animated ,Text} from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";

export default class AddButton extends React.Component {
    
    buttonSize = new Animated.Value(1);



    render() {
   
 

        const sizeStyle = {
            transform: [{ scale: this.buttonSize }]
        };

        return (
            <View style={{ position: "absolute", alignItems: "center" }}>
            
                <Animated.View style={[styles.button, sizeStyle]}>
                    <TouchableHighlight onPress={this.handlePress} >
                                <Text>crystal ball</Text>
                    </TouchableHighlight>
                </Animated.View>

                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#4398b9",
        position: "absolute",
        marginTop: -60,
        shadowColor: "#4398b9",
        shadowRadius: 5,
        shadowOffset: { height: 10 },
        shadowOpacity: 0.3,
        borderWidth: 3,
        borderColor: "#FFFFFF"
    },
    secondaryButton: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#7F58FF"
    }
});