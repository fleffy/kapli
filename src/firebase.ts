// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCZV68OCApTOQh9Pi-dN08rWxCbRwTmQl8',
	authDomain: 'kapli-drop.firebaseapp.com',
	projectId: 'kapli-drop',
	storageBucket: 'kapli-drop.firebasestorage.app',
	messagingSenderId: '928768715997',
	appId: '1:928768715997:web:7cf2fb5b46025ce52b7f34',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const auth = getAuth(app)
const database = getDatabase(app)

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider()

export { auth, database, googleProvider }
