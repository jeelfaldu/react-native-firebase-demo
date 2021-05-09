import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

//const todoCollection = firebase.default.firestore().collection('todo')
export { firebase, auth, firestore };
//export const afs = firebase.firestore().collection('todo');
//export const db = firebase.database().ref('cate');