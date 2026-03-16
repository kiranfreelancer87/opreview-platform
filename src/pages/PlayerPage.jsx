import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { recordings } from '../data/recordings';
import TopBar from '../components/layout/TopBar';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Maximize,
  Download, Shield, Clock, Bookmark, MessageSquare, ChevronDown,
  Scissors, Layers, Zap, Box, Anchor, CheckCircle, FileText,
  ClipboardList, Search, Settings, Move, Repeat, Wrench, Target
} from 'lucide-react';

const iconMap = {
  clipboard: ClipboardList,
  scissors: Scissors,
  layers: Layers,
  zap: Zap,
  box: Box,
  anchor: Anchor,
  shield: Shield,
  'check-circle': CheckCircle,
  'file-text': FileText,
  search: Search,
  settings: Settings,
  move: Move,
  repeat: Repeat,
  tool: Wrench,
};

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const rec = recordings.find(r => r.id === id) || recordings[0];

  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showRightClickMsg, setShowRightClickMsg] = useState(false);

  const progress = rec.durationSec > 0 ? (currentTime / rec.durationSec) * 100 : 0;

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${m}:${String(s).padStart(2, '0')}`;
  };

  const selectChapter = useCallback((idx) => {
    setActiveChapter(idx);
    setCurrentTime(rec.chapters[idx].seconds);
  }, [rec]);

  // Simulate playback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(t => {
        const next = t + 1;
        if (next >= rec.durationSec) { setIsPlaying(false); return rec.durationSec; }
        // Auto-advance chapter
        const chapIdx = rec.chapters.findLastIndex(c => c.seconds <= next);
        if (chapIdx >= 0 && chapIdx !== activeChapter) setActiveChapter(chapIdx);
        return next;
      });
    }, 100); // 10x speed for demo
    return () => clearInterval(interval);
  }, [isPlaying, rec, activeChapter]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowRightClickMsg(true);
    setTimeout(() => setShowRightClickMsg(false), 2500);
  };

  // Find active annotation
  const activeAnnotationIdx = [...rec.annotations].reverse().findIndex(a => a.seconds <= currentTime);
  const realAnnotationIdx = activeAnnotationIdx >= 0 ? rec.annotations.length - 1 - activeAnnotationIdx : -1;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-ground)' }}>
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => navigate('/dashboard') },
          { label: 'Recordings', onClick: () => navigate('/dashboard') },
          { label: rec.title },
        ]}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT: Chapters */}
        <div style={{
          width: 280,
          background: 'var(--surface-card)',
          borderRight: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <Bookmark size={15} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              Chapters
            </span>
            <span style={{
              marginLeft: 'auto',
              background: 'var(--surface-section)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}>
              {rec.chapters.length}
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            {rec.chapters.map((ch, i) => {
              const Icon = iconMap[ch.icon] || ClipboardList;
              const active = i === activeChapter;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChapter(i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    background: active ? 'var(--brand-primary-light)' : 'transparent',
                    border: active ? '1px solid var(--brand-primary-subtle)' : '1px solid transparent',
                    marginBottom: 2,
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-section)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: 'var(--radius-md)',
                    background: active ? 'var(--brand-primary)' : 'var(--surface-section)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: active ? 'white' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)',
                  }}>
                    <Icon size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--brand-primary)' : 'var(--text-primary)',
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}>
                      {ch.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      <span>{ch.time}</span>
                      <span>&middot;</span>
                      <span>{ch.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER: Video */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ padding: '20px 28px' }}>
            {/* Video Player */}
            <div
              onContextMenu={handleContextMenu}
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: '#000',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
            >
              {/* Video Area */}
              <div style={{
                aspectRatio: '16/9',
                background: 'linear-gradient(135deg, #0c1a2a 0%, #0a2a25 30%, #0c1520 60%, #101820 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {/* Surgical ambient glow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 50% 40% at 52% 48%, rgba(0,120,80,0.12), transparent)',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 50% 45%, rgba(180,220,200,0.04), transparent 60%)',
                }} />

                {/* Watermark */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  opacity: 0.06,
                }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} style={{
                      position: 'absolute',
                      whiteSpace: 'nowrap',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#fff',
                      transform: 'rotate(-25deg)',
                      letterSpacing: 3,
                      top: `${Math.floor(i / 4) * 20}%`,
                      left: `${(i % 4) * 30 - 10}%`,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {user?.name} — {user?.id}
                    </span>
                  ))}
                </div>

                {/* Play/Pause */}
                {!isPlaying && (
                  <div style={{
                    width: 72, height: 72,
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.15)',
                    zIndex: 3,
                    transition: 'all var(--transition-base)',
                  }}>
                    <Play size={30} fill="white" color="white" style={{ marginLeft: 3 }} />
                  </div>
                )}

                {/* Camera angle badge */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 11,
                  color: 'white',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  zIndex: 3,
                }}>
                  <div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: isPlaying ? 'pulse 2s infinite' : 'none' }} />
                  {isPlaying ? 'LIVE PLAYBACK' : 'CAM 1 — Overhead'}
                </div>

                {/* Chapter indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.8)',
                  zIndex: 3,
                  fontWeight: 500,
                }}>
                  {rec.chapters[activeChapter]?.name}
                </div>
              </div>

              {/* Controls Bar */}
              <div style={{
                background: '#111318',
                padding: '10px 20px 14px',
              }}>
                {/* Progress */}
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    marginBottom: 12,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    const newTime = Math.floor(pct * rec.durationSec);
                    setCurrentTime(newTime);
                    const chapIdx = [...rec.chapters].reverse().findIndex(c => c.seconds <= newTime);
                    if (chapIdx >= 0) setActiveChapter(rec.chapters.length - 1 - chapIdx);
                  }}
                >
                  {/* Chapter markers on progress bar */}
                  {rec.chapters.map((ch, i) => (
                    <div key={i} style={{
                      position: 'absolute',
                      left: `${(ch.seconds / rec.durationSec) * 100}%`,
                      top: -1,
                      width: 2,
                      height: 6,
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 1,
                    }} />
                  ))}
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--brand-primary), #4f46e5)',
                    borderRadius: 2,
                    width: `${progress}%`,
                    transition: 'width 0.1s linear',
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      right: -5,
                      top: -3,
                      width: 10,
                      height: 10,
                      background: 'white',
                      borderRadius: '50%',
                      boxShadow: '0 0 6px rgba(0,120,212,0.5)',
                    }} />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ControlBtn onClick={() => {
                      const prev = Math.max(0, activeChapter - 1);
                      selectChapter(prev);
                    }}>
                      <SkipBack size={17} />
                    </ControlBtn>
                    <ControlBtn onClick={() => setIsPlaying(!isPlaying)} primary>
                      {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" style={{ marginLeft: 1 }} />}
                    </ControlBtn>
                    <ControlBtn onClick={() => {
                      const next = Math.min(rec.chapters.length - 1, activeChapter + 1);
                      selectChapter(next);
                    }}>
                      <SkipForward size={17} />
                    </ControlBtn>
                    <ControlBtn><Volume2 size={17} /></ControlBtn>
                    <span style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.5)',
                      fontFamily: 'var(--font-mono)',
                      marginLeft: 4,
                    }}>
                      {formatTime(currentTime)} / {rec.duration}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 11,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      1.0x <ChevronDown size={12} />
                    </button>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: 11,
                    }}>
                      <Download size={14} style={{ opacity: 0.5 }} />
                      <span style={{ textDecoration: 'line-through' }}>Download</span>
                    </div>
                    <ControlBtn><Maximize size={17} /></ControlBtn>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div style={{
              marginTop: 20,
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div>
                  <h2 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 6,
                  }}>
                    {rec.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: 600 }}>
                    {rec.description}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: 6,
                  flexShrink: 0,
                }}>
                  {rec.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      padding: '4px 10px',
                      background: 'var(--surface-section)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 24,
                marginTop: 16,
                paddingTop: 16,
                borderTop: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
              }}>
                <span>{rec.surgeon}</span>
                <span>{new Date(rec.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>{rec.duration}</span>
                <span>{rec.chapters.length} chapters</span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: 'var(--brand-secondary)',
                  marginLeft: 'auto',
                }}>
                  <Shield size={13} />
                  Watermarked &middot; No downloads &middot; Session tracked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Annotations */}
        <div style={{
          width: 340,
          background: 'var(--surface-card)',
          borderLeft: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <MessageSquare size={15} style={{ color: 'var(--brand-secondary)' }} />
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
              Instructor Commentary
            </span>
            <span style={{
              marginLeft: 'auto',
              background: 'var(--brand-secondary-light)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              color: 'var(--brand-secondary)',
              fontWeight: 500,
            }}>
              {rec.annotations.length}
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
            {rec.annotations.map((ann, i) => {
              const active = i === realAnnotationIdx;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentTime(ann.seconds);
                    const chapIdx = [...rec.chapters].reverse().findIndex(c => c.seconds <= ann.seconds);
                    if (chapIdx >= 0) setActiveChapter(rec.chapters.length - 1 - chapIdx);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 4,
                    cursor: 'pointer',
                    background: active ? 'var(--brand-secondary-light)' : 'transparent',
                    border: active ? '1px solid rgba(0,166,126,0.15)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-section)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'var(--brand-secondary-light)' : 'transparent'; }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: active ? 'var(--brand-secondary)' : 'var(--brand-primary)',
                      background: active ? 'rgba(0,166,126,0.1)' : 'var(--brand-primary-light)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {ann.time}
                    </span>
                    {active && (
                      <span style={{
                        width: 6, height: 6,
                        background: 'var(--brand-secondary)',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.6,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>
                    {ann.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right-click protection overlay */}
      {showRightClickMsg && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease',
        }}
          onClick={() => setShowRightClickMsg(false)}
        >
          <div style={{
            background: 'var(--surface-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 48px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <Shield size={40} style={{ color: 'var(--brand-primary)', marginBottom: 16 }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 8 }}>Content Protected</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Right-click is disabled for content protection.<br />
              All activity is logged and monitored.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ControlBtn({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: primary ? 40 : 34,
        height: primary ? 40 : 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        color: 'rgba(255,255,255,0.7)',
        background: primary ? 'var(--brand-primary)' : 'transparent',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = primary ? 'var(--brand-primary-hover)' : 'rgba(255,255,255,0.08)';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = primary ? 'var(--brand-primary)' : 'transparent';
        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
      }}
    >
      {children}
    </button>
  );
}
