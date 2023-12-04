import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuvdHZgj8aGUo1IpcfaTVjKHfmF4zqQfM",
    authDomain: "familytree-f0da6.firebaseapp.com",
    projectId: "familytree-f0da6",
    storageBucket: "familytree-f0da6.appspot.com",
    messagingSenderId: "549288590513",
    appId: "1:549288590513:web:fee0d57ceec9344e6cb690"
  };

const app = initializeApp(firebaseConfig);
//const database = getDatabase(app);
const database = getFirestore(app);

export { database };