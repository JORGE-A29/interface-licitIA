import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../styles/navbar.css';

const ProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { icon, label: 'Mi Perfil', action: () => navigate('/profile') },
    { icon, label: 'Configuración', action: () => navigate('/settings') },
    { icon, label: 'Seguridad', action: () => navigate('/security') },
  ];

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      {/* User Info */}
      <div className="dropdown-header">
        <div className="avatar-large">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="user-name">{user?.name || 'Usuario'}</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>

      <div className="dropdown-divider" />

      {/* Menu Items */}
      <div className="dropdown-menu">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="dropdown-item"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="dropdown-divider" />

      {/* Logout */}
      <button className="dropdown-item danger" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;
