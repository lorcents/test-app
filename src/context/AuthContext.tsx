'use client'
import React, { FC, ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../app/firebase/auth';
import { SyncLoader} from 'react-spinners';

// Define the type for your user object
interface User {
  uid: string;
  // Add other properties as needed
}

// Define the type for your context
interface AuthContextProps {
  user: User | null;
}

// Create the context with an initial value of undefined
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const GlobalSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
  <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <SyncLoader color="#14B8A6" size={25} />
  </div>
</div>
);

// Create a custom hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
};

// Define the props type for AuthContextProvider
interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Map Firebase auth user to your User type
        const mappedUser: User = {
          uid: authUser.uid,
          // Add other properties as needed
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check if loading is still true
  if (loading) {
    // Return a loading message
    return <GlobalSpinner />;
  }

  // Return the AuthContext.Provider with the value prop
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
