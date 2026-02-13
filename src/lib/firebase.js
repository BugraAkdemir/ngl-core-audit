import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, orderBy, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMoT2KmTGRRt9ggAM7pIDLrAu8RNkwkPI",
    authDomain: "faken-2a2dd.firebaseapp.com",
    projectId: "faken-2a2dd",
    storageBucket: "faken-2a2dd.firebasestorage.app",
    messagingSenderId: "89102834108",
    appId: "1:89102834108:web:061f3b810231ad03b173b9",
    measurementId: "G-36HWWPRSMH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore helpers
export async function getSettings() {
    const settingsDoc = await getDoc(doc(db, 'config', 'settings'));
    return settingsDoc.exists() ? settingsDoc.data() : { requireIg: true };
}

export async function saveMessage(messageData) {
    return await addDoc(collection(db, 'messages'), {
        ...messageData,
        timestamp: new Date().toISOString()
    });
}

export async function updateSettings(settings) {
    return await setDoc(doc(db, 'config', 'settings'), settings, { merge: true });
}

export async function getAllMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllMedia() {
    const q = query(collection(db, 'media'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveMediaEntry(data) {
    return await addDoc(collection(db, 'media'), {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
    });
}
