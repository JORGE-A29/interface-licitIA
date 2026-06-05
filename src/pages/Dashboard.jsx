import React, { useState, useEffect } from 'react';
import { Search, BarChart3, Building2, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import ActionCard from '../components/cards/ActionCard';
import StatsCard from '../components/cards/StatsCard';
import ActivityCard from '../components/cards/ActivityCard';
import DashboardCharts from '../components/charts/DashboardCharts';
import '../pages/styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [licitaciones, setLicitaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activitiesData, licitacionesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getActivities(),
          dashboardService.getRecentLicitaciones(),
        ]);
        setStats(statsData);
        setActivities(activitiesData);
        setLicitaciones(licitacionesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const actionCards = [
  {
    icon: Search,
    title: 'Buscar Licitaciones',
    description: 'Explora todas las licitaciones activas y disponibles en SECOP II',
    action: 'Buscar',
    path: '/search',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Analizar Licitación',
    description: 'Analiza cualquier licitación y obtén predicciones de éxito con IA',
    action: 'Analizar',
    path: '/analyze',
    color: 'success',
  },
  {
    icon: Building2,
    title: 'Mi Empresa',
    description: 'Gestiona tu empresa y visualiza tu historial competitivo',
    action: 'Gestionar',
    path: '/company',
    color: 'warning',
  },
  {
    icon: Zap,
    title: 'Asistente IA',
    description: 'Chatea con nuestro asistente de IA para resolver dudas sobre pliegos',
    action: 'Conversar',
    path: '/ai-assistant',
    color: 'info',
  },
];
  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div>
            <h1 className="welcome-title">
              {getGreeting()}, <span className="username">{user?.name || 'Usuario'}</span>
            </h1>
            <p className="welcome-subtitle">Bienvenido a tu panel de control de licitaciones</p>
          </div>
          <div className="welcome-date">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <section className="stats-section">
          <h2 className="section-title">Resumen Rápido</h2>
          <div className="stats-grid">
            <StatsCard
              icon={BarChart3}
              label="Licitaciones Analizadas"
              value={stats.analyzedLicitaciones}
              change={12}
              color="primary"
            />
            <StatsCard
              icon={TrendingUp}
              label="Tasa de Éxito"
              value={`${stats.successRate}%`}
              change={5}
              color="success"
            />
            <StatsCard
              icon={Search}
              label="Procesos Activos"
              value={stats.activeProcesses}
              change={-2}
              color="warning"
            />
            <StatsCard
              icon={AlertCircle}
              label="Alertas Pendientes"
              value={stats.alerts}
              change={0}
              color="danger"
            />
          </div>
        </section>
      )}

      {/* Action Cards Section */}
      <section className="actions-section">
        <h2 className="section-title">¿Qué deseas hacer?</h2>
        <div className="actions-grid">
          {actionCards.map((card, index) => (
            <ActionCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Recent Licitaciones and Activities */}
      <section className="content-section">
        <div className="content-grid">
          {/* Recent Licitaciones */}
          <div className="content-card">
            <div className="content-header">
              <h3>Licitaciones Recientes</h3>
              <button className="see-all">Ver todas</button>
            </div>
            {licitaciones.length > 0 ? (
              <div className="licitaciones-list">
                {licitaciones.map((lic) => (
                  <div key={lic.id} className="licitacion-item">
                    <div className="licitacion-info">
                      <p className="licitacion-title">{lic.title}</p>
                      <div className="licitacion-meta">
                        <span className={`status status-${lic.status}`}>{lic.status}</span>
                        <span className="success-rate">{lic.successRate}% éxito</span>
                      </div>
                    </div>
                    {lic.amount && <span className="amount">${lic.amount.toLocaleString()}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay licitaciones recientes</p>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="content-card">
            <div className="content-header">
              <h3>Actividad Reciente</h3>
              <button className="see-all">Ver todas</button>
            </div>
            {activities.length > 0 ? (
              <div className="activities-list">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
