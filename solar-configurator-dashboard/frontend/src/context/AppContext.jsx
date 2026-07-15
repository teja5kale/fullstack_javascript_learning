import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('meters'); // 'meters' | 'feet'
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUnits = () =>
    setUnits((u) => (u === 'meters' ? 'feet' : 'meters'));

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const value = {
    projects,
    loading,
    error,
    refreshProjects,
    units,
    toggleUnits,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
