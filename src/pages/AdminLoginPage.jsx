import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import PageTransition from '../components/PageTransition';
import { CellSpellLogo, LockIcon } from '../components/SVGIcons';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard', { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition variant="portal">
      <section className="admin-login-page" id="admin-login">
        <div className="container">
          <div className="admin-login-card">
            <div className="glass-form-card__accent" />

            <div className="admin-login-header">
              <div className="admin-login-icon">
                <LockIcon size={48} />
              </div>
              <div className="admin-login-brand">
                <CellSpellLogo size={28} />
                <span>Admin Portal</span>
              </div>
              <h1 className="admin-login-title">Sign In</h1>
              <p className="admin-login-subtitle">
                Authorized administrators only
              </p>
            </div>

            {error && (
              <div className="form-message error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="glass-form">
              <div className="floating-field">
                <div className="field-input-wrapper">
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    className="floating-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                  <label htmlFor="admin-email" className="floating-label">
                    Email
                  </label>
                </div>
              </div>

              <div className="floating-field">
                <div className="field-input-wrapper">
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    className="floating-input"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <label htmlFor="admin-password" className="floating-label">
                    Password
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-submit"
                disabled={loading}
                id="admin-login-btn"
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="admin-login-footer">
              <Link to="/" className="back-link" id="admin-back-home">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
