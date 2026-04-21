import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clear any old localStorage sessions on load (migration cleanup)
        localStorage.removeItem('user');

        // Only restore from sessionStorage — clears on tab/browser close
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
            setUser(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
            setUser(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            return res.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData };
        setUser(merged);
        sessionStorage.setItem('user', JSON.stringify(merged));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
