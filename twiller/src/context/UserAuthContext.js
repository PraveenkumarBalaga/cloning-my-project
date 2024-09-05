import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { createContext, useContext, useEffect, useState } from "react";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, Setuser] = useState([]);
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signin(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googlesignin() {
    const googleauthprovider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleauthprovider);
  }
  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      Setuser(currentuser);
    });
    return () => {
      Unsubscribe();
    };
  }, []);
  return (
    <UserAuthContext.Provider
      value={{ user, login, signin, logOut, googlesignin }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}
export function useUserAuth() {
  return useContext(UserAuthContext);
}
