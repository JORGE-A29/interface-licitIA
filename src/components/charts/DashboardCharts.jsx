import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import '../styles/charts.css';

const monthlyData = [
  { month: 'Ene', licitaciones: 12, exitosas: 9 },
  { month: 'Feb', licitaciones: 18, exitosas: 14 },
  { month: 'Mar', licitaciones: 15, exitosas: 12 },
  { month: 'Abr', licitaciones: 22, exitosas: 18 },
  { month: 'May', licitaciones: 25, exitosas: 21 },
  { month: 'Jun', licitaciones: 28, exitosas: 24 },
];

const categoryData = [
  { name: 'Infraestructura', value: 35 },
  { name: 'Servicios',       value: 30 },
  { name: 'Suministros',     value: 20 },
  { name: 'Tecnología',      value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const DashboardCharts = () => {
  return (
    <div className="charts-container">
      <div className="chart-card">
        <div className="chart-header">
          <h3>Actividad Mensual</h3>
          <span className="chart-period">Últimos 6 meses</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="licitaciones" stroke="#3b82f6" name="Licitaciones" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            <Line type="monotone" dataKey="exitosas" stroke="#10b981" name="Exitosas" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>Distribución por Categoría</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}%`}
              outerRadius={80} fill="#8884d8" dataKey="value">
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card full-width">
        <div className="chart-header">
          <h3>Tasa de Éxito por Mes</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="exitosas" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;