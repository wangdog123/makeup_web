// Firebase 配置
// TODO: 從 Firebase Console 獲取您的配置並替換以下內容
// https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "AIzaSyCGaDL9mXYARLsPOFxFXsrtwJLI_SgINOg",
  authDomain: "webfinal-6ea63.firebaseapp.com",
  projectId: "webfinal-6ea63",
  storageBucket: "webfinal-6ea63.firebasestorage.app",
  messagingSenderId: "69019633510",
  appId: "1:69019633510:web:9e4d33b4654eb6e1abaaa7",
  measurementId: "G-2NP9BFL489"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);

// 初始化Firestore
const db = firebase.firestore();
