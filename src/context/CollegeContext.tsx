import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface College {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface CollegeContextType {
  selectedCollege: College;
  setSelectedCollege: (college: College) => void;
  colleges: College[];
}

const colleges: College[] = [
  {
    id: 'iit-delhi',
    name: 'IIT Delhi',
    logo: '🏛️',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    gradientFrom: '#3B82F6',
    gradientTo: '#8B5CF6'
  },
  {
    id: 'bits-pilani',
    name: 'BITS Pilani',
    logo: '🎓',
    primaryColor: '#EF4444',
    secondaryColor: '#DC2626',
    gradientFrom: '#EF4444',
    gradientTo: '#F97316'
  },
  {
    id: 'nit-trichy',
    name: 'NIT Trichy',
    logo: '⚡',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    gradientFrom: '#10B981',
    gradientTo: '#06B6D4'
  }
];

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};

interface CollegeProviderProps {
  children: ReactNode;
}

export const CollegeProvider: React.FC<CollegeProviderProps> = ({ children }) => {
  const [selectedCollege, setSelectedCollege] = useState<College>(colleges[0]);

  return (
    <CollegeContext.Provider 
      value={{
        selectedCollege,
        setSelectedCollege,
        colleges
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};