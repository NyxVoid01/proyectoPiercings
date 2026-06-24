
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'administrador' | 'perforador'>('perforador');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Por favor, ingresa tu nombre');
      return;
    }
    // Llama a la función global para guardar la sesión
    login(nombre, rol);
    alert(`¡Bienvenido/a al estudio, ${nombre}! Sesión iniciada como ${rol}.`);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Ink & Needle Studio 💉</h2>
      <h3>Iniciar Sesión (Intranet)</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Profesional:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Franco Martínez"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rol en el Estudio:</label>
          <select 
            value={rol} 
            onChange={(e) => setRol(e.target.value as 'administrador' | 'perforador')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="perforador">Perforador / Staff</option>
            <option value="administrador">Administrador del Local</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
};