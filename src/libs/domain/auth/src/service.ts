import auth from '@react-native-firebase/auth';

export async function signIn(email, password) {
    return auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email, password) {
    return auth().createUserWithEmailAndPassword(email, password);
}

export async function signOut() {
    return auth().signOut();
}

export function onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
}