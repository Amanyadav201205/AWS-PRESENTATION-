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
          minHeight: '100dvh',
          background: 'var(--bg-canvas)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '540px',
            background: 'rgba(24, 24, 28, 0.92)',
            backdropFilter: 'blur(40px) saturate(190%)',
            WebkitBackdropFilter: 'blur(40px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderTop: '1px solid var(--hairline-top)',
            borderRadius: 'var(--radius-sheet)',
            padding: '36px',
            boxShadow: 'var(--shadow-modal)'
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-pill)',
              background: 'var(--status-danger-subtle)',
              border: '1px solid rgba(255, 69, 58, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              fontSize: 24
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
              Application Render Notice
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
              An unexpected display error occurred while rendering the architecture module. You can reload the application cleanly.
            </p>
            {this.state.error && (
              <pre style={{
                background: 'rgba(0, 0, 0, 0.75)',
                border: '1px solid var(--separator)',
                borderRadius: 'var(--radius-control)',
                padding: '14px',
                fontSize: '12px',
                color: 'var(--status-danger)',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px',
                fontFamily: 'var(--font-mono)'
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="btn-action primary"
              style={{
                height: 40,
                padding: '0 28px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: 'var(--radius-pill)'
              }}
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
