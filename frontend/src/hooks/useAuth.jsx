import { createContext, useContext, useMemo, useState } from "react";
import { API_ROUTES } from "../config/api";
import { http } from "../services/http";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "1234abcd!";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(identity, password) {
    try {
      const res = await http.post(API_ROUTES.auth.login, {
        identifier: identity,
        password: password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;

        // save token for API calls
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);

        return { success: true, user };
      } else {
        return {
          success: false,
          message: res.data.message,
        };
      }
    } catch (err) {
      return {
        success: false,
        message: "Login failed",
      };
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role === "ADMIN",
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}