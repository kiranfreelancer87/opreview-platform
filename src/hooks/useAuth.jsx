import { useState, useCallback, createContext, useContext } from 'react';
import { participantData } from '../data/recordings';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const stored = sessionStorage.getItem('opreview_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (participantId, accessCode) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (participantId && accessCode) {
      setUser(participantData);
      sessionStorage.setItem('opreview_user', JSON.stringify(participantData));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('opreview_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
