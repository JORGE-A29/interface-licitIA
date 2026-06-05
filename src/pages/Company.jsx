import React, { useState, useEffect } from 'react';
import { Building2, Search, ExternalLink, Briefcase, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import './styles/Company.css';
 

 

 

 
const MOCK_COMPANY = {
  name: 'PRUEBA',
  nit: '123456',
  totalContratos: 15,
  enEjecucion: 1,
  valorTotal: 1300000000,
  valorPromedio: 98500000,
};
 
const CONTRACT_TYPES = [
  { name: 'Prestación de servicios', value: 10, color: '#2563eb', max: 10 },
  { name: 'Otro',                    value: 3,  color: '#7c3aed', max: 10 },
  { name: 'Consultoría',             value: 1,  color: '#ec4899', max: 10 },
  { name: 'Obra',                    value: 1,  color: '#f59e0b', max: 10 },
];
 
const CITIES = [
  { name: 'Bogotá',      contratos: 8, color: '#10b981' },
  { name: 'Ibagué',      contratos: 2, color: '#06b6d4' },
  { name: 'Chigorodó',   contratos: 1, color: '#8b5cf6' },
  { name: 'Bucaramanga', contratos: 1, color: '#f59e0b' },
  { name: 'No Definido', contratos: 1, color: '#6366f1' },
];

const ENTITIES = [
  { name: 'DEPARTAMENTO NACIONAL DE PLANEACIÓN',        contratos: 6, color: '#2563eb' },
  { name: 'PERSONERÍA MUNICIPAL DE IBAGUE',             contratos: 2, color: '#10b981' },
  { name: 'MUNICIPIO DE CHIGORODO',                     contratos: 1, color: '#f59e0b' },
  { name: 'DEPARTAMENTO DE SANTANDER',                  contratos: 1, color: '#06b6d4' },
  { name: 'Secretaría Distrital de Integración Social', contratos: 1, color: '#8b5cf6' },
];
 
function shortenNumber(n) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}
 
const Company = () => {
  const [nit, setNit] = useState('123456');
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const fetchData = async (nitValue) => {
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 700));
    setCompany({ ...MOCK_COMPANY, nit });
    setLoading(false);
  };
 
  useEffect(() => {
    fetchData(nit);
  }, []);
 
  const handleSearch = (e) => {
    e.preventDefault();
    if (nit.trim()) fetchData(nit.trim());
  };
 
  return (
    <div className="company-page">
      {/* Header */}
      <div className="company-header">
        <h1>Mi Empresa</h1>
        <p>Historial competitivo en el SECOP II basado en tu NIT</p>
      </div>
 
      {/* Search */}
      <form className="company-search-card" onSubmit={handleSearch}>
        <div className="company-search-row">
          <div className="company-search-field">
            <label>NIT de la empresa*</label>
            <div className="company-search-input-wrap">
              <Building2 size={16} />
              <input
                type="text"
                value={nit}
                onChange={e => setNit(e.target.value)}
                placeholder="Ej"
              />
            </div>
          </div>
          <button type="submit" className="company-search-btn" disabled={loading}>
            <Search size={16} />
            Consultar
          </button>
          <a
            href="https://www.secop.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            className="company-secop-btn"
          >
            <ExternalLink size={15} />
            Consultar SECOP II
          </a>
        </div>
      </form>
 
      {/* Loading */}
      {loading && (
        <div className="company-loading">
          <div className="spinner" />
          <span>Consultando información...</span>
        </div>
      )}
 
      {/* Company Info Banner */}
      {!loading && company && (
        <>
          <div className="company-info-banner">
            <div className="company-info-icon">
              <Building2 size={22} />
            </div>
            <div className="company-info-text">
              <h2>{company.name}</h2>
              <p>NIT {company.nit}</p>
            </div>
          </div>
 
          {/* Stats */}
          <div className="company-stats-grid">
            <div className="company-stat-card">
              <div className="company-stat-icon blue">
                <Briefcase size={20} />
              </div>
              <div className="company-stat-value blue">{company.totalContratos}</div>
              <div className="company-stat-label">Total Contratos</div>
            </div>
            <div className="company-stat-card">
              <div className="company-stat-icon green">
                <TrendingUp size={20} />
              </div>
              <div className="company-stat-value green">{company.enEjecucion}</div>
              <div className="company-stat-label">En Ejecución</div>
            </div>
            <div className="company-stat-card">
              <div className="company-stat-icon orange">
                <DollarSign size={20} />
              </div>
              <div className="company-stat-value orange">{shortenNumber(company.valorTotal)}</div>
              <div className="company-stat-label">Valor Total</div>
            </div>
            <div className="company-stat-card">
              <div className="company-stat-icon purple">
                <BarChart2 size={20} />
              </div>
              <div className="company-stat-value purple">{shortenNumber(company.valorPromedio)}</div>
              <div className="company-stat-label">Valor Promedio</div>
            </div>
          </div>
 
          {/* Charts */}
          <div className="company-charts-grid">
            {/* Contract Types */}
            <div className="company-chart-card">
              <h3>Tipos de contrato</h3>
              <p className="subtitle">Distribución por categoría</p>
              <div className="bar-list">
                {CONTRACT_TYPES.map((item, i) => (
                  <div className="bar-item" key={i}>
                    <div className="bar-header">
                      <span className="bar-label">{item.name}</span>
                      <span className="bar-count">{item.value}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.value / item.max) * 100}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Cities */}
            <div className="company-chart-card">
              <h3>Ciudades frecuentes</h3>
              <p className="subtitle">Contratos por ubicación</p>
              <div className="entity-list">
                {CITIES.map((city, i) => (
                  <div className="entity-item" key={i}>
                    <div className="entity-left">
                      <div className="entity-dot" style={{ background: city.color }} />
                      <span className="entity-name">{city.name}</span>
                    </div>
                    <span className="entity-contracts">{city.contratos}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Entities */}
            <div className="company-chart-card">
              <h3>Entidades frecuentes</h3>
              <p className="subtitle">Principales compradores</p>
              <div className="entity-list">
                {ENTITIES.map((entity, i) => (
                  <div className="entity-item" key={i}>
                    <div className="entity-left">
                      <div className="entity-dot" style={{ background: entity.color }} />
                      <span className="entity-name">{entity.name}</span>
                    </div>
                    <span className="entity-contracts">{entity.contratos} contratos</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
 
export default Company;