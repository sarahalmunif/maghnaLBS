/** 
 * javascript comment 
 * @Author: Reem
 * @Date: 2020-04-06 12:51:34 
 * @Desc: Helper to handle common methods accross product. 
 */
import { AsyncStorage } from 'react-native';

/*
* Store Light status
*/
export async function setLightStatus(status) {

    let lightStatus = status ? 'TRUE' : 'FALSE';
    await AsyncStorage.setItem('LIGHT_STATUS', lightStatus);

}

/*
* Retrive Light Status
*/
export async function getLightStatus() {

    try {

        let lightStatus = await AsyncStorage.getItem('LIGHT_STATUS');
        if (lightStatus != null && lightStatus == 'TRUE'){
           return true;
        }
        else {
            return false;
        }
        
    } catch (error) {
        return false;
    }
}

