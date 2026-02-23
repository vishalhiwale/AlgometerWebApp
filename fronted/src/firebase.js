import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYfEokSYeJ_Sd7KTJexAZNgHI2sF9YQTw",
  authDomain: "realtime-data-demo-b10ea.firebaseapp.com",
  databaseURL: "https://realtime-data-demo-b10ea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "realtime-data-demo-b10ea",
  storageBucket: "realtime-data-demo-b10ea.firebasestorage.app",
  messagingSenderId: "1080682524314",
  appId: "1:1080682524314:web:daf77ed0c5220d263a3923"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);