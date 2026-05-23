import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClYTbo9nrlRy8vAOi0J9Yz9akbBLz6IjA",
  authDomain: "kamoyu-team-shuffle.firebaseapp.com",
  projectId: "kamoyu-team-shuffle",
  storageBucket: "kamoyu-team-shuffle.appspot.com",
  messagingSenderId: "114052898784",
  appId: "1:114052898784:web:a439faa1055b0eae28d585",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Storageは完全削除（使わない）