"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTelegram } from "./TelegramContext";

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: telegramUser } = useTelegram();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const login = async () => {
    if (!telegramUser) {
      throw new Error("Telegram user not available");
    }

    setIsLoading(true);
    try {
      // Simulate API call to authenticate with backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set user from Telegram data
      setUser({
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        email: `${telegramUser.username}@telegram.user`, // Mock email
        phone: "+1234567890", // Mock phone
      });

      // Store in localStorage for persistence
      localStorage.setItem("auth_user", JSON.stringify(telegramUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const updateProfile = async () => {
    if (!telegramUser) return;

    setIsLoading(true);
    try {
      // Simulate API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update user with latest Telegram data
      setUser({
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        email: user?.email || `${telegramUser.username}@telegram.user`,
        phone: user?.phone || "+1234567890",
      });

      localStorage.setItem("auth_user", JSON.stringify(telegramUser));
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser && telegramUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          id: parsedUser.id,
          first_name: parsedUser.first_name,
          last_name: parsedUser.last_name,
          username: parsedUser.username,
          email: `${parsedUser.username}@telegram.user`,
          phone: "+1234567890",
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("auth_user");
      }
    }
  }, [telegramUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
