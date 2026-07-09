// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { type Usuario } from '../types/index';

import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUsuario({
          id: firebaseUser.uid,
          nombre: firebaseUser.email || 'Usuario',
          rol: firebaseUser.email === 'admin@piercings.com' ? 'administrador' : 'perforador'
        });
      } else {
        setUsuario(null);
      }
      setCargando(false); // Avisa a la app que Firebase ya terminó de revisar la sesión
    });

    return () => desuscribir();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
