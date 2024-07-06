
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB3wLAu7YKgixTEVwBpCLtXae3xhRTaixA",
    authDomain: "videoapp-427308.firebaseapp.com",
    projectId: "videoapp-427308",
    storageBucket: "videoapp-427308.appspot.com",
    messagingSenderId: "850052885607",
    appId: "1:850052885607:web:7d09732bc7ad4ff1d3b8c2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);