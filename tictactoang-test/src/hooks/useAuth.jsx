import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "1234abcd!";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(identity, password) {
    const normalizedIdentity = identity.trim().toLowerCase();

    if (normalizedIdentity === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: "admin-1",
        email: ADMIN_EMAIL,
        username: "admin",
        role: "admin",
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    const playerUser = {
      id: "player-1",
      email: normalizedIdentity.includes("@") ? normalizedIdentity : "player@example.com",
      username: normalizedIdentity.includes("@") ? normalizedIdentity.split("@")[0] : identity,
      role: "player",
    };

    setUser(playerUser);
    return { success: true, user: playerUser };
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role === "admin",
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