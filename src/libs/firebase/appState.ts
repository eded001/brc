import auth from '@react-native-firebase/auth';
import { store } from '@/store';
import { setUser, clearUser } from '@/reducers/authSlice';

export function bootstrapFirebaseAuth() {
    return auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            store.dispatch(setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
            }));
        } else {
            store.dispatch(clearUser());
        }
    });
}