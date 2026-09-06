import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";
import { decodeToken } from "../utils/jwt";

const AuthContext = createContext(null);

const loadUserFromStorage = () => {
  const token = localStorage.getItem("token");
  return token ? decodeToken(token) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUserFromStorage);

  const applyToken = (token) => {
    localStorage.setItem("token", token);
    setUser(decodeToken(token));
  };

  const register = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/register", { email, password });
    applyToken(data.token);
  }, []);

  const login = useCallback(async (email, password, totpCode) => {
    const { data } = await api.post("/auth/login", { email, password, totpCode });
    applyToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const upgradeToHost = useCallback(async () => {
    const { data } = await api.post("/auth/upgrade-to-host");
    applyToken(data.token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, upgradeToHost }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
