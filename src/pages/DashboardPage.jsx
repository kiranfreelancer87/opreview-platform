import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { recordings } from '../data/recordings';
import TopBar from '../components/layout/TopBar';
import {
  Play, Clock, CalendarDays, Video, TrendingUp, Star,
  ChevronRight, AlertTriangle, Eye
} from 'lucide-react';

const gradients = [
  'linear-gradient(135deg, #1e3a5f 0%, #0d4a4a 100%)',
  'linear-gradient(135deg, #2d1b4e 0%, #1e3a5f 100%)',
  'linear-gradient(135deg, #1a4a3a 0%, #0e2f3d 100%)',
  'linear-gradient(135deg, #3b2a1a 0%, #2d1b4e 100%)',
  'linear-gradient(135deg, #1a2d4a 0%, #0d3a3a 100%)',
  'linear-gradient(135deg, #2a3a1a 0%, #1a2d4a 100%)',
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Recordings', value: recordings.length, icon: Video, color: 'var(--brand-primary)', bg: 'var(--brand-primary-light)' },
    { label: 'Total Duration', value: '9h 43m', icon: Clock, color: 'var(--brand-secondary)', bg: 'var(--brand-secondary-light)' },
    { label: 'Total Views', value: '72', icon: Eye, color: 'var(--brand-accent)', bg: 'var(--brand-accent-light)' },
    { label: 'Avg. Rating', value: '4.85', icon: Star, color: '#f59e0b', bg: '#fef3cd' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Dashboard" />

      <div style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        {/* Welcome */}
        <div style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 4,
              letterSpacing: '-0.3px',
            }}>
              Welcome back, {user?.name?.split(' ').pop()}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
              {user?.course} &middot; {user?.location}
            </p>
          </div>
          <div style={{
            padding: '10px 18px',
            background: 'var(--status-warning-bg)',
            border: '1px solid #fcd34d',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'var(--text-warning)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
          }}>
            <AlertTriangle size={16} />
            Access expires April 15, 2026 &middot; {user?.daysRemaining} days remaining
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
            }}>
              <div style={{
                width: 44, height: 44,
                background: s.bg,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: s.color,
                flexShrink: 0,
              }}>
                <s.icon size={20} />
              </div>
              <div>
                <div style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recordings Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>
            Your Recordings
          </h2>
          <button
            onClick={() => navigate('/library')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 'var(--text-sm)',
              color: 'var(--brand-primary)',
              fontWeight: 500,
            }}
          >
            View Case Library
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Recording Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 20,
        }}>
          {recordings.map((rec, idx) => (
            <div
              key={rec.id}
              onClick={() => navigate(`/player/${rec.id}`)}
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--brand-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Thumbnail */}
              <div style={{
                height: 180,
                background: gradients[idx % gradients.length],
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Surgical ambiance overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,100,80,0.15), transparent)',
                }} />

                {/* Play button */}
                <div style={{
                  width: 52, height: 52,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  zIndex: 1,
                  transition: 'transform var(--transition-fast)',
                }}>
                  <Play size={22} fill="white" color="white" style={{ marginLeft: 2 }} />
                </div>

                {/* Duration badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 12,
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {rec.duration}
                </div>

                {/* HD + Difficulty */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 12,
                  display: 'flex',
                  gap: 6,
                }}>
                  <span style={{
                    background: 'var(--brand-primary)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '0.5px',
                  }}>
                    HD
                  </span>
                  <span style={{
                    background: rec.difficulty === 'Expert' ? 'rgba(220,38,38,0.85)' : rec.difficulty === 'Advanced' ? 'rgba(245,158,11,0.85)' : 'rgba(0,166,126,0.85)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'white',
                  }}>
                    {rec.difficulty}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{
                  fontSize: 'var(--text-md)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}>
                  {rec.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarDays size={13} />
                      {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>{rec.surgeon}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    color: '#f59e0b',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                  }}>
                    <Star size={13} fill="#f59e0b" />
                    {rec.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
