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
  authDomain: "prepbot-4e9ad.firebaseapp.com",
  projectId: "prepbot-4e9ad",
  storageBucket: "prepbot-4e9ad.firebasestorage.app",
  messagingSenderId: "321776809940",
  appId: "1:321776809940:web:52d1286298766be5974841"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth, provider} 