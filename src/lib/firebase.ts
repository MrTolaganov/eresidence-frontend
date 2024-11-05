import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: 'eresidence-b1d20.firebaseapp.com',
  projectId: 'eresidence-b1d20',
  storageBucket: 'eresidence-b1d20.appspot.com',
  messagingSenderId: '5101495759',
  appId: '1:5101495759:web:649c9597fa5aa05228deba',
  measurementId: 'G-TK0GCSLW1L',
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
