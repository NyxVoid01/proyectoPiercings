
// src/pages/Inventario.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ServicioItem {
  id: string;
  tipoServicio: string;
  zona: string;
  precio: number;
  accesorio: string;
  descuento: number;
  stockInsumo: number;
}

// Listas predefinidas para los desplegables
const LISTA_PROCEDIMIENTOS = [
  "Perforación Helix",
  "Perforación Nostril",
  "Perforación Navel",
  "Septum Piercing",
  "Industrial Piercing",
  "Labret Piercing",
  "Perforación Tragus"
];

const LISTA_UBICACIONES = [
  "Oreja (Cartílago)",
  "Nariz",
  "Ombligo",
  "Septum (Tabique)",
  "Labio",
  "Ceja",
  "Oreja (Lóbulo)"
];

const LISTA_JOYAS = [
  "Labret de Titanio",
  "Argolla Nostril Oro",
  "Banana con Cristal",
  "Circular Barbell (Herradura)",
  "Barbell Recto Acero",
  "Argolla Clicker Titanio"
];

export const Inventario: React.FC = () => {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState<ServicioItem[]>([]);

  // Campos CRUD
  const [tipoServicio, setTipoServicio] = useState('');
  const [zona, setZona] = useState('');
  const [precio, setPrecio] = useState('');
  const [accesorio, setAccesorio] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [stockInsumo, setStockInsumo] = useState('');

  // DETECCIÓN DE PERMISOS DE ADMINISTRADOR
  const nombreMinuscula = usuario?.nombre?.toLowerCase() || '';
  const esAdmin = nombreMinuscula === 'fernando' || nombreMinuscula === 'angel' || nombreMinuscula === 'admin';

  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_servicios_crud');
    if (guardados) {
      setServicios(JSON.parse(guardados));
    } else {
      const iniciales: ServicioItem[] = [
        { id: '1', tipoServicio: 'Perforación Helix', zona: 'Oreja (Cartílago)', precio: 25000, accesorio: 'Labret de Titanio', descuento: 0, stockInsumo: 45 },
        { id: '2', tipoServicio: 'Perforación Nostril', zona: 'Nariz', precio: 20000, accesorio: 'Argolla Nostril Oro', descuento: 2000, stockInsumo: 12 },
        { id: '3', tipoServicio: 'Perforación Navel', zona: 'Ombligo', precio: 30000, accesorio: 'Banana con Cristal', descuento: 0, stockInsumo: 5 }
      ];
      setServicios(iniciales);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(iniciales));
    }
  }, []);

  const handleCrearServicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoServicio || !zona || !precio || !accesorio || !stockInsumo) return;

    const nuevoItem: ServicioItem = {
      id: crypto.randomUUID(),
      tipoServicio,
      zona,
      precio: Number(precio),
      accesorio,
      descuento: Number(descuento),
      stockInsumo: Number(stockInsumo)
    };

    const listaActualizada = [...servicios, nuevoItem];
    setServicios(listaActualizada);
    localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(listaActualizada));

    setTipoServicio('');
    setZona('');
    setPrecio('');
    setAccesorio('');
    setDescuento('0');
    setStockInsumo('');
  };

  const handleEliminarServicio = (id: string) => {
    if (!esAdmin) {
      alert('Acceso Denegado: Solo un administrador autorizado puede dar de baja servicios.');
      return;
    }
    if (window.confirm('¿Deseas quitar este servicio del catálogo comercial?')) {
      const filtrados = servicios.filter(s => s.id !== id);
      setServicios(filtrados);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(filtrados));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
          <Link to="/inventario" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>📦 Catálogo e Inventario</Link>
        </nav>
      </div>

      {/* CONTENIDO */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff' }}>📦 Control de Insumos y Servicios</h2>
          <span style={{ 
            fontSize: '12px', 
            padding: '5px 12px', 
            borderRadius: '12px', 
            backgroundColor: esAdmin ? 'rgba(40, 167, 69, 0.2)' : 'rgba(229, 9, 20, 0.2)', 
            color: esAdmin ? '#28a745' : '#e50914',
            fontWeight: 'bold'
          }}>
            Rol: {esAdmin ? '⚡ Administrador' : '🔒 Staff'}
          </span>
        </div>

        {/* FORMULARIO */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff' }}>Agregar Joya / Procedimiento</h3>
          <form onSubmit={handleCrearServicio} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            
            {/* DESPLEGABLE: Procedimiento */}
            <select 
              value={tipoServicio} 
              onChange={e => setTipoServicio(e.target.value)} 
              style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: tipoServicio ? '#fff' : '#7c7c8a', borderRadius: '4px', cursor: 'pointer' }} 
              required
            >
              <option value="" disabled>✨ Selecciona un Procedimiento</option>
              {LISTA_PROCEDIMIENTOS.map(opcion => (
                <option key={opcion} value={opcion} style={{ backgroundColor: '#1a1a1e', color: '#fff' }}>{opcion}</option>
              ))}
            </select>

            {/* DESPLEGABLE: Ubicación Corporal */}
            <select 
              value={zona} 
              onChange={e => setZona(e.target.value)} 
              style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: zona ? '#fff' : '#7c7c8a', borderRadius: '4px', cursor: 'pointer' }} 
              required
            >
              <option value="" disabled>📍 Selecciona Ubicación Corporal</option>
              {LISTA_UBICACIONES.map(opcion => (
                <option key={opcion} value={opcion} style={{ backgroundColor: '#1a1a1e', color: '#fff' }}>{opcion}</option>
              ))}
            </select>

            {/* INPUT: Precio */}
            <input type="number" placeholder="Precio ($)" value={precio} onChange={e => setPrecio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            
            {/* DESPLEGABLE: Joya Asociada */}
            <select 
              value={accesorio} 
              onChange={e => setAccesorio(e.target.value)} 
              style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: accesorio ? '#fff' : '#7c7c8a', borderRadius: '4px', cursor: 'pointer' }} 
              required
            >
              <option value="" disabled>💎 Selecciona Joya Asociada</option>
              {LISTA_JOYAS.map(opcion => (
                <option key={opcion} value={opcion} style={{ backgroundColor: '#1a1a1e', color: '#fff' }}>{opcion}</option>
              ))}
            </select>

            {/* INPUT: Descuento */}
            <input type="number" placeholder="Descuento ($)" value={descuento} onChange={e => setDescuento(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            
            {/* INPUT: Stock */}
            <input type="number" placeholder="Stock Inicial Vitrina" value={stockInsumo} onChange={e => setStockInsumo(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} required />
            
            <button type="submit" style={{ gridColumn: '1 / span 3', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              💾 Registrar en Sistema
            </button>
          </form>
        </div>

        {/* TABLA */}
        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Servicio</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Ubicación</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Precio Base</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Joya Insumo</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Vitrina</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '12px 0', color: '#fff', fontWeight: 'bold' }}>{s.tipoServicio}</td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{s.zona}</td>
                  <td style={{ padding: '12px 0', color: '#fff' }}>${s.precio.toLocaleString('es-CL')}</td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{s.accesorio}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: s.stockInsumo <= 15 ? '#feb700' : '#28a745',
                      backgroundColor: s.stockInsumo <= 15 ? 'rgba(254,183,0,0.1)' : 'rgba(40,167,69,0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      {s.stockInsumo} uds {s.stockInsumo <= 15 && '⚠️'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    {esAdmin ? (
                      <button onClick={() => handleEliminarServicio(s.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Eliminar
                      </button>
                    ) : (
                      <span style={{ color: '#50505a', fontSize: '13px' }}>🔒 Solo Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};