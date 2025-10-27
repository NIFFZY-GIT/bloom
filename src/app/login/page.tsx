'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const backgroundImages = [
  '/images/hero-bg-1.jpg',
  '/images/hero-bg-2.jpg',
  '/images/hero-bg-3.jpg'
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'success'>('email');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Check if user was just registered
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('🎉 Registration successful! Please log in with your credentials.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Check if there's a redirect URL
      const redirectUrl = searchParams.get('redirect');
      
      // Determine destination: redirect URL, or default based on role
      const destination = redirectUrl || (data.role === 'ADMIN' ? '/admin/dashboard' : '/');
      
      // Use window.location.href for full page reload to ensure cookies are sent
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotModal(true);
    setResetStep('email');
    setResetError('');
    setResetSuccess('');
    setForgotEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setDevCode('');
  };

  const handleCloseForgotModal = () => {
    setShowForgotModal(false);
    setResetStep('email');
    setResetError('');
    setResetSuccess('');
    setForgotEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setDevCode('');
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError('');
    setResetSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (data.success) {
        setResetSuccess(data.message);
        setResetStep('code');
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        setResetError(data.message || 'Failed to send code');
      }
    } catch (err) {
      setResetError('Failed to send reset code. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }

    setIsResetting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          code: resetCode,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setResetSuccess(data.message);
        setResetStep('success');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          handleCloseForgotModal();
        }, 3000);
      } else {
        setResetError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setResetError('Failed to reset password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="hero-container">
      {/* Background Slides */}
      <div className="background-slides">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`background-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Where Every Journey
            <span className="highlight"> Blooms...</span>
          </h1>
          <p className="hero-subtitle">
            Discover the most beautiful destinations in Sri Lanka with Tropical Bloom Tourism. 
            Your perfect vacation starts here.
          </p>
          <div className="hero-buttons">
            <button className="explore-btn-yellow">
              EXPLORE
            </button>
            <button className="discover-btn">
              Discover
            </button>
            <button className="know-more-btn">
              Know More
            </button>
          </div>
        </div>

        {/* Modern Login Card with Yellow Theme */}
        <div className="modern-login-card">
          {/* Header with Dark Background */}
          <div className="login-card-header">
            <div className="logo-badge">
              <span className="logo-icon">🌴</span>
            </div>
            <div className="login-header-text">
              <h3>Welcome Back</h3>
              <h2>Tropical Bloom</h2>
            </div>
          </div>

          {/* Google Login */}
          <div className="social-login">
            <button className="google-login-btn-yellow">
              <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Modern Divider */}
          <div className="modern-divider">
            <div className="divider-line"></div>
            <span className="divider-text">or continue with email</span>
            <div className="divider-line"></div>
          </div>

          {/* Modern Form */}
          <form className="modern-login-form" onSubmit={handleSubmit}>
            <div className="input-group-modern">
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  className="modern-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label className="modern-label">Email Address</label>
                <div className="input-underline"></div>
              </div>
            </div>

            <div className="input-group-modern">
              <div className="input-container password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder=" "
                  className="modern-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label className="modern-label">Password</label>
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
                <div className="input-underline"></div>
              </div>
            </div>

            {/* Form Options */}
            <div className="modern-form-options">
              <label className="modern-checkbox">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-checkmark"></span>
                Remember me
              </label>
              <a href="#" className="modern-forgot-link" onClick={handleForgotPasswordClick}>
                Forgot Password?
              </a>
            </div>

            {/* Redirect Notice */}
            {searchParams.get('redirect') && (
              <div className="info-message">
                <i className="fas fa-info-circle"></i>
                Please log in to continue booking your tour package.
              </div>
            )}

            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Yellow Login Button */}
            <button type="submit" className="modern-login-btn-yellow" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-text">LOGGING IN...</span>
              ) : (
                <>
                  <span className="btn-text">LOG IN</span>
                  <div className="btn-arrow">→</div>
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="modern-signup-section">
            <p>Don't have an account? <a href={`/sign-up${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="modern-signup-link">Sign Up</a></p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={handleCloseForgotModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseForgotModal}>×</button>
            
            <div className="modal-header">
              <div className="modal-icon">🔐</div>
              <h2>Reset Password</h2>
              <p>We&apos;ll send you a verification code to reset your password</p>
            </div>

            {resetError && (
              <div className="alert alert-error">
                ❌ {resetError}
              </div>
            )}

            {resetSuccess && (
              <div className="alert alert-success">
                ✅ {resetSuccess}
              </div>
            )}

            {devCode && (
              <div className="alert alert-info">
                🔧 Dev Code: <strong>{devCode}</strong>
              </div>
            )}

            {resetStep === 'email' && (
              <form onSubmit={handleSendResetCode} className="modal-form">
                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="modal-input"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="modal-btn" disabled={isResetting}>
                  {isResetting ? '⏳ Sending...' : '📧 Send Verification Code'}
                </button>
              </form>
            )}

            {resetStep === 'code' && (
              <form onSubmit={handleResetPassword} className="modal-form">
                <div className="form-group">
                  <label htmlFor="reset-code">Verification Code</label>
                  <input
                    id="reset-code"
                    type="text"
                    className="modal-input"
                    placeholder="Enter 6-digit code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <small>Check your email for the verification code</small>
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      className="modal-input"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn-modal"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      <i className={showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
                  <small>Minimum 6 characters</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="modal-input"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn-modal"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="modal-btn" disabled={isResetting}>
                    {isResetting ? '⏳ Updating...' : '🔒 Update Password'}
                  </button>
                  <button type="button" className="modal-btn-secondary" onClick={() => setResetStep('email')}>
                    ← Back
                  </button>
                </div>
              </form>
            )}

            {resetStep === 'success' && (
              <div className="success-state">
                <div className="success-icon">✅</div>
                <h3>Password Reset Successful!</h3>
                <p>You can now log in with your new password.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .background-slides {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .background-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
        }

        .background-slide.active {
          opacity: 1;
        }

        .background-slide::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          padding-top: 80px;
        }

        .hero-text {
          flex: 1;
          max-width: 600px;
          color: white;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.025em;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .highlight {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 3rem;
          font-weight: 300;
          line-height: 1.6;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          max-width: 500px;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* Yellow Explore Button */
        .explore-btn-yellow {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          padding: 1.2rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .explore-btn-yellow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .explore-btn-yellow:hover::before {
          left: 100%;
        }

        .explore-btn-yellow:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .discover-btn {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 1.2rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .discover-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .know-more-btn {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 1.2rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .know-more-btn:hover {
          background: white;
          color: #1f2937;
          transform: translateY(-2px);
        }

        /* Modern Login Card Styles */
        .modern-login-card {
          background: white;
          border-radius: 24px;
          padding: 0;
          width: 420px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 15px 35px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .login-card-header {
          background: linear-gradient(135deg, #1f2937, #374151);
          padding: 2.5rem 2rem 2rem;
          position: relative;
        }

        .logo-badge {
          position: absolute;
          top: -20px;
          left: 2rem;
          background: white;
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .logo-icon {
          font-size: 2rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .login-header-text {
          margin-top: 1rem;
        }

        .login-header-text h3 {
          font-size: 1rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-header-text h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .social-login {
          padding: 2rem 2rem 1.5rem;
        }

        /* Yellow Google Login Button */
        .google-login-btn-yellow {
          width: 100%;
          background: white;
          border: 2px solid #f59e0b;
          padding: 1.1rem 2rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #f59e0b;
          box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);
          position: relative;
          overflow: hidden;
        }

        .google-login-btn-yellow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .google-login-btn-yellow:hover::before {
          left: 100%;
        }

        .google-login-btn-yellow:hover {
          background: #f59e0b;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          border-color: #f59e0b;
        }

        .google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .modern-divider {
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider-text {
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .modern-login-form {
          padding: 0 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.8rem;
        }

        .input-group-modern {
          position: relative;
        }

        .input-container {
          position: relative;
        }

        .password-input-container {
          position: relative;
        }

        .password-toggle-btn {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          z-index: 10;
        }

        .password-toggle-btn:hover {
          color: #f59e0b;
        }

        .password-toggle-btn i {
          font-size: 1.1rem;
        }

        .modern-input {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.2rem 1rem 0.8rem;
          color: #1f2937;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .password-input-container .modern-input {
          padding-right: 3rem;
        }

        .modern-input:focus {
          outline: none;
          border-color: #f59e0b;
          background: white;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .modern-input:focus + .modern-label,
        .modern-input:not(:placeholder-shown) + .modern-label {
          transform: translateY(-120%) scale(0.85);
          color: #f59e0b;
        }

        .modern-label {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 1rem;
          font-weight: 400;
          pointer-events: none;
          transition: all 0.3s ease;
          background: white;
          padding: 0 0.2rem;
        }

       

        .modern-form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .modern-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .modern-checkbox:hover {
          color: #374151;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          position: relative;
          transition: all 0.3s ease;
          background: white;
        }

        .checkbox-input:checked + .checkbox-checkmark {
          background: #f59e0b;
          border-color: #f59e0b;
        }

        .checkbox-input:checked + .checkbox-checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .modern-forgot-link {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .modern-forgot-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #f59e0b;
          transition: width 0.3s ease;
        }

        .modern-forgot-link:hover {
          color: #d97706;
        }

        .modern-forgot-link:hover::after {
          width: 100%;
        }

        /* Yellow Login Button */
        .modern-login-btn-yellow {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 1.2rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .modern-login-btn-yellow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .modern-login-btn-yellow:hover::before {
          left: 100%;
        }

        .modern-login-btn-yellow:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
          color: white;
        }

        .modern-login-btn-yellow:hover .btn-arrow {
          transform: translateX(4px);
        }

        .modern-login-btn-yellow:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .modern-login-btn-yellow:disabled::before {
          display: none;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          text-align: center;
          margin-top: -0.5rem;
        }

        .success-message {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          text-align: center;
          margin-top: -0.25rem;
          border-left: 3px solid #10b981;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
          font-weight: 500;
        }

        .info-message {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          color: #1e40af;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          text-align: center;
          margin-top: -0.25rem;
          border-left: 3px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .info-message i {
          font-size: 1rem;
          color: #3b82f6;
        }

        .modern-signup-section {
          text-align: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid #f3f4f6;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .modern-signup-link {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .modern-signup-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #f59e0b;
          transition: width 0.3s ease;
        }

        .modern-signup-link:hover {
          color: #d97706;
        }

        .modern-signup-link:hover::after {
          width: 100%;
        }

        /* Animations */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #f3f4f6;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .modal-close:hover {
          background: #e5e7eb;
          color: #1f2937;
          transform: rotate(90deg);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modal-header h2 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .modal-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .alert {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-info {
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .modal-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper .modal-input {
          padding-right: 3rem;
        }

        .password-toggle-btn-modal {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle-btn-modal:hover {
          color: #f59e0b;
        }

        .password-toggle-btn-modal i {
          font-size: 1rem;
        }

        .modal-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .form-group small {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .modal-btn {
          width: 100%;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
        }

        .modal-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-btn-secondary {
          width: 100%;
          background: #f3f4f6;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-btn-secondary:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .success-state {
          text-align: center;
          padding: 2rem 1rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .success-state h3 {
          font-size: 1.5rem;
          color: #065f46;
          margin-bottom: 0.5rem;
        }

        .success-state p {
          color: #6b7280;
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 3rem;
            padding-top: 100px;
          }

          .hero-text {
            max-width: 100%;
          }

          .modern-login-card {
            width: 100%;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-buttons {
            justify-content: center;
          }

          .modern-login-card {
            padding: 0;
          }

          .login-card-header {
            padding: 2rem 1.5rem 1.5rem;
          }

          .modern-login-form {
            padding: 0 1.5rem 1.5rem;
          }

          .social-login {
            padding: 1.5rem 1.5rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding: 0 1rem;
            padding-top: 100px;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .explore-btn-yellow,
          .discover-btn,
          .know-more-btn {
            width: 100%;
            max-width: 250px;
          }

          .modern-form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .logo-badge {
            left: 1.5rem;
            width: 50px;
            height: 50px;
          }

          .logo-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}