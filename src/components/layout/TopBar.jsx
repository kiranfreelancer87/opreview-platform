import { useAuth } from '../../hooks/useAuth';
import { Bell, Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function TopBar({ title, breadcrumbs }) {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Left: Breadcrumbs / Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {breadcrumbs ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: 'var(--text-tertiary)' }}>/</span>}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 400 }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right: Search + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: searchFocused ? 'var(--surface-card)' : 'var(--surface-section)',
          border: `1px solid ${searchFocused ? 'var(--brand-primary)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)',
          transition: 'all var(--transition-fast)',
          width: searchFocused ? 280 : 200,
        }}>
          <Search size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search recordings..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              width: '100%',
            }}
          />
          <kbd style={{
            padding: '1px 5px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-sans)',
            lineHeight: 1.4,
          }}>
            /
          </kbd>
        </div>

        <button style={{
          width: 36, height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          position: 'relative',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-section)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            background: 'var(--status-danger)',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid var(--surface-card)',
          }} />
        </button>

        <button style={{
          width: 36, height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-section)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
