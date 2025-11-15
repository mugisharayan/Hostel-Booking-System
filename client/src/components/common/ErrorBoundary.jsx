import React from 'react';
import PropTypes from 'prop-types';

// Error boundary styles
const errorStyles = {
  container: {
    padding: '40px',
    textAlign: 'center',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    margin: '20px',
    border: '1px solid #fecaca',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#991b1b'
  },
  message: {
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  button: {
    padding: '12px 24px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    marginRight: '12px'
  },
  secondaryButton: {
    padding: '12px 24px',
    background: 'transparent',
    color: '#dc2626',
    border: '1px solid #dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  errorDetails: {
    marginTop: '20px',
    padding: '16px',
    background: '#fef2f2',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    textAlign: 'left',
    color: '#7f1d1d',
    maxHeight: '200px',
    overflow: 'auto'
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external service if available
    console.error('Application Error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Report to error tracking service (e.g., Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    });
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, title, message } = this.props;
      
      // Use custom fallback if provided
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onRefresh={this.handleRefresh}
          />
        );
      }

      return (
        <div style={errorStyles.container}>
          <div>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
          </div>
          
          <h2 style={errorStyles.title}>
            {title || 'Oops! Something went wrong'}
          </h2>
          
          <p style={errorStyles.message}>
            {message || 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
          </p>
          
          <div>
            <button 
              onClick={this.handleRetry}
              style={errorStyles.button}
              onMouseOver={(e) => e.target.style.background = '#b91c1c'}
              onMouseOut={(e) => e.target.style.background = '#dc2626'}
            >
              Try Again
            </button>
            
            <button 
              onClick={this.handleRefresh}
              style={errorStyles.secondaryButton}
              onMouseOver={(e) => {
                e.target.style.background = '#dc2626';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#dc2626';
              }}
            >
              Refresh Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div>
              <button 
                onClick={this.toggleDetails}
                style={{
                  ...errorStyles.secondaryButton,
                  marginTop: '16px',
                  fontSize: '12px'
                }}
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Error Details
              </button>
              
              {this.state.showDetails && (
                <div style={errorStyles.errorDetails}>
                  <strong>Error:</strong> {this.state.error?.toString()}
                  <br /><br />
                  <strong>Stack Trace:</strong>
                  <pre>{this.state.error?.stack}</pre>
                  {this.state.errorInfo && (
                    <>
                      <br /><strong>Component Stack:</strong>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  title: PropTypes.string,
  message: PropTypes.string,
  onError: PropTypes.func
};

export default ErrorBoundary;