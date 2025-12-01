import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../api'

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      API.get('/auth/me').then(res => setUser(res.data)).catch(()=>{});
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(){ return useContext(AuthContext); }
