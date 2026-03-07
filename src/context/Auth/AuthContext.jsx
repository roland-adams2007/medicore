// AuthContext.js - Simplified version
import { createContext, useState, useRef, useEffect, useCallback } from "react";
import axiosInstance from "./../../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const hasFetchedUser = useRef(false);

  const getToken = () => localStorage.getItem("__accessToken");

  const clearSession = useCallback(() => {
    localStorage.removeItem("__accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  const fetchUserDetails = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoadingUser(false);
      hasFetchedUser.current = true;
      return;
    }

    // Prevent multiple simultaneous requests
    if (hasFetchedUser.current) return;

    try {
      setLoadingUser(true);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const { data } = await axiosInstance.get("/users/me");

      if (data?.data) {
        setUser(data.data);
        hasFetchedUser.current = true;
      } else {
        // Invalid data - clear session
        clearSession();
      }
    } catch (err) {
      console.error("Auth fetch error:", err);

      if (err.response?.status === 500) {
        clearSession();
        hasFetchedUser.current = true; // IMPORTANT: stop retry loop
      }

      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [clearSession]);

  const login = useCallback((userData, token) => {
    localStorage.setItem("__accessToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    hasFetchedUser.current = true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("__accessToken");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
      hasFetchedUser.current = false;
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (token && !hasFetchedUser.current) {
      fetchUserDetails();
    } else if (!token) {
      setUser(null);
      setLoadingUser(false);
      hasFetchedUser.current = true;
    }
  }, [fetchUserDetails]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };