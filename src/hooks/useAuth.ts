import { useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, microsoftProvider, db } from '../firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on app load
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User signed in via redirect
          console.log('User signed in via redirect');
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    checkRedirectResult();

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get or create user document
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        let userData: User;
        if (userDoc.exists()) {
          userData = userDoc.data() as User;
        } else {
          // Create new user document
          userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
            isPaid: Math.random() > 0.7, // Random paid status for demo
            provider: firebaseUser.providerData[0]?.providerId.includes('google') ? 'google' : 'microsoft'
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        }
        
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // If popup is blocked, try redirect method
      if (error.code === 'auth/popup-blocked') {
        console.log('Popup blocked, trying redirect method...');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Google redirect login error:', redirectError);
        }
      } else {
        console.error('Google login error:', error);
      }
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      await signInWithPopup(auth, microsoftProvider);
    } catch (error) {
      // If popup is blocked, try redirect method
      if (error.code === 'auth/popup-blocked') {
        console.log('Popup blocked, trying redirect method...');
        try {
          await signInWithRedirect(auth, microsoftProvider);
        } catch (redirectError) {
          console.error('Microsoft redirect login error:', redirectError);
        }
      } else {
        console.error('Microsoft login error:', error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    loginWithGoogle,
    loginWithMicrosoft,
    logout
  };
};