import firebase from "firebase";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  // User pode ser User ou undefined
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

// criando o contexto
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps ) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    // event listener
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
      
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })

    // boa prática
    // descadastrando do event listener sempre no final do useEffect
    return () => {
      unsubscribe();
    }
  }, []);

async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  const result = await auth.signInWithPopup(provider);

  if (result.user) {
    const { displayName, photoURL, uid } = result.user
    
    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account.')
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL,
    });
  }
}

  return (
  // Todo contexto precisa receber um value
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}