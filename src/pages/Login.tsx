import React, { useState } from 'react';
// 1. Importamos la función de login de Firebase y la instancia de auth
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const Login: React.FC = () => {
  // Cambiamos los estados para manejar email y contraseña reales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      setError('');
      setCargando(true);
      
      // 2. Intentamos iniciar sesión en Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Si sale bien, AuthContext detectará el cambio automáticamente 
      // y App.tsx te redirigirá directo al Dashboard.
    } catch (err: any) {
      console.error(err);
      // Personalizamos un poco los errores comunes de Firebase
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '12px', background: 'var(--code-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', textAlign: 'left' }}>
        <h2 style={{ fontSize: '26px', marginBottom: '6px', color: 'var(--text-h)' }}>Studio Piercing Intranet</h2>
        <p style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text)' }}>Inicia sesión para gestionar el estudio.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500', color: 'var(--text-h)' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              placeholder="Ej: admin@piercings.com"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: '500', color: 'var(--text-h)' }}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)', boxSizing: 'border-box' }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0' }}>⚠️ {error}</p>}

          <button 
            type="submit" 
            disabled={cargando}
            style={{ 
              padding: '12px', 
              borderRadius: '6px', 
              border: 'none', 
              background: 'var(--accent)', 
              color: '#fff', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: cargando ? 'not-allowed' : 'pointer', 
              marginTop: '8px',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};
