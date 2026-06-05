import api from './api';

const dashboardService = {
  async getStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch {
      return {
        analyzedLicitaciones: 0,
        successRate: 0,
        activeProcesses: 0,
        alerts: 0,
      };
    }
  },

  async getRecentLicitaciones() {
    try {
      const response = await api.get('/licitaciones?limite=5');
      return response.data.licitaciones || [];
    } catch {
      return [];
    }
  },

  async getActivities() {
    try {
      const response = await api.get('/prediccion/historial?limite=5');
      return (response.data.predicciones || []).map(p => ({
        id: p._id,
        title: p.descripcionProceso || 'Análisis de licitación',
        status: p.prediccion?.gano ? 'success' : 'warning',
        date: p.createdAt,
        result: `Probabilidad de éxito: ${Math.round((p.prediccion?.probabilidadExito || 0) * 100)}%`,
      }));
    } catch {
      return [];
    }
  },
};

export default dashboardService;
