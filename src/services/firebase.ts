'use server';
/**
 * @fileOverview Firebase services for the CropClaim AI application.
 * This file contains functions for interacting with Firebase services like Storage.
 */

import {initializeApp, getApp, getApps} from 'firebase/app';
import {getStorage, ref, uploadString, getDownloadURL} from 'firebase/storage';

// Your web app's Firebase configuration will be populated here.
// IMPORTANT: Do not edit this object manually.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage.
 * @param fileDataUri The file to upload, as a data URI.
 * @param filePath The path where the file should be stored in Firebase Storage.
 * @returns The download URL of the uploaded file.
 */
export async function uploadFile(fileDataUri: string, filePath: string): Promise<string> {
  const storageRef = ref(storage, filePath);
  await uploadString(storageRef, fileDataUri, 'data_url');
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
