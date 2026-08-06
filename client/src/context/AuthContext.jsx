import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('eventpro_session_user');
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) { sessionStorage.removeItem('eventpro_session_user'); }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        const loggedUser = res.data.user;
        setUser(loggedUser);
        sessionStorage.setItem('eventpro_session_user', JSON.stringify(loggedUser));
        return loggedUser;
    };

    const signup = async (email, password) => {
        const res = await axios.post('/api/auth/signup', { email, password });
        const newUser = res.data.user;
        setUser(newUser);
        sessionStorage.setItem('eventpro_session_user', JSON.stringify(newUser));
        return newUser;
    };

    const switchRole = (newRole) => {
        const roleLabel = newRole === 'admin' ? 'Super Admin' : 'Attendee / User';
        if (!user) {
            const guestUser = { id: 'usr-guest', email: `${newRole}@gatherly.com`, name: newRole === 'admin' ? 'System Administrator' : 'Guest Attendee', role: roleLabel };
            setUser(guestUser);
            sessionStorage.setItem('eventpro_session_user', JSON.stringify(guestUser));
            return;
        }
        const updatedUser = { ...user, role: roleLabel, name: newRole === 'admin' ? (user.name || 'System Admin') : (user.name || 'Attendee User') };
        setUser(updatedUser);
        sessionStorage.setItem('eventpro_session_user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('eventpro_session_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, switchRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
