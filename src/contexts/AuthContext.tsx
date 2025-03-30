import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, UserRole } from '@/types';

export interface UserData extends User {
  businessName?: string;
  businessAddress?: string;
  aadharNumber?: string;
  panNumber?: string;
  description?: string;
  phoneVerified?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  setUserRole: (role: UserRole) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  setUserRole: async () => {},
  updateUserData: async () => {
    throw new Error("updateUserData function not implemented");
  }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserData(userDoc.data() as UserData);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
  }, []);

  const setUserRole = async (role: UserRole) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), {
        role: role
      }, { merge: true });
    }
  };

  const updateUserData = async (newData: Partial<UserData>) => {
    if (!user?.uid) {
      throw new Error("No authenticated user");
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        ...newData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updateData);

      // Get fresh data and update local state
      const updatedDoc = await getDoc(userRef);
      const freshData = updatedDoc.data() as UserData;
      setUserData(freshData);

      return freshData;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      setUserRole,
      updateUserData 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
