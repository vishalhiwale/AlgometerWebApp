// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyBYfEokSYeJ_Sd7KTJexAZNgHI2sF9YQTw",
//   authDomain: "realtime-data-demo-b10ea.firebaseapp.com",
//   databaseURL: "https://realtime-data-demo-b10ea-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "realtime-data-demo-b10ea",
//   storageBucket: "realtime-data-demo-b10ea.firebasestorage.app",
//   messagingSenderId: "1080682524314",
//   appId: "1:1080682524314:web:daf77ed0c5220d263a3923"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAsADatje6xOU7GdVPt-jcdR5JdYKOT6xY",
//   authDomain: "algometer-9628a.firebaseapp.com",
//   projectId: "algometer-9628a",
//   storageBucket: "algometer-9628a.firebasestorage.app",
//   messagingSenderId: "523381037326",
//   appId: "1:523381037326:web:db8da1b024f778222a5f5f",
//   measurementId: "G-1BHCSKLYQV"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// -------------------------------------------------------------------------------------
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBYfEokSYeJ_Sd7KTJexAZNgHI2sF9YQTw",
//   authDomain: "realtime-data-demo-b10ea.firebaseapp.com",
//   databaseURL: "https://realtime-data-demo-b10ea-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "realtime-data-demo-b10ea",
//   storageBucket: "realtime-data-demo-b10ea.firebasestorage.app",
//   messagingSenderId: "1080682524314",
//   appId: "1:1080682524314:web:daf77ed0c5220d263a3923"
// };

// const app = initializeApp(firebaseConfig);

// export const db = getDatabase(app);
// export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsADatje6xOU7GdVPt-jcdR5JdYKOT6xY",
  authDomain: "algometer-9628a.firebaseapp.com",
  databaseURL: "https://algometer-9628a-default-rtdb.firebaseio.com",
  projectId: "algometer-9628a",
  storageBucket: "algometer-9628a.firebasestorage.app",
  messagingSenderId: "523381037326",
  appId: "1:523381037326:web:db8da1b024f778222a5f5f",
  measurementId: "G-1BHCSKLYQV"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const db = getDatabase(app);
export const auth = getAuth(app);