// src/pages/Servicios.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

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
  const { usuario, cargando } = useAuth(); // Extraemos 'cargando' del contexto
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

  // DETECCIÓN DE ADMIN MEJORADA
  const nombreMinuscula = (usuario?.nombre || (usuario as any)?.email || '').toLowerCase();
  const esAdmin = nombreMinuscula === 'fernando' || nombreMinuscula === 'angel' || nombreMinuscula === 'admin@piercings.com';

  // CORREGIDO: ESCUCHAR EN TIEMPO REAL CON PROTECCIÓN DE SESIÓN Y RESPALDO LOCAL BLINDADO
  useEffect(() => {
    if (!usuario) return; // Detener si no ha cargado la sesión en el navegador

    try {
      const q = query(collection(db, 'servicios'));
      
      const desuscribir = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const listaServicios = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Servicio[];
          setServicios(listaServicios);
          // Guardamos copia de seguridad local
          localStorage.setItem('respaldo_servicios_cloud', JSON.stringify(listaServicios));
        } else {
          // Si Firestore responde vacío pero tenemos datos locales, usamos el respaldo
          const locales = localStorage.getItem('respaldo_servicios_cloud');
          if (locales) setServicios(JSON.parse(locales));
        }
      }, (err) => {
        console.warn("Firestore falló, usando respaldo local seguro:", err);
        cargarRespaldoLocal();
      });

      return () => desuscribir();
    } catch (e) {
      cargarRespaldoLocal();
    }
  }, [usuario]); // Se vuelve a activar inmediatamente cuando 'usuario' esté listo

  const cargarRespaldoLocal = () => {
    const locales = localStorage.getItem('respaldo_servicios_cloud');
    if (locales) {
      setServicios(JSON.parse(locales));
    }
  };

  // BLINDAJE VISUAL: Si Firebase está revisando la sesión activa, congelamos la pantalla en negro
  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121214', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#e50914' }}>⚡ Sincronizando inventario de Ink & Needle...</h2>
      </div>
    );
  }

  // REGISTRAR SERVICIO / JOYA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoServicio.trim() || !zona.trim() || !precio.trim() || !accesorio.trim() || !stockInsumo.trim()) {
      setError('Todos los campos obligatorios deben ser completados.');
      return;
    }

    const nuevoItem = {
      tipoServicio: tipoServicio.trim(),
      zona: zona.trim(),
      precio: Number(precio),
      accesorio: accesorio.trim(),
      descuento: Number(descuento) || 0,
      stockInsumo: Number(stockInsumo),
    };

    try {
      // 1. Intentar guardar en Firestore (Nube)
      await addDoc(collection(db, 'servicios'), {
        ...nuevoItem,
        fechaRegistro: new Date()
      });
    } catch (err) {
      console.error("Error al guardar en la nube, guardando localmente...", err);
    }

    // 2. FORCE GUARDA LOCAL: Nos aseguramos de que se guarde de inmediato en el navegador pase lo que pase
    const itemLocal: Servicio = { id: crypto.randomUUID(), ...nuevoItem };
    const listaActualizada = [...servicios, itemLocal];
    setServicios(listaActualizada);
    localStorage.setItem('respaldo_servicios_cloud', JSON.stringify(listaActualizada));

    // Limpiar formulario
    setTipoServicio('');
    setZona('');
    setPrecio('');
    setAccesorio('');
    setDescuento('0');
    setStockInsumo('');
    setError('');
  };

  // ELIMINAR REGISTRO
  const handleEliminar = async (id: string) => {
    if (!esAdmin) {
      alert('Error: No tienes permisos de Administrador.');
      return;
    }
    if (window.confirm('¿Deseas eliminar este registro permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'servicios', id));
      } catch (err) {
        console.error("No se pudo borrar en la nube, borrando localmente");
      }
      
      const listaFiltrada = servicios.filter(s => s.id !== id);
      setServicios(listaFiltrada);
      localStorage.setItem('respaldo_servicios_cloud', JSON.stringify(listaFiltrada));
    }
  };

  const serviciosFiltrados = servicios.filter(s =>
    s.tipoServicio?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.zona?.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.accesorio?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121214', color: '#e1e1e6', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR CORREGIDO Y ACTUALIZADO */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1e', borderRight: '1px solid #29292e', padding: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: '40px' }}>
          INK & <span style={{ color: '#e50914' }}>NEEDLE</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/dashboard" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>Panel Principal</Link>
          <Link to="/citas" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>📅 Agenda de Citas</Link>
          <Link to="/clientes" style={{ padding: '12px 15px', color: '#a8a8b3', textDecoration: 'none' }}>👥 Fichas Clínicas</Link>
          <Link to="/servicios" style={{ padding: '12px 15px', color: '#fff', backgroundColor: '#29292e', textDecoration: 'none', borderRadius: '6px', borderLeft: '4px solid #e50914', fontWeight: 'bold' }}>💎 Catálogo e Inventario</Link>
        </nav>
      </div>

      <main style={{ flex: 1, padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0 }}>💎 Catálogo Comercial de Servicios e Inventario</h2>
          <input 
            type="text" 
            placeholder="🔍 Buscar servicio o joya..." 
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '8px 14px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '6px' }}
          />
        </div>

        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#fff', marginTop: 0 }}>Registrar Procedimiento y Joyería</h3>
          {error && <p style={{ color: '#e50914' }}>⚠️ {error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <input type="text" placeholder="Procedimiento (Ej: Septum Piercing)" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Ubicación Corporal" value={zona} onChange={e => setZona(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Precio ($)" value={precio} onChange={e => setPrecio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="text" placeholder="Joya Asociada (Insumo)" value={accesorio} onChange={e => setAccesorio(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Descuento ($)" value={descuento} onChange={e => setDescuento(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <input type="number" placeholder="Stock Inicial Vitrina" value={stockInsumo} onChange={e => setStockInsumo(e.target.value)} style={{ padding: '10px', backgroundColor: '#202024', border: '1px solid #29292e', color: '#fff', borderRadius: '4px' }} />
            <button type="submit" style={{ gridColumn: '1 / span 3', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              💾 Registrar en Sistema y Vitrina
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#1a1a1e', border: '1px solid #29292e', padding: '20px', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #29292e' }}>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Procedimiento</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Ubicación</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Precio Base</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Joya Insumo</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Vitrina</th>
                <th style={{ color: '#7c7c8a', paddingBottom: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px 0', color: '#7c7c8a', textAlign: 'center' }}>No se encontraron registros en el catálogo.</td>
                </tr>
              ) : (
                serviciosFiltrados.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #202024' }}>
                    <td style={{ padding: '12px 0', color: '#fff' }}><strong>{s.tipoServicio}</strong></td>
                    <td style={{ padding: '12px 0', color: '#c4c4cc' }}>{s.zona}</td>
                    <td style={{ padding: '12px 0', color: '#fff' }}>${s.precio?.toLocaleString('es-CL')}</td>
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
                        <button onClick={() => handleEliminar(s.id)} style={{ backgroundColor: 'transparent', color: '#e50914', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                      ) : (
                        <span style={{ color: '#50505a', fontSize: '13px' }}>🔒 Bloqueado</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
