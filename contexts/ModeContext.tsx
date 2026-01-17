import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';

type UserMode = 'traveler' | 'business';

interface ModeContextType {
  mode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>(() => {
    if (Platform.OS === 'web') {
      try {
        const stored = localStorage.getItem('user_mode');
        if (stored === 'traveler' || stored === 'business') {
          return stored;
        }
      } catch (e) {
        console.warn('Failed to read mode from storage', e);
      }
    }
    return 'traveler';
  });

  const toggleMode = () => {
    setModeState((prev) => {
      const newMode = prev === 'traveler' ? 'business' : 'traveler';
      if (Platform.OS === 'web') localStorage.setItem('user_mode', newMode);
      return newMode;
    });
  };

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    if (Platform.OS === 'web') localStorage.setItem('user_mode', newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
