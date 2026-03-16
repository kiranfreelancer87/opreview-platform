import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 260;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} sidebarWidth={sidebarWidth} />
      <main style={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 300ms ease',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
