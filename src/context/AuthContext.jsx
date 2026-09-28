import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, storageEvents } from '../services/storageService';
import { DEMO_USERS } from '../constants/demoData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storageService.getCurrentUser());
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = storageEvents.on('auth_change', (updatedUser) => {
      setUser(updatedUser);
    });
    return () => unsubscribe();
  }, []);

  const switchRole = (role) => {
    const updated = storageService.switchRole(role);
    setUser(updated);
    setIsRoleModalOpen(false);
  };

  const updateUserProfile = (partialData) => {
    const updated = { ...user, ...partialData };
    storageService.setCurrentUser(updated);
    storageService.saveUser(updated);
    setUser(updated);
  };

  const login = (email, password) => {
    // Simple authentication logic with local database
    const users = storageService.getUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      storageService.setCurrentUser(existing);
      setUser(existing);
      return { success: true, user: existing };
    }
    // Create new student user if not found
    const newUser = {
      id: 'usr-' + Date.now(),
      role: 'student',
      name: email.split('@')[0],
      email,
      country: 'الجزائر',
      level: '2AS',
      stream: 'tech',
      specialization: 'meca',
      streamName: 'تقني رياضي',
      specializationName: 'هندسة ميكانيكية',
      streakDays: 1,
      studyMinutesToday: 0,
      studyMinutesWeek: 0,
      totalPoints: 100,
      levelProgress: 10,
    };
    storageService.saveUser(newUser);
    storageService.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const register = ({ name, email, password, role = 'student', level = '2AS', stream = 'tech', specialization = 'meca', streamName = 'تقني رياضي', specializationName = 'هندسة ميكانيكية' }) => {
    const newUser = {
      id: 'usr-' + Date.now(),
      role,
      name,
      email,
      country: 'الجزائر',
      level,
      stream,
      specialization,
      streamName,
      specializationName,
      streakDays: 1,
      studyMinutesToday: 0,
      studyMinutesWeek: 0,
      totalPoints: 100,
      levelProgress: 10,
      verificationStatus: role === 'teacher' ? 'pending' : undefined,
    };
    storageService.saveUser(newUser);
    storageService.setCurrentUser(newUser);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    // Reset to demo student
    switchRole('student');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isStudent: user?.role === 'student',
        isTeacher: user?.role === 'teacher',
        isParent: user?.role === 'parent',
        isAdmin: user?.role === 'admin',
        switchRole,
        updateUserProfile,
        login,
        register,
        logout,
        isRoleModalOpen,
        setIsRoleModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
