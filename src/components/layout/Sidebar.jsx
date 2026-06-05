import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Building2,
  Zap,
  History,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import '../styles/sidebar.css';

const Sidebar = ({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');

    if (saved) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, [setIsCollapsed]);

  const handleCollapse = () => {
    const newState = !isCollapsed;

    setIsCollapsed(newState);

    localStorage.setItem(
      'sidebarCollapsed',
      JSON.stringify(newState)
    );
  };

  const isActive = (path) =>
    location.pathname === path;

  const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',           path: '/dashboard' },
  { icon: Search,          label: 'Buscar Licitaciones', path: '/search' },
  { icon: BarChart3,       label: 'Analizar Licitación', path: '/analyze' },
  { icon: Building2,       label: 'Mi Empresa',          path: '/company' },
  { icon: Zap,             label: 'Asistente IA',        path: '/ai-assistant' },
  { icon: History,         label: 'Historial',           path: '/history' },
];

const bottomItems = [
  { icon: Settings,    label: 'Configuración', path: '/settings' },
  { icon: HelpCircle,  label: 'Ayuda',         path: '/help' },
];

  return (
    <div
      className={`sidebar-container ${
        isOpen ? 'open' : 'closed'
      } ${isCollapsed ? 'collapsed' : ''}`}
    >
      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isCollapsed ? 'collapsed' : ''
        }`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Zap size={24} />
          </div>

          {!isCollapsed && <h2>licitIA</h2>}

          <button
            className="collapse-btn"
            onClick={handleCollapse}
            title={
              isCollapsed
                ? 'Expandir'
                : 'Contraer'
            }
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                isActive(item.path)
                  ? 'active'
                  : ''
              }`}
              onClick={() => setIsOpen(false)}
              title={
                isCollapsed
                  ? item.label
                  : ''
              }
            >
              <item.icon size={20} />

              {!isCollapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="sidebar-bottom">
          <nav className="sidebar-nav">
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive(item.path)
                    ? 'active'
                    : ''
                }`}
                title={
                  isCollapsed
                    ? item.label
                    : ''
                }
              >
                <item.icon size={20} />

                {!isCollapsed && (
                  <span>{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setIsOpen(false)
          }
        />
      )}
    </div>
  );
};

export default Sidebar;