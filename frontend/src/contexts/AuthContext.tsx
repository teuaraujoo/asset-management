import { createContext, useContext } from "react";
import type { AuthUser } from "@/@types/auth/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  isAuth: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext precisa ser usado dentro AuthProvider");
  }

  return context;
};