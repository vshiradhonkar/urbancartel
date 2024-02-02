import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC891_eVdtmE6LPY-yGZxALZpwcJwWsfYo",
  authDomain: "urbancartel-2024.firebaseapp.com",
  projectId: "urbancartel-2024",
  storageBucket: "urbancartel-2024.appspot.com",
  messagingSenderId: "620395312605",
  appId: "1:620395312605:web:11978cb3b30b17ca233234",
  measurementId: "G-W6087HS0Z8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

// Set persistence to 'session'
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    console.log(user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

export { auth, firestore, signInWithGoogle };
