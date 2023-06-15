import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
  const [user, setUser] = useState(null);
  const [onLoginSuccess, setOnLoginSuccess] = useState(null);
  const [onLogoutSuccess, setOnLogoutSuccess] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser && onLoginSuccess) {
        onLoginSuccess();
        setOnLoginSuccess(null);
      }
    });

    return () => unsubscribe();
  }, [onLoginSuccess]);

  
  const login = (email, password, onSuccess) => {
    setOnLoginSuccess(onSuccess);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error.message);
      });
  };
  
  const logout = (onLogoutSuccess) => {
    setOnLogoutSuccess(onLogoutSuccess)
    auth()
      .signOut()
      .catch((error) => {
        console.log(error.message);
      });
  };

  
  
  return (
    <AuthContext.Provider value={{ user, login, logout, idUser: user?.uid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
