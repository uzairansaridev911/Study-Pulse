import React, { createContext, useState, useEffect, useRef } from 'react';
import { db } from '../src/Firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-react'; // Clerk ka hook import kiya

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const presenceRef = useRef(null); // Database reference save rakhne ke liye

  // Firebase se login user ka data mangwana
  const refreshUserData = async () => {
    if (!clerkUser?.id) return;
    try {
      const docRef = doc(db, "users", clerkUser.id); // Dynamic ID use ki
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error("Context Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. User Data Load karne ka Effect
  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      refreshUserData();
    } else if (clerkLoaded && !clerkUser) {
      setLoading(false); // Agar user logged in nahi hai to loading band
    }
  }, [clerkUser, clerkLoaded]);

  // 2. GLOBAL PRESENCE SYSTEM EFFECT (Puri Site Ke Liye)
  useEffect(() => {
    if (!clerkLoaded || !clerkUser?.id) return;

    const uid = clerkUser.id;
    const ref = doc(db, 'presence', uid);
    presenceRef.current = ref;

    // A. Jaise hi app open ho ya login ho -> Go Online
    setDoc(ref, { online: true, lastSeen: serverTimestamp() });

    // B. Tab switch ya minimize hone par status toggle karna
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setDoc(ref, { online: false, lastSeen: serverTimestamp() });
      } else {
        setDoc(ref, { online: true, lastSeen: serverTimestamp() });
      }
    };

    // C. Browser ya tab directly close karne par offline karna
    const handleBeforeUnload = () => {
      setDoc(ref, { online: false, lastSeen: serverTimestamp() });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup: Jab user logout kare ya app background se bilkul khatam ho
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (presenceRef.current) {
        setDoc(presenceRef.current, { online: false, lastSeen: serverTimestamp() });
      }
    };
  }, [clerkUser, clerkLoaded]);

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};