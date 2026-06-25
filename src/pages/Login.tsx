
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Simulación de autenticación exitosa para el entorno de desarrollo
    // Tu AuthContext original guardará el nombre ingresado
    login(nombre.trim(), 'administrador');
    
    // Redirigir al panel de control
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#121214', 
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: '#1a1a1e', 
        border: '1px solid #29292e', 
        borderRadius: '12px', 
        padding: '40px 30px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)' 
      }}>
        {/* LOGO */}
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          textAlign: 'center', 
          marginBottom: '8px', 
          letterSpacing: '1.5px' 
        }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <p style={{ 
          color: '#7c7c8a', 
          fontSize: '13px', 
          textAlign: 'center', 
          marginBottom: '30px' 
        }}>
          Intranet de Gestión Operativa
        </p>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(229, 9, 20, 0.1)', 
            color: '#e50914', 
            padding: '10px', 
            borderRadius: '6px', 
            fontSize: '13px', 
            marginBottom: '20px', 
            textAlign: 'center',
            border: '1px solid rgba(229, 9, 20, 0.2)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Nombre de Usuario / Profesional
            </label>
            <input 
              type="text" 
              placeholder="Ej: Fernando o Angel" 
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#202024', 
                border: '1px solid #29292e', 
                color: '#ffffff', 
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }} 
              required
            />
          </div>

          <div>
            <label style={{ color: '#a8a8b3', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
              Contraseña de Acceso
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#202024', 
                border: '1px solid #29292e', 
                color: '#ffffff', 
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }} 
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#e50914', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '14px',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
          >
            Entrar al Sistema
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '12px', color: '#50505a' }}>
          Permisos determinados según el perfil asignado al staff.
        </div>
      </div>
    </div>
  );
};