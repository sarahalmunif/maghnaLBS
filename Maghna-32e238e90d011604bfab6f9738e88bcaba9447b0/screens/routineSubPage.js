import React from 'react';
import { ScrollView, StyleSheet,Text ,TouchableOpacity} from 'react-native';
import { FontAwesome5 ,AntDesign,Feather,MaterialCommunityIcons,SimpleLineIcons} from "@expo/vector-icons";
import { withNavigation } from 'react-navigation';

export default function routineSubPage() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        devises types 
      </Text>
      <Text>
          Time 
      </Text>
     
    </ScrollView>
  );
}

routineSubPage.navigationOptions = ({navigation})=> ({

  headerTint:'#F7FAFF',
  headerTitle: 'routine type',

    
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

const navigationConnected =withNavigation(routineSubPage)
export {navigationConnected as routineSubPage}





/*import React from 'react';
import { ScrollView, StyleSheet,Text } from 'react-native';
import { withNavigation } from 'react-navigation';

export default function routineSubPage() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        test
      </Text>
     
    </ScrollView>
  );
}

routineSubPage.navigationOptions = ()=> ({

    headerTint:'#F7FAFF',
    headerTitle: 'توع النمط',
    headerRight:()=>(
        <TouchableOpacity onPress={()=>{navigation.navigate(this.goBack())}} style={{marginRight:15}}>
        <AntDesign name="right" size={24} color="#CDCCCE" />
      </TouchableOpacity>
  
    ),
    headerLeft:()=>(
      <TouchableOpacity onPress={()=>{navigation.navigate('')}} style={{marginLeft:15}}>
        <SimpleLineIcons name="logout" size={24} color="#CDCCCE" />
      </TouchableOpacity>
    ),
      
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
const navigationConnected =withNavigation(routineSubPage)
export {navigationConnected as routineSubPage}*/