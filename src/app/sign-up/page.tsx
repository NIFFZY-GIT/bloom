"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const backgroundImages = ['/images/signup-bg-1.jpg'];

export default function SignupPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'USER'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      const destination = data.role === 'ADMIN' ? '/admin/dashboard' : '/';
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
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

      {/* Signup Content */}
      <div className="signup-content">
        <div className="signup-text">
          <h1 className="signup-title">
            Start Your
            <span className="highlight"> Journey</span>
          </h1>
          <p className="signup-subtitle">
            Join Tropical Bloom Tourism and discover the most beautiful destinations in Sri Lanka. 
            Create your account and begin your adventure today.
          </p>
          <div className="benefits">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Exclusive travel deals</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Personalized recommendations</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        {/* Modern Signup Card with Yellow Buttons */}
        <div className="modern-signup-card">
          {/* Header with Yellow Accent */}
          <div className="signup-card-header">
            <div className="logo-badge">
              <span className="logo-icon">🌴</span>
            </div>
            <div className="signup-header-text">
              <h3>Create Account</h3>
              <h2>Tropical Bloom</h2>
            </div>
          </div>

          {/* Form Section */}
          <form className="modern-signup-form" onSubmit={handleSubmit}>
            <div className="input-group-modern">
              <div className="input-container">
                <input
                  type="text"
                  name="username"
                  placeholder=" "
                  className="modern-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <label className="modern-label">Username</label>
                <div className="input-underline"></div>
              </div>
            </div>

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
              <div className="input-container">
                <input
                  type="password"
                  name="password"
                  placeholder=" "
                  className="modern-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label className="modern-label">Password</label>
                <div className="input-underline"></div>
              </div>
            </div>

            <div className="input-group-modern">
              <div className="input-container">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder=" "
                  className="modern-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label className="modern-label">Confirm Password</label>
                <div className="input-underline"></div>
              </div>
            </div>

            {/* Form Options */}
            <div className="modern-form-options">
              <label className="modern-checkbox">
                <input type="checkbox" className="checkbox-input" required />
                <span className="checkbox-checkmark"></span>
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            {/* Yellow Signup Button */}
            <button type="submit" className="modern-signup-btn-yellow" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="btn-text">CREATING...</span>
              ) : (
                <>
                  <span className="btn-text">CREATE ACCOUNT</span>
                  <div className="btn-arrow">→</div>
                </>
              )}
            </button>
          </form>

          {/* Divider for Google Signup */}
          <div className="modern-divider">
            <div className="divider-line"></div>
            <span className="divider-text">or sign up with</span>
            <div className="divider-line"></div>
          </div>

          {/* Yellow Google Signup Button */}
          <div className="social-signup">
            <button className="google-signup-btn-yellow">
              <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* Login Link */}
          <div className="modern-login-section">
            <p>Already have an account? <a href="/login" className="modern-login-link">Log In</a></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
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

        .signup-content {
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

        .signup-text {
          flex: 1;
          max-width: 600px;
          color: white;
        }

        .signup-title {
          font-size: 4rem;
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

        .signup-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          font-weight: 300;
          line-height: 1.6;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          max-width: 500px;
        }

        .benefits {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .benefit-icon {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: bold;
          color: white;
        }

        /* Modern Signup Card Styles */
        .modern-signup-card {
          background: white;
          border-radius: 24px;
          padding: 0;
          width: 440px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 15px 35px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .signup-card-header {
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

        .signup-header-text {
          margin-top: 1rem;
        }

        .signup-header-text h3 {
          font-size: 1rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .signup-header-text h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.025em;
        }

        /* Form Styles */
        .modern-signup-form {
          padding: 2rem 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group-modern {
          position: relative;
        }

        .input-container {
          position: relative;
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

        .input-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #f59e0b, #d97706);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .modern-input:focus ~ .input-underline {
          width: 100%;
        }

        .modern-form-options {
          margin: 0.5rem 0;
        }

        .modern-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.4;
          cursor: pointer;
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
          flex-shrink: 0;
          margin-top: 0.1rem;
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

        .terms-link {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
        }

        .terms-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #f59e0b;
          transition: width 0.3s ease;
        }

        .terms-link:hover {
          color: #d97706;
        }

        .terms-link:hover::after {
          width: 100%;
        }

        /* Yellow Signup Button */
        .modern-signup-btn-yellow {
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
          margin-top: 0.5rem;
        }

        .modern-signup-btn-yellow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s ease;
        }

        .modern-signup-btn-yellow:hover::before {
          left: 100%;
        }

        .modern-signup-btn-yellow:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
          color: white;
        }

        .modern-signup-btn-yellow:hover .btn-arrow {
          transform: translateX(4px);
        }

        .modern-signup-btn-yellow:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .modern-signup-btn-yellow:disabled::before {
          display: none;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        /* Google Signup Section with Yellow */
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

        .social-signup {
          padding: 0 2rem 2rem;
        }

        .google-signup-btn-yellow {
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

        .google-signup-btn-yellow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .google-signup-btn-yellow:hover::before {
          left: 100%;
        }

        .google-signup-btn-yellow:hover {
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

        .modern-login-section {
          text-align: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid #f3f4f6;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .modern-login-link {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .modern-login-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #f59e0b;
          transition: width 0.3s ease;
        }

        .modern-login-link:hover {
          color: #d97706;
        }

        .modern-login-link:hover::after {
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .signup-content {
            flex-direction: column;
            text-align: center;
            gap: 3rem;
            padding-top: 100px;
          }

          .signup-text {
            max-width: 100%;
          }

          .modern-signup-card {
            width: 100%;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .signup-title {
            font-size: 3.2rem;
          }

          .signup-subtitle {
            font-size: 1.1rem;
          }

          .benefit-item {
            font-size: 1rem;
          }

          .modern-signup-card {
            padding: 0;
          }

          .signup-card-header {
            padding: 2rem 1.5rem 1.5rem;
          }

          .modern-signup-form {
            padding: 1.5rem 1.5rem 1rem;
          }

          .social-signup {
            padding: 0 1.5rem 1.5rem;
          }

          .modern-divider {
            padding: 0 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .signup-content {
            padding: 0 1rem;
            padding-top: 100px;
          }

          .signup-title {
            font-size: 2.5rem;
          }

          .modern-signup-card {
            padding: 0;
          }

          .logo-badge {
            left: 1.5rem;
            width: 50px;
            height: 50px;
          }

          .logo-icon {
            font-size: 1.5rem;
          }

          .modern-checkbox {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}