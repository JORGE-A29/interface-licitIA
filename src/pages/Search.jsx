import React, { useState } from 'react';
import { Search as SearchIcon, Filter, ExternalLink, DollarSign, MapPin, Calendar } from 'lucide-react';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ estado: '', modalidad: '', municipio: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

const handleSearch = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSearched(true);
  try {
    const params = {};
    if (query) params.descripcion = query;
    if (filters.municipio) params.municipio = filters.municipio;
    if (filters.estado) params.estado = filters.estado;

    const response = await api.get('/licitaciones', { params });
    setResults(response.data.licitaciones || []);
  } catch (err) {
    console.error('Error:', err.response?.data);
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  const fmtCurrency = (val) => {
    if (!val) return 'No disponible';
    const n = parseFloat(val);
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    return `$${n.toLocaleString('es-CO')}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Buscar Licitaciones</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Consulta licitaciones activas en el SECOP II</p>

      <form onSubmit={handleSearch} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <SearchIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Buscar por descripción..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <select value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))}
            style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14 }}>
            <option value="">Todos</option>
            <option value="En ejecución">En ejecución</option>
            <option value="terminado">Terminado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Suspendido">Suspendido</option>
            <option value="Prorrogado">Prorrogado</option>
            <option value="Modificado">Modificado</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <input
            type="text"
            placeholder="Municipio"
            value={filters.municipio}
            onChange={e => setFilters(f => ({ ...f, municipio: e.target.value }))}
            style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, width: 160 }}
          />
          <button type="submit" disabled={loading}
            style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <SearchIcon size={16} />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>Consultando SECOP II...</p>}

      {!loading && searched && results.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No se encontraron resultados.</p>
      )}

      {!loading && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{results.length} resultado(s)</p>
          {results.map((lic, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.08)', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#111827' }}>
                    {lic.descripcion_del_proceso || lic.nombre_entidad || 'Sin título'}
                  </h3>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#6b7280' }}>
                    {lic.nombre_entidad && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {lic.nombre_entidad}
                      </span>
                    )}
                    {lic.municipio && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> {lic.municipio}
                      </span>
                    )}
                    {lic.precio_base && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <DollarSign size={13} /> {fmtCurrency(lic.precio_base)}
                      </span>
                    )}
                    {lic.fecha_de_cierre_del_proceso && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> Cierre: {lic.fecha_de_cierre_del_proceso?.split('T')[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
  <span style={{ padding: '4px 10px', background: lic.estado_contrato === 'Activo' ? '#d1fae5' : '#f3f4f6', color: lic.estado_contrato === 'Activo' ? '#065f46' : '#6b7280', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
    {lic.estado_contrato || 'Sin estado'}
  </span>
  {lic.urlproceso ? (
  <a 
    href={String(lic.urlproceso).startsWith('http') ? String(lic.urlproceso) : `https://${lic.urlproceso}`}
    target="_blank" 
    rel="noopener noreferrer"
    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
    <ExternalLink size={13} /> Ver en SECOP II
  </a>
) : lic.proceso_de_compra ? (
  <a 
    href={`https://community.secop.gov.co/Public/Tendering/OpportunityDetail/Index?noticeUID=${lic.proceso_de_compra}`}
    target="_blank" 
    rel="noopener noreferrer"
    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#2563eb', textDecoration: 'none' }}>
    <ExternalLink size={13} /> Ver en SECOP II
  </a>
) : null}
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
