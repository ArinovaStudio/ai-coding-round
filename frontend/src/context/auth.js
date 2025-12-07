import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    role: "",
  });

  //default axios
  axios.defaults.headers.common["Authorization"] = auth?.token ? `Bearer ${auth.token}` : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("user");
    
    if (token && role) {
      setAuth({
        user: user ? JSON.parse(user) : null,
        token: token,
        role: role,
      });
    }
    //eslint-disable-next-line
  }, []);

  // Login function
  const login = (token, role, user = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    setAuth({ user, token, role });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setAuth({ user: null, token: "", role: "" });
  };

  return (
    <AuthContext.Provider value={[auth, setAuth, login, logout]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };