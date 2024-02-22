// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "cadabra-todo.firebaseapp.com",
  projectId: "cadabra-todo",
  storageBucket: "cadabra-todo.appspot.com",
  messagingSenderId: "379978097912",
  appId: "1:379978097912:web:2e1a5dc0ff6b9c16c9870d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(image_url: string, name: string) {
    try {
        const response = await fetch(image_url);
        const buffer = await response.arrayBuffer();
        const fileName = name.replace(' ', '') + Date.now + '.jpeg'
        const storageReference = ref(storage, fileName)
        await uploadBytes(storageReference, buffer, {
            contentType: 'image/jpeg'
        })
        const firebaseUrl = await getDownloadURL(storageReference);
        return firebaseUrl;
    } catch (error) {
        console.error(error);
    }
}