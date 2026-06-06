import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertCircle, Clock, Monitor } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
 
const Security = () => {
  const { user } = useAuth();
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
 
  const fortaleza = (pass) => {
    if (!pass) return { nivel: 0, texto: '', color: '#e5e7eb' };
    let score = 0;
    if (pass.length >= 8)  score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const niveles = [
      { nivel: 1, texto: 'Muy débil', color: '#ef4444' },
      { nivel: 2, texto: 'Débil',     color: '#f59e0b' },
      { nivel: 3, texto: 'Buena',     color: '#3b82f6' },
      { nivel: 4, texto: 'Fuerte',    color: '#10b981' },
    ];
    return niveles[score - 1] || { nivel: 0, texto: '', color: '#e5e7eb' };
  };
 
  const f = fortaleza(form.nueva);
 
  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.actual || !form.nueva || !form.confirmar) {
      return setError('Completa todos los campos.');
    }
    if (form.nueva !== form.confirmar) {
      return setError('Las contraseñas nuevas no coinciden.');
    }
    if (form.nueva.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres.');
    }
    setLoading(true);
    try {
      await api.put('/auth/password', { passwordActual: form.actual, passwordNueva: form.nueva });
      setSuccess('Contraseña actualizada correctamente.');
      setForm({ actual: '', nueva: '', confirmar: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };
 
  const sesiones = [
    { dispositivo: 'Chrome — Windows', ubicacion: 'Bogotá, Colombia', fecha: 'Ahora mismo', activa: true },
    { dispositivo: 'Chrome — Android', ubicacion: 'Bogotá, Colombia', fecha: 'Hace 2 días',  activa: false },
  ];
 
  const PasswordInput = ({ label, value, show, onToggle, onChange, placeholder }) => (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 40px 10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
        />
        <button type="button" onClick={onToggle}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
 
  return (
    <div style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Seguridad</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Administra tu contraseña y accesos</p>
 
      {/* Cambiar contraseña */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Cambiar contraseña</h2>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Usa una contraseña segura de al menos 8 caracteres</p>
          </div>
        </div>
 
        <form onSubmit={handleCambiarPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 14 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, padding: '10px 14px', color: '#065f46', fontSize: 14 }}>
              <CheckCircle size={16} /> {success}
            </div>
          )}
 
          <PasswordInput label="Contraseña actual" value={form.actual} show={showCurrent}
            onToggle={() => setShowCurrent(p => !p)} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))}
            placeholder="Tu contraseña actual" />
 
          <PasswordInput label="Nueva contraseña" value={form.nueva} show={showNew}
            onToggle={() => setShowNew(p => !p)} onChange={e => setForm(f => ({ ...f, nueva: e.target.value }))}
            placeholder="Mínimo 8 caracteres" />
 
          {form.nueva && (
            <div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= f.nivel ? f.color : '#e5e7eb' }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: f.color }}>{f.texto}</span>
            </div>
          )}
 
          <PasswordInput label="Confirmar nueva contraseña" value={form.confirmar} show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)} onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
            placeholder="Repite la nueva contraseña" />
 
          <button type="submit" disabled={loading}
            style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
 
      {/* Sesiones activas */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Monitor size={18} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Sesiones activas</h2>
        </div>
        {sesiones.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < sesiones.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Monitor size={20} color="#6b7280" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.dispositivo}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {s.fecha} · {s.ubicacion}
                </div>
              </div>
            </div>
            {s.activa ? (
              <span style={{ padding: '4px 10px', background: '#d1fae5', color: '#065f46', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Activa</span>
            ) : (
              <button style={{ padding: '4px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Cerrar
              </button>
            )}
          </div>
        ))}
      </div>
 
      {/* Info de cuenta */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Información de seguridad</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Correo de recuperación', value: user?.email },
            { label: 'Último acceso', value: 'Hoy' },
            { label: 'Estado de la cuenta', value: 'Activa y verificada' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default Security;