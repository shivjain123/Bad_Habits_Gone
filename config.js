import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    // apiKey: "AIzaSyACsR0B6oH4N-pamhA_D6r7HC7Xcpw-20Y",
    // authDomain: "bad-habits-gone-6fa96.firebaseapp.com",
    // projectId: "bad-habits-gone-6fa96",
    // storageBucket: "bad-habits-gone-6fa96.appspot.com",
    // messagingSenderId: "33600081483",
    // appId: "1:33600081483:web:8629d44b3d05c64a6147ce"
    //  apiKey: "AIzaSyCRvTD6PSRyrItJwmJbTmCNfOrDfveaAC4",
    // authDomain: "bad-habits-gone-18th-august.firebaseapp.com",
    // projectId: "bad-habits-gone-18th-august",
    // storageBucket: "bad-habits-gone-18th-august.appspot.com",
    // messagingSenderId: "249909091787",
    // appId: "1:249909091787:web:1a61f9ac529b67a193ea4e"

    apiKey: "AIzaSyAYuQrNEvVFqyQQQkNH1-DolpsBsGehxrY",
  authDomain: "c-71-27ef6.firebaseapp.com",
  databaseURL: "https://c-71-27ef6.firebaseio.com",
  projectId: "c-71-27ef6",
  storageBucket: "c-71-27ef6.appspot.com",
  messagingSenderId: "551910343961",
  appId: "1:551910343961:web:27f0b7f196eae026c9b188"
};
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();