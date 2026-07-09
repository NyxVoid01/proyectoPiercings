// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { type Usuario } from '../types/index';

// ¡OJO AQUÍ! Asegúrate de que tenga los dos puntos y la diagonal: ../firebase
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Definimos qué datos y funciones compartirá el contexto con toda la app
interface AuthContextType {
  usuario: Usuario | null;
  cargando: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Proveedor que envolverá a la aplicación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // 2. Escuchamos en tiempo real si el usuario está logueado en Firebase
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Si Firebase encuentra una sesión activa, estructuramos nuestro objeto Usuario
        // Nota: Como por ahora el Login de Firebase solo da email, asignamos un rol por defecto
        setUsuario({
          id: firebaseUser.uid,
          nombre: firebaseUser.email || 'Usuario',
          rol: firebaseUser.email === 'admin@piercings.com' ? 'administrador' : 'perforador'
        });
      } else {
        // Si no hay sesión, el usuario es null
        setUsuario(null);
      }
      setCargando(false);
    });

    // Limpiamos el observador cuando el componente se desmonte
    return () => desuscribir();
  }, []);

  // 3. Función para cerrar sesión usando Firebase Auth
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

// Hook personalizado para consumir el contexto fácilmente en las páginas
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
