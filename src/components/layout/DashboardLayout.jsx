import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/dashboard-layout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado global del sidebar colapsado
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;