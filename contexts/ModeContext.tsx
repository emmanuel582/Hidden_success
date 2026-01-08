import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'traveler' | 'business';

interface ModeContextType {
  mode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>('traveler');

  const toggleMode = () => {
    setModeState((prev) => (prev === 'traveler' ? 'business' : 'traveler'));
  };

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
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
