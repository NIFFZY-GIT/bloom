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

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px',
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{
              fontSize: '1.8rem',
              color: '#1f2937',
              marginBottom: '15px',
              fontWeight: '700',
            }}>
              Something went wrong
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '30px',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error in this section. 
              Please try refreshing the page or return to the homepage.
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                🔄 Refresh Page
              </button>
              <Link
                href="/"
                style={{
                  background: 'white',
                  color: '#ff6b35',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #ff6b35',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '15px',
                }}
              >
                🏠 Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
