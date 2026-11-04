
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export type AxisUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarColor: string;
};

type Credentials = {
  email: string;
  password: string;
};

type Registration = Credentials & {
  firstName: string;
  lastName: string;
};

type AuthValue = {
  user: AxisUser | null;
  register: (data: Registration) => Promise<void>;
  login: (data: Credentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

const AVATAR_COLORS = [
  "#C45A87",
  "#8D65B6",
  "#387C92",
  "#D17746",
  "#44846B",
  "#B45D63",
];

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AxisUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      try {
        const profileRef = doc(db, "users", firebaseUser.uid);
        const profileSnapshot = await getDoc(profileRef);

        const profile = profileSnapshot.exists()
          ? profileSnapshot.data()
          : {};

        const nameParts = (firebaseUser.displayName ?? "").split(" ");

        setUser({
          id: firebaseUser.uid,
          firstName: profile.firstName ?? nameParts[0] ?? "",
          lastName:
            profile.lastName ?? nameParts.slice(1).join(" "),
          email: firebaseUser.email ?? "",
          avatarColor: profile.avatarColor ?? AVATAR_COLORS[0],
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);

        const nameParts = (firebaseUser.displayName ?? "").split(" ");

        setUser({
          id: firebaseUser.uid,
          firstName: nameParts[0] ?? "",
          lastName: nameParts.slice(1).join(" "),
          email: firebaseUser.email ?? "",
          avatarColor: AVATAR_COLORS[0],
        });
      }
    });

    return unsubscribe;
  }, []);

  const register = async (data: Registration) => {
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim().toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();

    const avatarColor =
      AVATAR_COLORS[
        Math.floor(Math.random() * AVATAR_COLORS.length)
      ];

    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      data.password
    );

    await updateProfile(credential.user, {
      displayName: fullName,
    });

    await setDoc(doc(db, "users", credential.user.uid), {
      firstName,
      lastName,
      email,
      avatarColor,
      createdAt: new Date().toISOString(),
    });
  };

  const login = async ({ email, password }: Credentials) => {
    await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const profileRef = doc(db, "users", firebaseUser.uid);

    try {
      const profileSnapshot = await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        const nameParts = (firebaseUser.displayName ?? "").split(" ");

        await setDoc(profileRef, {
          firstName: nameParts[0] ?? "",
          lastName: nameParts.slice(1).join(" "),
          email: firebaseUser.email ?? "",
          avatarColor: AVATAR_COLORS[0],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(
        "Google autenticado, mas não foi possível carregar/salvar o perfil:",
        error
      );
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      register,
      login,
      loginWithGoogle,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAxisAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAxisAuth requires AuthProvider");
  }

  return value;
}

export function userInitials(user: AxisUser | null) {
  return user
    ? `${user.firstName[0] ?? ""}${
        user.lastName[0] ?? ""
      }`.toLocaleUpperCase("pt-BR")
    : "AX";
}