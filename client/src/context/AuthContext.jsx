import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("novaUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("novaToken") || null,
  );

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("novaUser", JSON.stringify(userData));
    localStorage.setItem("novaToken", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("novaUser");
    localStorage.removeItem("novaToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
