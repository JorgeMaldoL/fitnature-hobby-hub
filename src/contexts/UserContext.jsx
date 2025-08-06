import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if user already exists in localStorage
    const savedUserId = localStorage.getItem('fitnature_user_id');

    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      // Generate new random user ID
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 15);
      setUserId(newUserId);
      localStorage.setItem('fitnature_user_id', newUserId);
    }
  }, []);

  const clearUser = () => {
    setUserId(null);
    localStorage.removeItem('fitnature_user_id');
  };

  return (
    <UserContext.Provider value={{
      userId,
      clearUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
