import React, { createContext, useContext, useState } from 'react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notif, setNotif] = useState({
    nuevasLicitaciones: true,
    resultadosAnalisis: true,
    recordatoriosCierre: true,
    actualizacionesSistema: false,
    resumenSemanal: true,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, tipo: 'licitacion', mensaje: 'Nueva licitación disponible en tu sector', leido: false, fecha: new Date() },
    { id: 2, tipo: 'analisis',   mensaje: 'Análisis completado: probabilidad 78%',    leido: false, fecha: new Date() },
    { id: 3, tipo: 'cierre',     mensaje: 'Cierre en 48h: Contrato SENA Regional',    leido: false, fecha: new Date() },
  ]);

  const noLeidos = alerts.filter(a => !a.leido).length;

  const marcarLeido = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, leido: true } : a));
  const marcarTodosLeidos = () => setAlerts(prev => prev.map(a => ({ ...a, leido: true })));

  return (
    <NotificationsContext.Provider value={{ notif, setNotif, alerts, noLeidos, marcarLeido, marcarTodosLeidos }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);