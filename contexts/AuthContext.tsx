
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Platform } from "react-native";

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
  updateDoc,
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

function getRandomAvatarColor() {
  return AVATAR_COLORS[
    Math.floor(Math.random() * AVATAR_COLORS.length)
  ];
}

function createUserFallback(firebaseUser: any): AxisUser {
  const nameParts = (firebaseUser.displayName ?? "")
    .trim()
    .split(" ")
    .filter(Boolean);

  return {
    id: firebaseUser.uid,
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    email: firebaseUser.email ?? "",
    avatarColor: getRandomAvatarColor(),
  };
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AxisUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      const fallbackUser = createUserFallback(firebaseUser);
      setUser(fallbackUser);

      const loadProfile = async () => {
        try {
          const profileRef = doc(db, "users", firebaseUser.uid);
          const profileSnapshot = await getDoc(profileRef);

          if (profileSnapshot.exists()) {
            const profile = profileSnapshot.data();

            let avatarColor = profile.avatarColor;

            if (!avatarColor || avatarColor === "#C45A87") {
              avatarColor = getRandomAvatarColor();

              await updateDoc(profileRef, {
                avatarColor,
              });
            }

            setUser({
              ...fallbackUser,
              firstName: profile.firstName ?? fallbackUser.firstName,
              lastName: profile.lastName ?? fallbackUser.lastName,
              email: profile.email ?? fallbackUser.email,
              avatarColor,
            });
          } else {
            setUser(fallbackUser);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      };

      void loadProfile();
    });

    return unsubscribe;
  }, []);

  const register = async (data: Registration) => {
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim().toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();

    const avatarColor = getRandomAvatarColor();

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
    if (Platform.OS !== "web") {
      throw new Error(
        "O login com Google está disponível apenas na versão Web."
      );
    }

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const fallbackUser = createUserFallback(firebaseUser);
    setUser(fallbackUser);

    const profileRef = doc(db, "users", firebaseUser.uid);

    try {
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const profile = profileSnapshot.data();

        let avatarColor = profile.avatarColor;

        if (!avatarColor || avatarColor === "#C45A87") {
          avatarColor = getRandomAvatarColor();

          await updateDoc(profileRef, {
            avatarColor,
          });
        }

        setUser({
          ...fallbackUser,
          firstName: profile.firstName ?? fallbackUser.firstName,
          lastName: profile.lastName ?? fallbackUser.lastName,
          email: profile.email ?? fallbackUser.email,
          avatarColor,
        });

        return;
      }

      const nameParts = (firebaseUser.displayName ?? "")
        .trim()
        .split(" ");

      const newProfile = {
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" "),
        email: firebaseUser.email ?? "",
        avatarColor: getRandomAvatarColor(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(profileRef, newProfile);

      setUser({
        ...fallbackUser,
        ...newProfile,
      });
    } catch (error) {
      console.error(
        "Google autenticado, mas houve erro ao salvar o perfil:",
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
