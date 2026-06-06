import React, { useState } from 'react';
import { Bell, Monitor, Globe, Save, CheckCircle } from 'lucide-react';

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: value ? '#2563eb' : '#d1d5db', position: 'relative', transition: 'background .2s',
    }}>
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left .2s',
    }} />
  </button>
);
 
const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState({
    nuevasLicitaciones: true,
    resultadosAnalisis: true,
    recordatoriosCierre: true,
    actualizacionesSistema: false,
    resumenSemanal: true,
  });
  const [display, setDisplay] = useState({
    tema: 'claro',
    compacto: false,
    animaciones: true,
  });
  const [idioma, setIdioma] = useState('es');
 
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
 
  const Section = ({ title, icon: Icon, children }) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color="#2563eb" />
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
 
  const Row = ({ label, desc, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
 
  return (
    <div style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Configuración</h1>
          <p style={{ color: '#6b7280' }}>Personaliza tu experiencia en LicitIA</p>
        </div>
        <button onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          {saved ? <><CheckCircle size={16} /> Guardado</> : <><Save size={16} /> Guardar cambios</>}
        </button>
      </div>
 
      <Section title="Notificaciones" icon={Bell}>
        <Row label="Nuevas licitaciones" desc="Recibe alertas de licitaciones que coincidan con tu perfil">
          <Toggle value={notif.nuevasLicitaciones} onChange={v => setNotif(n => ({ ...n, nuevasLicitaciones: v }))} />
        </Row>
        <Row label="Resultados de análisis" desc="Notificación cuando un análisis ML esté listo">
          <Toggle value={notif.resultadosAnalisis} onChange={v => setNotif(n => ({ ...n, resultadosAnalisis: v }))} />
        </Row>
        <Row label="Recordatorios de cierre" desc="Alertas 48h antes del cierre de licitaciones guardadas">
          <Toggle value={notif.recordatoriosCierre} onChange={v => setNotif(n => ({ ...n, recordatoriosCierre: v }))} />
        </Row>
        <Row label="Resumen semanal" desc="Email con el resumen de actividad cada lunes">
          <Toggle value={notif.resumenSemanal} onChange={v => setNotif(n => ({ ...n, resumenSemanal: v }))} />
        </Row>
        <Row label="Actualizaciones del sistema" desc="Novedades y mejoras de la plataforma">
          <Toggle value={notif.actualizacionesSistema} onChange={v => setNotif(n => ({ ...n, actualizacionesSistema: v }))} />
        </Row>
      </Section>
 
      <Section title="Apariencia" icon={Monitor}>
        <Row label="Tema" desc="Selecciona el tema visual de la plataforma">
          <div style={{ display: 'flex', gap: 8 }}>
            {['claro', 'oscuro', 'sistema'].map(t => (
              <button key={t} onClick={() => setDisplay(d => ({ ...d, tema: t }))}
                style={{ padding: '6px 14px', borderRadius: 8, border: `2px solid ${display.tema === t ? '#2563eb' : '#e5e7eb'}`, background: display.tema === t ? '#eff6ff' : '#fff', color: display.tema === t ? '#2563eb' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Modo compacto" desc="Reduce el espaciado para ver más contenido">
          <Toggle value={display.compacto} onChange={v => setDisplay(d => ({ ...d, compacto: v }))} />
        </Row>
        <Row label="Animaciones" desc="Habilita transiciones y efectos visuales">
          <Toggle value={display.animaciones} onChange={v => setDisplay(d => ({ ...d, animaciones: v }))} />
        </Row>
      </Section>
 
      <Section title="Idioma y región" icon={Globe}>
        <Row label="Idioma de la plataforma" desc="Afecta textos de la interfaz">
          <select value={idioma} onChange={e => setIdioma(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
            <option value="es">Español (Colombia)</option>
            <option value="en">English</option>
          </select>
        </Row>
        <Row label="Formato de moneda" desc="Para mostrar valores de contratos">
          <div style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 14, color: '#374151' }}>
            COP — Peso colombiano
          </div>
        </Row>
        <Row label="Zona horaria" desc="Para fechas y recordatorios">
          <div style={{ padding: '8px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 14, color: '#374151' }}>
            America/Bogota (UTC-5)
          </div>
        </Row>
      </Section>
    </div>
  );
};
 
export default Settings;
