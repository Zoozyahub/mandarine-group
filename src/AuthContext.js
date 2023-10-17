import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sessionToken', userData.sessionToken);
  };

  const logout = () => {
    axios.get('http://localhost:8080/logout')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    setUser(null);
    localStorage.removeItem('sessionToken');
  };

  const isLoggedIn = user !== null;

  useEffect(() => {
    const storedSessionToken = localStorage.getItem('sessionToken');
    if (storedSessionToken) {
      axios.get('http://localhost:8080/api/user/current')
        .then(response => {
          login(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Ожидание завершения загрузки пользователя перед рендерингом дочерних компонентов
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
