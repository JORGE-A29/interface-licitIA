import React, { useState } from 'react';
import { BarChart3, Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Analyze = () => {
  const [form, setForm] = useState({
    descripcionProceso: '',
    cuantia: '',
    modalidad: 'Contratación directa',
    departamento: '',
    municipio: '',
    sector: '',
    nitProponente: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modalidades = [
    'Contratación directa',
    'Licitación pública',
    'Selección abreviada',
    'Concurso de méritos',
    'Mínima cuantía',
  ];

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cuantia || !form.modalidad) {
      setError('La cuantía y la modalidad son obligatorias.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const response = await api.post('/prediccion', {
        ...form,
        cuantia: parseFloat(form.cuantia),
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const pct = result ? Math.round((result.prediccion?.probabilidadExito || 0) * 100) : 0;
  const gano = result?.prediccion?.gano;

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Analizar Licitación</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Ingresa los datos de la licitación para obtener una predicción de éxito</p>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 14 }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { name: 'descripcionProceso', label: 'Descripción del proceso', placeholder: 'Ej: Suministro de equipos...', full: true },
              { name: 'cuantia', label: 'Cuantía (COP) *', placeholder: 'Ej: 50000000', type: 'number' },
              { name: 'nitProponente', label: 'NIT del proponente', placeholder: 'Ej: 900123456' },
              { name: 'departamento', label: 'Departamento', placeholder: 'Ej: Cundinamarca' },
              { name: 'municipio', label: 'Municipio', placeholder: 'Ej: Bogotá' },
              { name: 'sector', label: 'Sector', placeholder: 'Ej: Tecnología' },
            ].map(f => (
              <div key={f.name} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Modalidad *</label>
              <select name="modalidad" value={form.modalidad} onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}>
                {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ marginTop: 20, width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BarChart3 size={18} />
            {loading ? 'Analizando...' : 'Analizar con IA'}
          </button>
        </form>
      </div>

      {result && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,.08)', border: `2px solid ${gano ? '#10b981' : '#f59e0b'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            {gano
              ? <CheckCircle size={28} color="#10b981" />
              : <AlertCircle size={28} color="#f59e0b" />}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: gano ? '#065f46' : '#92400e' }}>
                {gano ? '✅ Alta probabilidad de éxito' : '⚠️ Probabilidad moderada'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Resultado del modelo Random Forest</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: gano ? '#10b981' : '#f59e0b' }}>{pct}%</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>probabilidad</div>
            </div>
          </div>

          {result.prediccion?.factoresImportantes?.length > 0 && (
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#374151' }}>Factores determinantes</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.prediccion.factoresImportantes.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#374151', minWidth: 180 }}>{f.feature}</span>
                    <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round(f.importancia * 100)}%`, background: '#2563eb', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#9ca3af', minWidth: 40 }}>{Math.round(f.importancia * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyze;
