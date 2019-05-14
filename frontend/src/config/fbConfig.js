import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDCvq14klX59GLVBjp1TGjOln64ItuJvsQ",
    authDomain: "net-ninja-marioplan-3c304.firebaseapp.com",
    databaseURL: "https://net-ninja-marioplan-3c304.firebaseio.com",
    projectId: "net-ninja-marioplan-3c304",
    storageBucket: "net-ninja-marioplan-3c304.appspot.com",
    messagingSenderId: "483767780301",
    appId: "1:483767780301:web:eccf0e4efdc264cf"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ timestampsInSnapshots: true })

  export default firebase;