import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, MonitorPlay, Eye, EyeOff, Shield, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [participantId, setParticipantId] = useState('BBB-2026-0142');
  const [accessCode, setAccessCode] = useState('demo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await login(participantId, accessCode);
    if (ok) navigate('/dashboard');
    else setError('Invalid credentials. Please try again.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#f8f9fc',
    }}>
      {/* Left Panel — Branding */}
      <div style={{
        flex: '0 0 480px',
        background: 'linear-gradient(180deg, #1b1f2b 0%, #0f1219 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 48,
          }}>
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #0078d4, #4f46e5)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MonitorPlay size={26} color="white" />
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>OpReview</div>
              <div style={{ color: '#6b7394', fontSize: 12 }}>by Pandasdroid</div>
            </div>
          </div>

          <h1 style={{
            color: '#fff',
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            marginBottom: 20,
          }}>
            Surgical Training<br />
            <span style={{ color: '#0078d4' }}>Video Portal</span>
          </h1>

          <p style={{
            color: '#8e94ab',
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 360,
            marginBottom: 40,
          }}>
            Access your recorded surgical procedures with chapter-based navigation,
            instructor commentary, and secure watermarked playback.
          </p>

          {/* Feature List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '01', text: 'Multi-angle surgical recordings with HD playback' },
              { icon: '02', text: 'Chapter markers for every surgical phase' },
              { icon: '03', text: 'Expert commentary & annotations' },
              { icon: '04', text: 'Secure, watermarked content delivery' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 32, height: 32,
                  background: 'rgba(0, 120, 212, 0.1)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0078d4',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <span style={{ color: '#b0b8d1', fontSize: 13, lineHeight: 1.5, paddingTop: 6 }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: 56,
          color: '#4a5170',
          fontSize: 12,
        }}>
          Pandasdroid Private Limited
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Course Branding */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #00a67e, #059669)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 13,
            }}>
              BBB
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>BuildBetterBone</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Maxillofacial Surgery Masterclass</div>
            </div>
          </div>

          <div style={{
            height: 1,
            background: 'var(--border-default)',
            margin: '24px 0',
          }} />

          <h2 style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
            letterSpacing: '-0.3px',
          }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            Sign in to access your surgical training recordings
          </p>

          <form onSubmit={handleSubmit}>
            {/* Participant ID */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}>
                Participant ID
              </label>
              <input
                type="text"
                value={participantId}
                onChange={e => setParticipantId(e.target.value)}
                placeholder="e.g., BBB-2026-0142"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  background: 'var(--surface-card)',
                  transition: 'border var(--transition-fast)',
                  fontSize: 14,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>

            {/* Access Code */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}>
                Access Code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value)}
                  placeholder="Enter your access code"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    paddingRight: 44,
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    background: 'var(--surface-card)',
                    transition: 'border var(--transition-fast)',
                    fontSize: 14,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                    padding: 4,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'var(--status-danger-bg)',
                border: '1px solid #fca5a5',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-danger)',
                fontSize: 13,
                marginBottom: 20,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 20px',
                background: loading ? 'var(--brand-primary-hover)' : 'var(--brand-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all var(--transition-fast)',
                opacity: loading ? 0.85 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-primary-hover)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-primary)' }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 32,
            padding: '12px 16px',
            background: 'var(--surface-section)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-tertiary)',
            fontSize: 12,
          }}>
            <Shield size={14} />
            <span>Encrypted connection &middot; HIPAA-compliant access &middot; Session monitored</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
