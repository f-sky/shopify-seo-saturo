// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js"
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js"
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIYnoXY5BDAyRPPQrHmD3bYHMUwOpXRJY",
  authDomain: "personlized-live.firebaseapp.com",
  projectId: "personlized-live",
  storageBucket: "personlized-live.appspot.com",
  messagingSenderId: "614483270596",
  appId: "1:614483270596:web:a60db9d2231d729d3aa291",
  measurementId: "G-J4HFJYPVN0"
};

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
let saturo = {}

window.saturo = saturo
saturo.app = app
saturo.firestore = firestore
saturo.doc = doc
saturo.setDoc = setDoc
saturo.getDoc = getDoc

const auth = getAuth()

saturo.auth = auth
saturo.signInAnonymously = signInAnonymously
saturo.onAuthStateChanged = onAuthStateChanged
