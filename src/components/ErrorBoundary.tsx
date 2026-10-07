import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in AWS WAF app:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0b0d10',
          color: '#f0f3f6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '540px',
            background: '#14171c',
            border: '1px solid #22262d',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f0f3f6', margin: '0 0 10px 0' }}>
              Application Render Notice
            </h2>
            <p style={{ fontSize: '14px', color: '#9da7b3', margin: '0 0 20px 0', lineHeight: 1.6 }}>
              An unexpected display error occurred while rendering the architecture module. You can reload the application cleanly.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#05070a',
                border: '1px solid #22262d',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#ff453a',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '20px',
                maxHeight: '120px'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              style={{
                background: '#FF9900',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
