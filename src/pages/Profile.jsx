import React, { useState, useEffect } from 'react';
import { User, Building2, Hash, Mail, Edit3, Save, X, TrendingUp, Award, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
 
const fmtCurrency = (val) => {
  if (!val) return '$0';
  const n = parseFloat(val);
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString('es-CO')}`;
};
 
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];
 
const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', empresa: user?.empresa || '', nit: user?.nit || '' });
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
 
  const cargarPerfil = async () => {
    if (!user?.nit) return;
    setLoadingPerfil(true);
    setErrorPerfil('');
    try {
      const res = await api.get(`/perfil/${user.nit}`);
      setPerfil(res.data.perfil);
    } catch (err) {
      setErrorPerfil(err.response?.data?.error || 'No se encontró historial en SECOP II para este NIT.');
    } finally {
      setLoadingPerfil(false);
    }
  };
 
  useEffect(() => { cargarPerfil(); }, [user?.nit]);
 
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/perfil', { nombre: form.name, empresa: form.empresa });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // fallback silencioso
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Mi Perfil</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Información de tu cuenta y rendimiento en SECOP II</p>
 
      {/* Tarjeta de datos personales */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Datos de la cuenta</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              <Edit3 size={14} /> Editar
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                <X size={14} /> Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                <Save size={14} /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>
 
        {saved && (
          <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            ✅ Perfil actualizado correctamente
          </div>
        )}
 
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700 }}>
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name || 'Usuario'}</div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{user?.email}</div>
          </div>
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: User, label: 'Nombre completo', key: 'name', editable: true },
            { icon: Mail, label: 'Correo electrónico', key: 'email', editable: false, value: user?.email },
            { icon: Building2, label: 'Empresa', key: 'empresa', editable: true },
            { icon: Hash, label: 'NIT', key: 'nit', editable: false },
          ].map(({ icon: Icon, label, key, editable, value }) => (
            <div key={key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                <Icon size={13} /> {label}
              </label>
              {editing && editable ? (
                <input
                  value={form[key] || ''}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #2563eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              ) : (
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 8, fontSize: 14, color: '#111827' }}>
                  {value || form[key] || user?.[key] || '—'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
 
      {/* Perfil SECOP II */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Perfil competitivo SECOP II</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Historial real de contratos públicos</p>
          </div>
          <button onClick={cargarPerfil} disabled={loadingPerfil}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            <RefreshCw size={14} style={{ animation: loadingPerfil ? 'spin 1s linear infinite' : 'none' }} />
            Actualizar
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
 
        {loadingPerfil ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Consultando SECOP II...</div>
        ) : errorPerfil ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
            <Award size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>{errorPerfil}</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>Verifica que el NIT registrado sea correcto.</p>
          </div>
        ) : perfil ? (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total contratos', value: perfil.resumen.total_contratos, color: '#2563eb' },
                { label: 'En ejecución', value: perfil.resumen.contratos_activos, color: '#10b981' },
                { label: 'Valor total', value: fmtCurrency(perfil.resumen.cuantia_total), color: '#f59e0b' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
 
            {/* Ciudades y Entidades */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                  <MapPin size={13} style={{ marginRight: 4 }} />Ciudades frecuentes
                </h4>
                {perfil.ciudades_activas.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 13 }}>{c.ciudad}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{c.cantidad} contratos</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
                  <Building2 size={13} style={{ marginRight: 4 }} />Principales entidades
                </h4>
                {perfil.entidades_frecuentes.map((e, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{e.entidad}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{e.contratos}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
            <TrendingUp size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>Agrega tu NIT para ver tu perfil competitivo.</p>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default Profile;