import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, Library, Shield,
  LogOut, ChevronLeft, ChevronRight, MonitorPlay
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/library', label: 'Case Library', icon: Library },
];

export default function Sidebar({ collapsed, setCollapsed, sidebarWidth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth,
        background: 'var(--surface-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 300ms ease',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Brand */}
        <div style={{
          padding: collapsed ? '20px 12px' : '20px 24px',
          borderBottom: '1px solid var(--border-sidebar)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 72,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--brand-primary), #4f46e5)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <MonitorPlay size={20} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: 'var(--text-inverse)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.2 }}>
                OpReview
              </div>
              <div style={{ color: 'var(--text-sidebar)', fontSize: 'var(--text-xs)' }}>
                Surgical Training Portal
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = location.pathname === item.path ||
              (item.path === '/dashboard' && location.pathname.startsWith('/player'));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '10px 12px' : '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: active ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                  background: active ? 'var(--surface-sidebar-active)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  fontSize: 'var(--text-sm)',
                  transition: 'all var(--transition-fast)',
                  width: '100%',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.background = 'var(--surface-sidebar-hover)';
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    background: 'var(--brand-primary)',
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <item.icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && item.label}
              </button>
            );
          })}

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              padding: collapsed ? '10px 8px' : '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 120, 212, 0.08)',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              whiteSpace: 'nowrap',
            }}>
              <Shield size={16} style={{ color: '#4ade80', flexShrink: 0 }} />
              {!collapsed && (
                <div>
                  <div style={{ color: '#4ade80', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Secure Session</div>
                  <div style={{ color: 'var(--text-sidebar)', fontSize: 'var(--text-xs)' }}>256-bit encrypted</div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* User */}
        <div style={{
          borderTop: '1px solid var(--border-sidebar)',
          padding: collapsed ? '16px 12px' : '16px 20px',
        }}>
          {!collapsed && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, whiteSpace: 'nowrap' }}>
              <div style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, var(--brand-secondary), #059669)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                flexShrink: 0,
              }}>
                {user.initials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: 'var(--text-inverse)', fontSize: 'var(--text-sm)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ color: 'var(--text-sidebar)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.id}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-sidebar)',
              fontSize: 'var(--text-sm)',
              width: collapsed ? 'auto' : '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-sidebar-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Collapse Toggle — outside aside so it's not clipped */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute',
          top: 80,
          right: -12,
          width: 24,
          height: 24,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 51,
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'right 300ms ease',
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
