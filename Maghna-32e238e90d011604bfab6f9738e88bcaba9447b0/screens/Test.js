import React from 'react';
import { ScrollView, StyleSheet,Text } from 'react-native';


export default function TestScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        test
      </Text>
     
    </ScrollView>
  );
}

TestScreen.navigationOptions= {
  title: 'الأنماط الشخصية',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
