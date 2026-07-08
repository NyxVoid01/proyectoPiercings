import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [rol, setRol] = useState<'administrador' | 'perforador'>('administrador');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Por favor, ingresa tu nombre de usuario.');
      return;
    }

    login(username, rol);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '12px', background: 'var(--code-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textAlign: 'left' }}>
        <h2 style={{ fontSize: '26px', marginBottom: '6px', color: 'var(--text-h)' }}>Studio Piercing Intranet</h2>
        <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text)' }}>Inicia sesión para gestionar el estudio.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500', color: 'var(--text-h)' }}>Nombre de Usuario</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => { setUsername(e.target.value); if (error) setError(''); }}
              placeholder="Ej: Abby Villegas"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500', color: 'var(--text-h)' }}>Rol de Acceso</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value as 'administrador' | 'perforador')}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', boxSizing: 'border-box' }}
            >
              <option value="administrador">Administrador</option>
              <option value="perforador">Perforador / Staff</option>
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0' }}>⚠️ {error}</p>}

          <button type="submit" style={{ padding: '12px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};
