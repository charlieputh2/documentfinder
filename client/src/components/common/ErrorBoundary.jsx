import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0f13] p-8 text-center shadow-xl">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h2 className="font-heading text-xl text-white">Something went wrong</h2>
              <p className="mt-2 text-sm text-slate-400">
                An unexpected error occurred. Please try again.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Reload Page
              </button>
            </div>

            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">
                  Error details
                </summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-red-400">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
