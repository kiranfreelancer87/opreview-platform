import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{
        flex: 1,
        marginLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transition: 'margin-left var(--transition-slow)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
