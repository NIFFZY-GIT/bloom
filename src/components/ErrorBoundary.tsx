'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-description">
              We encountered an unexpected error in this section. 
              Please try refreshing the page or return to the homepage.
            </p>
            {this.state.error && (
              <details className="error-details">
                <summary className="error-summary">Error Details</summary>
                <pre className="error-message">
                  {this.state.error.message || 'Unknown error occurred'}
                </pre>
              </details>
            )}
            <div className="error-actions">
              <button
                onClick={this.handleRefresh}
                className="refresh-button"
              >
                <span className="button-icon">🔄</span>
                Refresh Page
              </button>
              <Link
                href="/"
                className="home-button"
              >
                <span className="button-icon">🏠</span>
                Go Home
              </Link>
            </div>
          </div>

          <style jsx>{`
            .error-boundary-container {
              min-height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px 20px;
              width: 100%;
              background: #f8fafc;
            }

            .error-content {
              text-align: center;
              max-width: 500px;
              width: 100%;
              background: white;
              padding: clamp(1.5rem, 5vw, 2.5rem);
              border-radius: 16px;
              box-shadow: 
                0 4px 12px rgba(0, 0, 0, 0.1),
                0 1px 2px rgba(0, 0, 0, 0.05);
              border: 1px solid #e2e8f0;
            }

            .error-icon {
              font-size: clamp(3rem, 12vw, 4rem);
              margin-bottom: clamp(1rem, 3vw, 1.25rem);
              line-height: 1;
            }

            .error-title {
              font-size: clamp(1.5rem, 5vw, 1.8rem);
              color: #1f2937;
              margin-bottom: clamp(0.75rem, 2vw, 1rem);
              font-weight: 700;
              line-height: 1.3;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }

            .error-description {
              color: #6b7280;
              margin-bottom: clamp(1.5rem, 4vw, 2rem);
              line-height: 1.6;
              font-size: clamp(0.9rem, 3vw, 1rem);
              max-width: 100%;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }

            .error-details {
              margin-bottom: clamp(1.5rem, 4vw, 2rem);
              text-align: left;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }

            .error-summary {
              padding: 0.75rem 1rem;
              background: #f9fafb;
              cursor: pointer;
              font-size: 0.875rem;
              font-weight: 500;
              color: #374151;
              border: none;
              outline: none;
              width: 100%;
              text-align: left;
            }

            .error-summary:hover {
              background: #f3f4f6;
            }

            .error-summary::-webkit-details-marker {
              display: none;
            }

            .error-message {
              padding: 1rem;
              background: #fef2f2;
              color: #dc2626;
              font-size: 0.75rem;
              white-space: pre-wrap;
              word-break: break-word;
              margin: 0;
              max-height: 200px;
              overflow-y: auto;
              border-top: 1px solid #fecaca;
            }

            .error-actions {
              display: flex;
              gap: clamp(0.5rem, 2vw, 0.75rem);
              justify-content: center;
              flex-wrap: wrap;
            }

            .refresh-button,
            .home-button {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: clamp(0.75rem, 3vw, 0.875rem) clamp(1rem, 4vw, 1.5rem);
              border-radius: 8px;
              font-weight: 600;
              font-size: clamp(0.8rem, 3vw, 0.9rem);
              text-decoration: none;
              cursor: pointer;
              transition: all 0.2s ease;
              border: none;
              min-height: 44px;
              flex: 1;
              min-width: 140px;
              max-width: 200px;
              justify-content: center;
            }

            .refresh-button {
              background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
              color: white;
            }

            .refresh-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
            }

            .home-button {
              background: white;
              color: #ff6b35;
              border: 2px solid #ff6b35;
            }

            .home-button:hover {
              background: #fff5f5;
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(255, 107, 53, 0.2);
            }

            .button-icon {
              font-size: 1.1em;
              flex-shrink: 0;
            }

            /* Small devices (landscape phones, 576px and up) */
            @media (min-width: 576px) {
              .error-boundary-container {
                padding: 60px 30px;
              }

              .error-content {
                padding: 2.5rem;
              }

              .error-actions {
                flex-wrap: nowrap;
              }

              .refresh-button,
              .home-button {
                flex: 0 1 auto;
                min-width: 150px;
              }
            }

            /* Medium devices (tablets, 768px and up) */
            @media (min-width: 768px) {
              .error-boundary-container {
                padding: 80px 40px;
              }

              .error-content {
                padding: 3rem;
                max-width: 550px;
              }

              .error-title {
                font-size: 2rem;
              }

              .error-description {
                font-size: 1.1rem;
              }
            }

            /* Large devices (desktops, 992px and up) */
            @media (min-width: 992px) {
              .error-boundary-container {
                padding: 100px 50px;
              }

              .error-content {
                padding: 3.5rem;
                max-width: 600px;
              }
            }

            /* Extra small devices (phones, less than 576px) */
            @media (max-width: 480px) {
              .error-boundary-container {
                padding: 30px 15px;
                min-height: 300px;
              }

              .error-content {
                padding: 1.25rem;
                border-radius: 12px;
              }

              .error-actions {
                flex-direction: column;
                align-items: stretch;
              }

              .refresh-button,
              .home-button {
                max-width: none;
                min-width: auto;
              }

              .error-details {
                margin-bottom: 1.25rem;
              }
            }

            /* Support for very small screens */
            @media (max-width: 375px) {
              .error-boundary-container {
                padding: 20px 10px;
              }

              .error-content {
                padding: 1rem;
              }

              .error-title {
                font-size: 1.3rem;
              }

              .refresh-button,
              .home-button {
                padding: 0.75rem 1rem;
                font-size: 0.8rem;
              }
            }

            /* Landscape mode for mobile */
            @media (max-height: 500px) and (orientation: landscape) {
              .error-boundary-container {
                padding: 20px 15px;
                min-height: 300px;
              }

              .error-content {
                padding: 1.5rem;
              }

              .error-icon {
                font-size: 2.5rem;
                margin-bottom: 0.75rem;
              }

              .error-title {
                margin-bottom: 0.5rem;
              }

              .error-description {
                margin-bottom: 1.25rem;
              }
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
              .error-content {
                border: 2px solid #000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              }

              .refresh-button,
              .home-button {
                border: 2px solid;
              }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
              .refresh-button,
              .home-button {
                transition: none;
              }

              .refresh-button:hover,
              .home-button:hover {
                transform: none;
              }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
              .error-boundary-container {
                background: #0f172a;
              }

              .error-content {
                background: #1e293b;
                border-color: #334155;
                color: #f1f5f9;
              }

              .error-title {
                color: #f8fafc;
              }

              .error-description {
                color: #cbd5e1;
              }

              .error-summary {
                background: #334155;
                color: #e2e8f0;
              }

              .error-summary:hover {
                background: #475569;
              }

              .error-message {
                background: #7f1d1d;
                color: #fecaca;
                border-color: #991b1b;
              }

              .home-button {
                background: #1e293b;
                color: #fdba74;
                border-color: #fdba74;
              }

              .home-button:hover {
                background: #334155;
              }
            }

            /* Safe area insets for notched devices */
            @supports(padding: max(0px)) {
              .error-boundary-container {
                padding-left: max(20px, env(safe-area-inset-left));
                padding-right: max(20px, env(safe-area-inset-right));
                padding-top: max(40px, env(safe-area-inset-top));
                padding-bottom: max(40px, env(safe-area-inset-bottom));
              }
            }

            /* Print styles */
            @media print {
              .error-boundary-container {
                background: white;
                padding: 20px;
                min-height: auto;
              }

              .error-content {
                box-shadow: none;
                border: 1px solid #ccc;
              }

              .error-actions {
                display: none;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;