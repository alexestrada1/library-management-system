import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

// What the context shares with the whole app
interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// On page load, restore the user from localStorage (so refresh doesn't log you out)
function loadSavedUser(): User | null {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");
  if (!savedUser || !savedToken) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch (error) {
    return null; // saved data was corrupted
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

// Wrap the app in this so every component can read the login state
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(loadSavedUser);

  // Called after a successful login or register
  function login(token: string, userData: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  // Forget everything about the user
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A simple helper so components can write: const { user } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
