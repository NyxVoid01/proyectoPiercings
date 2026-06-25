
// src/pages/Inventario.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ServicioItem {
  id: string;
  tipoServicio: string;
  zona: string;
  precio: number; // $
  accesorio: string; // Tipo de joya asociada
  descuento: number; // Descuento aplicable en pesos o porcentaje
  stockInsumo: number; // Cantidad disponible en vitrina (Punto 4 de requerimientos)
}

export const Inventario: React.FC = () => {
  const { usuario } = useAuth();
  const [servicios, setServicios] = useState<ServicioItem[]>([]);

  // Campos para el formulario del CRUD
  const [tipoServicio, setTipoServicio] = useState('');
  const [zona, setZona] = useState('');
  const [precio, setPrecio] = useState('');
  const [accesorio, setAccesorio] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [stockInsumo, setStockInsumo] = useState('');

  useEffect(() => {
    const guardados = localStorage.getItem('ink_needle_servicios_crud');
    if (guardados) {
      setServicios(JSON.parse(guardados));
    } else {
      const iniciales: ServicioItem[] = [
        { id: '1', tipoServicio: 'Perforación Helix', zona: 'Oreja (Cartílago)', precio: 25000, accesorio: 'Labret de Titanio', descuento: 0, stockInsumo: 45 },
        { id: '2', tipoServicio: 'Perforación Nostril', zona: 'Nariz', precio: 20000, accesorio: 'Argolla Nostril Oro', descuento: 2000, stockInsumo: 12 },
        { id: '3', tipoServicio: 'Perforación Navel', zona: 'Ombligo', precio: 30000, accesorio: 'Banana con Cristal', descuento: 0, stockInsumo: 8 }
      ];
      setServicios(iniciales);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(iniciales));
    }
  }, []);

  const handleCrearServicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoServicio || !zona || !precio || !accesorio || !stockInsumo) {
      alert('Por favor completa todos los campos del catálogo.');
      return;
    }

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

    // Limpiar formulario
    setTipoServicio('');
    setZona('');
    setPrecio('');
    setAccesorio('');
    setDescuento('0');
    setStockInsumo('');
    alert('¡Servicio e Insumo registrado correctamente!');
  };

  const handleEliminarServicio = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este servicio del catálogo?')) {
      const filtrados = servicios.filter(s => s.id !== id);
      setServicios(filtrados);
      localStorage.setItem('ink_needle_servicios_crud', JSON.stringify(filtrados));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#1e1e2f', color: 'white', padding: '20px' }}>
        <h3>Ink & Needle</h3>
        <p style={{ fontSize: '13px', color: '#a0a0b0' }}>Usuario: {usuario?.nombre}</p>
        <Link to="/dashboard" style={{ color: 'white', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>🏠 Volver al Inicio</Link>
        <Link to="/citas" style={{ color: '#d0d0d0', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>📅 Ver Citas</Link>
        <Link to="/clientes" style={{ color: '#d0d0d0', display: 'block', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
      </div>

      {/* Contenido Principal */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f6f9' }}>
        <h2>📦 CRUD - Catálogo de Servicios e Insumos en Vitrina</h2>

        {/* Formulario de Alta */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Añadir Nuevo Servicio / Joya</h3>
          <form onSubmit={handleCrearServicio} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label>Tipo Servicio *</label>
              <input type="text" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Perforación Septum" required />
            </div>
            <div>
              <label>Zona Anatómica *</label>
              <input type="text" value={zona} onChange={e => setZona(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Nariz / Oreja" required />
            </div>
            <div>
              <label>Precio ($) *</label>
              <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Precio base en $" required />
            </div>
            <div>
              <label>Accesorio / Joyería Relacionada *</label>
              <input type="text" value={accesorio} onChange={e => setAccesorio(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Ej: Argolla Titanio G23" required />
            </div>
            <div>
              <label>Descuento Aplicado ($)</label>
              <input type="number" value={descuento} onChange={e => setDescuento(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>Cantidad Disponible en Vitrina *</label>
              <input type="number" value={stockInsumo} onChange={e => setStockInsumo(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} placeholder="Stock actual" required />
            </div>
            <div style={{ gridColumn: '1 / span 3' }}>
              <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                💾 Guardar en Catálogo de Tienda
              </button>
            </div>
          </form>
        </div>

        {/* Tabla CRUD */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>Catálogo Activo</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Tipo Servicio</th>
                <th style={{ padding: '10px' }}>Zona</th>
                <th style={{ padding: '10px' }}>Precio Base ($)</th>
                <th style={{ padding: '10px' }}>Accesorio (Joya)</th>
                <th style={{ padding: '10px' }}>Descuento</th>
                <th style={{ padding: '10px' }}>Stock Vitrina</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.tipoServicio}</td>
                  <td style={{ padding: '10px' }}>{s.zona}</td>
                  <td style={{ padding: '10px' }}>${s.precio.toLocaleString('es-CL')}</td>
                  <td style={{ padding: '10px' }}>{s.accesorio}</td>
                  <td style={{ padding: '10px', color: s.descuento > 0 ? '#28a745' : 'inherit' }}>
                    {s.descuento > 0 ? `-$${s.descuento.toLocaleString('es-CL')}` : 'Sin desc.'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: s.stockInsumo <= 15 ? '#dc3545' : '#28a745',
                      backgroundColor: s.stockInsumo <= 15 ? '#f8d7da' : '#d4edda',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {s.stockInsumo} uds {s.stockInsumo <= 15 && '⚠️ (Stock Bajo)'}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => handleEliminarServicio(s.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Eliminar
                    </button>
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