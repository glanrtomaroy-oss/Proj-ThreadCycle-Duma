import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console in development
        console.error('Error boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary">
                    <div className="container">
                        <div style={{
                            padding: '40px 20px',
                            textAlign: 'center',
                            background: '#fff',
                            borderRadius: '8px',
                            border: '2px solid #e74c3c',
                            margin: '20px 0'
                        }}>
                            <h2 style={{ color: '#e74c3c' }}>⚠️ Something went wrong</h2>
                            <p>We encountered an unexpected error. Please refresh the page and try again.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                                style={{ marginTop: '10px' }}
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
