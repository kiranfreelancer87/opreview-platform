import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordings, categories } from '../data/recordings';
import TopBar from '../components/layout/TopBar';
import {
  Play, Grid3X3, List, CalendarDays, Star, Search,
  Scissors, Wrench, PlusCircle, Maximize2, Settings,
  LayoutGrid, Filter, Clock, ChevronDown
} from 'lucide-react';

const catIcons = {
  all: LayoutGrid,
  osteotomy: Scissors,
  reconstruction: Wrench,
  augmentation: PlusCircle,
  distraction: Maximize2,
  joint: Settings,
};

const gradients = [
  'linear-gradient(135deg, #1e3a5f 0%, #0d4a4a 100%)',
  'linear-gradient(135deg, #2d1b4e 0%, #1e3a5f 100%)',
  'linear-gradient(135deg, #1a4a3a 0%, #0e2f3d 100%)',
  'linear-gradient(135deg, #3b2a1a 0%, #2d1b4e 100%)',
  'linear-gradient(135deg, #1a2d4a 0%, #0d3a3a 100%)',
  'linear-gradient(135deg, #2a3a1a 0%, #1a2d4a 100%)',
];

export default function LibraryPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let items = recordings;
    if (activeCategory !== 'all') items = items.filter(r => r.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.surgeon.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'date') items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'duration') items = [...items].sort((a, b) => b.durationSec - a.durationSec);
    return items;
  }, [activeCategory, searchQuery, sortBy]);

  const catCounts = useMemo(() => {
    const counts = { all: recordings.length };
    recordings.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Case Library" />

      <div style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        {/* Category Filter Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
          gap: 12,
          marginBottom: 24,
        }}>
          {categories.map(cat => {
            const Icon = catIcons[cat.key] || LayoutGrid;
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  background: active ? 'var(--brand-primary-light)' : 'var(--surface-card)',
                  border: `1px solid ${active ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-xl)',
                  padding: '18px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Icon size={20} style={{ color: active ? 'var(--brand-primary)' : 'var(--text-secondary)' }} />
                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--brand-primary)' : 'var(--text-primary)',
                }}>
                  {cat.name}
                </span>
                <span style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: active ? 'var(--brand-primary)' : 'var(--text-primary)',
                  lineHeight: 1,
                }}>
                  {catCounts[cat.key] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              flex: 1,
              maxWidth: 320,
            }}>
              <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search by title, surgeon, or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  width: '100%',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
            }}>
              <Filter size={14} style={{ color: 'var(--text-tertiary)' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  cursor: 'pointer',
                }}
              >
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}>
            <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 8px' }} />
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                { mode: 'grid', icon: Grid3X3 },
                { mode: 'list', icon: List },
              ].map(v => (
                <button
                  key={v.mode}
                  onClick={() => setViewMode(v.mode)}
                  style={{
                    width: 34, height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    color: viewMode === v.mode ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                    background: viewMode === v.mode ? 'var(--brand-primary-light)' : 'transparent',
                    border: viewMode === v.mode ? '1px solid var(--brand-primary-subtle)' : '1px solid transparent',
                  }}
                >
                  <v.icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((rec, idx) => (
              <RecordingCard key={rec.id} rec={rec} idx={idx} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((rec, idx) => (
              <div
                key={rec.id}
                onClick={() => navigate(`/player/${rec.id}`)}
                style={{
                  display: 'flex',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 200,
                  height: 120,
                  background: gradients[idx % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <Play size={24} fill="white" color="white" style={{ opacity: 0.7 }} />
                  <span style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 8,
                    background: 'rgba(0,0,0,0.6)',
                    padding: '2px 6px',
                    borderRadius: 3,
                    fontSize: 11,
                    color: 'white',
                    fontFamily: 'var(--font-mono)',
                  }}>{rec.duration}</span>
                </div>
                <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {rec.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 16, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <span>{rec.surgeon}</span>
                    <span>{new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{rec.chapters.length} chapters</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#f59e0b' }}>
                      <Star size={12} fill="#f59e0b" /> {rec.rating}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                    {rec.tags.slice(0, 4).map(t => (
                      <span key={t} style={{
                        padding: '2px 8px',
                        background: 'var(--surface-section)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                }}>
                  <span style={{
                    padding: '4px 10px',
                    background: rec.difficulty === 'Expert' ? 'var(--status-danger-bg)' : rec.difficulty === 'Advanced' ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                    color: rec.difficulty === 'Expert' ? 'var(--text-danger)' : rec.difficulty === 'Advanced' ? 'var(--text-warning)' : 'var(--text-success)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                  }}>
                    {rec.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-tertiary)',
          }}>
            <Search size={40} style={{ opacity: 0.3, marginBottom: 16 }} />
            <p style={{ fontSize: 'var(--text-md)' }}>No recordings found</p>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: 4 }}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecordingCard({ rec, idx, navigate }) {
  return (
    <div
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
      <div style={{
        height: 180,
        background: gradients[idx % gradients.length],
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,100,80,0.15), transparent)',
        }} />
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
        }}>
          <Play size={22} fill="white" color="white" style={{ marginLeft: 2 }} />
        </div>
        <span style={{
          position: 'absolute',
          bottom: 10,
          right: 12,
          background: 'rgba(0,0,0,0.65)',
          padding: '3px 8px',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'white',
          fontFamily: 'var(--font-mono)',
        }}>
          {rec.duration}
        </span>
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
          }}>HD</span>
          <span style={{
            background: rec.difficulty === 'Expert' ? 'rgba(220,38,38,0.85)' : rec.difficulty === 'Advanced' ? 'rgba(245,158,11,0.85)' : 'rgba(0,166,126,0.85)',
            padding: '2px 7px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 10,
            fontWeight: 600,
            color: 'white',
          }}>{rec.difficulty}</span>
        </div>
      </div>
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
            gap: 12,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CalendarDays size={13} />
              {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            <Star size={13} fill="#f59e0b" /> {rec.rating}
          </div>
        </div>
      </div>
    </div>
  );
}
