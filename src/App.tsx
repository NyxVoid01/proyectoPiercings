import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Importamos tanto el AuthProvider como el useAuth desde tu contexto
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { DetalleCliente } from './pages/DetalleCliente';
import { Citas } from './pages/Citas';
import { Servicios } from './pages/Servicios';

// Creamos un componente interno para no mezclar el proveedor con la lógica
function AppRoutes() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#121214',
        fontFamily: 'sans-serif',
        color: '#e50914'
      }}>
        <span>Cargando plataforma...</span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={usuario ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={usuario ? <Clientes /> : <Navigate to="/login" />} />
        <Route path="/clientes/:id" element={usuario ? <DetalleCliente /> : <Navigate to="/login" />} />
        <Route path="/citas" element={usuario ? <Citas /> : <Navigate to="/login" />} />
        <Route path="/servicios" element={usuario ? <Servicios /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

// El componente App principal ahora envuelve de forma segura toda la estructura con el AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
