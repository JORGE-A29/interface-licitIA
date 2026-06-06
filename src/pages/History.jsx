import React, { useState, useEffect } from 'react';
import { MessageSquare, BarChart3, ChevronRight, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const fmtFecha = (fecha) =>
  new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const fmtCurrency = (val) => {
  if (!val) return 'N/A';
  const n = parseFloat(val);
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString('es-CO')}`;
};

const History = () => {
  const [tab, setTab] = useState('predicciones');
  const [predicciones, setPredicciones] = useState([]);
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [predRes, convRes] = await Promise.all([
          api.get('/prediccion/mias'),
          api.get('/asistente/conversaciones'),
        ]);
        setPredicciones(predRes.data.predicciones || []);
        setConversaciones(convRes.data.conversaciones || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const retomarConversacion = (id) => {
    navigate(`/ai-assistant?conversacion=${id}`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Historial</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Registro de toda tu actividad en LicitIA</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
        {[
          { key: 'predicciones', label: 'Licitaciones Analizadas', icon: BarChart3 },
          { key: 'conversaciones', label: 'Conversaciones IA', icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', border: 'none', background: 'none',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              color: tab === key ? '#2563eb' : '#6b7280',
              borderBottom: tab === key ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: -2,
            }}>
            <Icon size={16} /> {label}
            <span style={{ background: tab === key ? '#dbeafe' : '#f3f4f6', color: tab === key ? '#2563eb' : '#6b7280', borderRadius: 20, padding: '2px 8px', fontSize: 12 }}>
              {key === 'predicciones' ? predicciones.length : conversaciones.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 8 }}>Cargando historial...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : tab === 'predicciones' ? (
        predicciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>No has analizado ninguna licitación todavía.</p>
            <button onClick={() => navigate('/analyze')}
              style={{ marginTop: 12, padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Analizar ahora
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {predicciones.map((p) => (
              <div key={p._id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', border: `1px solid ${p.probabilidad >= 0.5 ? '#d1fae5' : '#fef3c7'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {p.probabilidad >= 0.5
                        ? <TrendingUp size={18} color="#10b981" />
                        : <TrendingDown size={18} color="#f59e0b" />}
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{p.entidad}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#6b7280' }}>
                      <span>Sector: {p.sector}</span>
                      <span>Cuantía: {fmtCurrency(p.cuantia)}</span>
                      {p.municipio && <span>📍 {p.municipio}</span>}
                      {p.modalidad && <span>📋 {p.modalidad}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: '#9ca3af' }}>
                      <Clock size={12} /> {fmtFecha(p.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: p.probabilidad >= 0.5 ? '#10b981' : '#f59e0b' }}>
                      {Math.round(p.probabilidad * 100)}%
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>probabilidad</div>
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.probabilidad >= 0.5 ? '#d1fae5' : '#fef3c7', color: p.probabilidad >= 0.5 ? '#065f46' : '#92400e' }}>
                      {p.probabilidad >= 0.5 ? 'Viable' : 'Moderado'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        conversaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>No tienes conversaciones guardadas todavía.</p>
            <button onClick={() => navigate('/ai-assistant')}
              style={{ marginTop: 12, padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Iniciar conversación
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {conversaciones.map((c) => (
              <div key={c._id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <MessageSquare size={16} color="#6366f1" />
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{c.titulo}</h3>
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>
                    {c.mensajes?.length || 0} mensajes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
                    <Clock size={12} /> {fmtFecha(c.updatedAt)}
                  </div>
                </div>
                <button onClick={() => retomarConversacion(c._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#ede9fe', color: '#6366f1', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                  Retomar <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default History;