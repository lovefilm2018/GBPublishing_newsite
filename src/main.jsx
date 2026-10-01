import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', backgroundColor: '#FDFBF7' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8C2520', marginBottom: '0.75rem' }}>Unable to load GB Publishing</h2>
          <p style={{ color: '#64748b', maxWidth: '400px', marginBottom: '1.5rem' }}>An unexpected error occurred while loading the storefront.</p>
          <button 
            onClick={() => { window.location.href = window.location.pathname; }} 
            style={{ padding: '10px 24px', backgroundColor: '#8C2520', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
