import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import '../styles/navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuToggle} title="Menú">
          <Menu size={24} />
        </button>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar licitaciones, empresas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <button className="icon-btn" title="Notificaciones">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        {/* Messages */}
        <button className="icon-btn" title="Mensajes">
          <MessageSquare size={20} />
          <span className="badge">2</span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-section">
          <button
            className="profile-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
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
