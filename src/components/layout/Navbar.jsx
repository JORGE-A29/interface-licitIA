import React, { useState } from 'react';
import {
  Menu,
  Bell,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import ProfileDropdown from './ProfileDropdown';
import '../styles/navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { noLeidos, alerts, marcarLeido, marcarTodosLeidos } = useNotifications();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuToggle} title="Menú">
          <Menu size={24} />
        </button>
      </div>

      <div className="navbar-right">

        {/* Notificaciones */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" title="Notificaciones" onClick={() => setShowNotifications(p => !p)}>
            <Bell size={20} />
            {noLeidos > 0 && <span className="badge">{noLeidos}</span>}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: 44, width: 320,
              background: '#fff', borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,.12)',
              border: '1px solid #f3f4f6', zIndex: 100,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Notificaciones</span>
                {noLeidos > 0 && (
                  <button onClick={marcarTodosLeidos}
                    style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Marcar todas como leídas
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                    Sin notificaciones
                  </div>
                ) : (
                  alerts.map(a => (
                    <div key={a.id} onClick={() => marcarLeido(a.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '12px 16px', cursor: 'pointer',
                        background: a.leido ? '#fff' : '#eff6ff',
                        borderBottom: '1px solid #f9fafb',
                      }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: a.leido ? 'transparent' : '#2563eb',
                        marginTop: 6, flexShrink: 0,
                      }} />
                      <div>
                        <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{a.mensaje}</p>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>
                          {new Date(a.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mensajes */}
        <button className="icon-btn" title="Mensajes">
          <MessageSquare size={20} />
          <span className="badge">2</span>
        </button>

        {/* Perfil */}
        <div className="profile-section">
          <button className="profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-info">
              <span className="name">{user?.name || 'Usuario'}</span>
              <span className="email">{user?.email}</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showProfileDropdown ? 'open' : ''}`} />
          </button>

          {showProfileDropdown && (
            <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;