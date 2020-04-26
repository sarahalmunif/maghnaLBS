import * as firebase from 'firebase';

const firebaseConfig = {

   apiKey: "AIzaSyCsKoPxvbEp7rAol5m-v3nvgF9t8gUDdNc",
    authDomain: "maghnatest.firebaseapp.com",
    databaseURL: "https://maghnatest.firebaseio.com",
    projectId: "maghnatest",
    storageBucket: "maghnatest.appspot.com",
    messagingSenderId: "769071221745",
    appId: "1:769071221745:web:1f0708d203330948655250",
  
  };

firebase.initializeApp(firebaseConfig);

export default firebase;