import React, {
    createContext,
    useContext,
    useMemo,
    useState,
  } from "react";
  
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
    logout: () => void;
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
  
    const [demoAccount, setDemoAccount] =
    useState<
      (Registration & {
        id: string;
        avatarColor: string;
      }) | null
    >(null);
  
    const register = async (data: Registration) => {
        const account = {
          ...data,
          id: `demo-${Date.now()}`,
          email: data.email.trim().toLowerCase(),
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          avatarColor:
            AVATAR_COLORS[
              Math.floor(Math.random() * AVATAR_COLORS.length)
            ],
        };
      
        setDemoAccount(account);
      
        setUser({
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          avatarColor: account.avatarColor,
        });
      };
  
      const login = async ({
        email,
        password,
      }: Credentials) => {
        if (
          !demoAccount ||
          demoAccount.email !== email.trim().toLowerCase() ||
          demoAccount.password !== password
        ) {
          throw new Error(
            "Conta não encontrada nesta demonstração. Crie um cadastro para testar."
          );
        }
      
        setUser({
          id: demoAccount.id,
          firstName: demoAccount.firstName,
          lastName: demoAccount.lastName,
          email: demoAccount.email,
          avatarColor: demoAccount.avatarColor,
        });
      };
  
    const value = useMemo(
      () => ({
        user,
        register,
        login,
        logout: () => setUser(null),
      }),
      [user, demoAccount]
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
      throw new Error(
        "useAxisAuth requires AuthProvider"
      );
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