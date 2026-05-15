import React, { createContext, useState, useEffect } from 'react';
import { db } from '../src/Firebase';
import { doc, getDoc } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hote hi Firebase se data ek baar mangwa lo
  const refreshUserData = async () => {
    try {
      const docRef = doc(db, "users", "main_user");
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

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, refreshUserData, loading }}>
      {children}
    </UserContext.Provider>
  );
};