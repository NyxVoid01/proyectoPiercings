import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Servicio {
  id: string;
  tipoServicio: string;
  zona: string;
  precio: number;
  accesorio: string;
  descuento: number;
  stockInsumo: number;
}

export const Servicios: React.FC = () => {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Campos del formulario
  const [tipoServicio, setTipoServicio] = useState('');
  const [zona, setZona] = useState('');
  const [precio, setPrecio] = useState('');
  const [accesorio, setAccesorio] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [stockInsumo, setStockInsumo] = useState('');
  const [error, setError] = useState('');

  const nombreMinuscula = usuario?.nombre?.toLowerCase() || '';
  const esAdmin = nombreMinuscula === 'fernando' || nombreMinuscula === 'angel';

  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_servicios_crud');
    if (guardados) {
      setServicios(JSON.parse(guardados));
    } else {
      const iniciales: Servicio[] = [
        { id: '1', tipoServicio: 'Perforación Helix', zona: 'Oreja (Cartílago)', precio: 25000, accesorio: 'Aro Titanio Labret', descuento: 0, stockInsumo: 45 },
        { id: '2', tipoServicio: 'Perforación Nostril', zona: 'Nariz', precio: 22000, accesorio: 'Nostril de Neobio', descuento: 2000, stockInsumo: 12 }
      ];
      setServicios(iniciales);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(iniciales));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoServicio.trim() || !zona.trim() || !precio.trim() || !accesorio.trim() || !stockInsumo.trim()) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    const nuevo: Servicio = {
      id: crypto.randomUUID(),
      tipoServicio,
      zona,
      precio: Number(precio),
      accesorio,
      descuento: Number(descuento) || 0,
      stockInsumo: Number(stockInsumo)
    };

    const actualizados = [...servicios, nuevo];
    setServicios(actualizados);
    localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(actualizados));

    setTipoServicio('');
    setZona('');
    setPrecio('');
    setAccesorio('');
    setDescuento('0');
    setStockInsumo('');
    setError('');
  };

  const handleEliminar = (id: string) => {
    if (!esAdmin) {
      alert('Error: No tienes permisos de Administrador.');
      return;
    }
    if (window.confirm('¿Deseas eliminar este servicio?')) {
      const filtrados = servicios.filter(s => s.id !== id);
      setServicios(filtrados);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(filtrados));
    }
  };

  const serviciosFiltrados = servicios.filter(s =>
    s.tipoServicio.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.zona.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
          <Link to="/servicios" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>💎 Servicios</Link>
        </nav>
      </div>

      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>💎 Catálogo de Servicios y Joyería</h2>
          <input 
            type="text" 
            placeholder="🔍 Buscar servicio..." 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 14px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }}
          />
        </div>

        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff', marginTop: 0 }}>Agregar Nuevo Servicio</h3>
          {error && <p style={{ color: '#e50914' }}>⚠️ {error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Tipo de Servicio" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Zona Corporal" value={zona} onChange={e => setZona(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Precio ($)" value={precio} onChange={e => setPrecio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Joyería" value={accesorio} onChange={e => setAccesorio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Descuento ($)" value={descuento} onChange={e => setDescuento(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Stock Insumo" value={stockInsumo} onChange={e => setStockInsumo(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <button type="submit" style={{ gridColumn: '1 / span 3', padding: '12px', backgroundColor: '#e50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>💾 Registrar Servicio</button>
          </form>
        </div>

        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Servicio</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Zona</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Precio Base</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Stock</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #202024' }}>
                  <td style={{ padding: '12px 0', color: '#fff' }}><strong>{s.tipoServicio}</strong></td>
                  <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{s.zona}</td>
                  <td style={{ padding: '12px 0', color: '#fff' }}>${s.precio.toLocaleString('es-CL')}</td>
                  <td style={{ padding: '12px 0', color: '#28a745' }}>{s.stockInsumo} uds</td>
                  <td style={{ padding: '12px 0' }}>
                    {esAdmin ? (
                      <button onClick={() => handleEliminar(s.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                    ) : (
                      <span style={{ color: '#50505a' }}>🔒 Bloqueado</span>
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
