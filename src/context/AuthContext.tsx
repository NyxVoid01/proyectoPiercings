
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { type Usuario } from '../types/index';

// 1. Definimos qué datos y funciones compartirá el contexto con toda la app
interface AuthContextType {
  usuario: Usuario | null;
  login: (nombre: string, rol: 'administrador' | 'perforador') => void;
  logout: () => void;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Componente Proveedor que envolverá a la aplicación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, verificamos si ya había una sesión iniciada en localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('ink_needle_sesion');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  // Función para iniciar sesión (Guarda en estado y en localStorage)
  const login = (nombre: string, rol: 'administrador' | 'perforador') => {
    const nuevoUsuario: Usuario = {
      id: crypto.randomUUID(),
      nombre,
      rol
    };
    setUsuario(nuevoUsuario);
    localStorage.setItem('ink_needle_sesion', JSON.stringify(nuevoUsuario));
  };

  // Función para cerrar sesión (Limpia el estado y el localStorage)
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('ink_needle_sesion');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para consumir el contexto fácilmente en las páginas
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};