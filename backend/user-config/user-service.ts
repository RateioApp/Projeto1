import {db, firebaseAuth} from '../firebase/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {
    collection,
    deleteDoc as firestoreDeleteDoc,
    doc as firestoreDoc,
    getDoc as firestoreGetDoc,
    getDocs,
    query,
    setDoc as firestoreSetDoc,
    where
} from 'firebase/firestore';

const usersCollection = collection(db, 'users');

function userDocument(userId) {
    return firestoreDoc(usersCollection, userId);
}

const deleteUser = async (userId) => {
    try {
        await firestoreDeleteDoc(userDocument(userId));
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const readUser = async (userId) => {
    try {
        const userSnapshot = await firestoreGetDoc(userDocument(userId));
        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading user:', error);
        return null;
    }
};

const checkUserIdExists = async (userId) => {
    const userSnapshot = await firestoreGetDoc(userDocument(userId));
    return userSnapshot.exists();
};

const checkPixExists = async (pix) => {
    try {
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('pix', '==', pix));
        const querySnapshot = await getDocs(emailQuery);

        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};

const checkEmailExists = async (email) => {
    try {
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(emailQuery);

        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};

const generateUserId = () => {
    return firestoreDoc(usersCollection).id;
};

const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;
        // const userData = await readUser(user.uid);
        // if (userData) {
        // }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};


const signup = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        const userDocumentData = {
            userId: user.uid,
            email: user.email,
            ...userData
        };

        await firestoreSetDoc(userDocument(user.uid), userDocumentData);
        //await sendEmailVerification(user); // Ainda estudando como fazer isso da melhor forma

        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};

const getUsers = async () => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => doc.data());
}

const getUserData = async (userId) => {
    try {
        const userSnapshot = await firestoreGetDoc(userDocument(userId));
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const groupIds = userData.groups || [];
            const userDebts = userData.debts || [];
            return {
                userDetails: userData,
                groupIds,
                userDebts,
            };
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading user data:', error);
        return null;
    }
};

export {
    deleteUser,
    readUser,
    generateUserId,
    login,
    signup,
    getUsers,
    userDocument,
    getUserData
};