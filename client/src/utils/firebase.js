import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "prepbot-64a8d.firebaseapp.com",
//   projectId: "prepbot-64a8d",
//   storageBucket: "prepbot-64a8d.firebasestorage.app",
//   messagingSenderId: "963144046648",
//   appId: "1:963144046648:web:2d6ce86b6767a55d7faecd"
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "prepbot-cdb7f.firebaseapp.com",
  projectId: "prepbot-cdb7f",
  storageBucket: "prepbot-cdb7f.firebasestorage.app",
  messagingSenderId: "603187933408",
  appId: "1:603187933408:web:f65f319382a692bdf06085"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth, provider} 