import { Component, ErrorInfo, ReactNode } from 'react';
import { DEBUG_HISTORY, debugHistory } from '../../utils/debug';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
    if (DEBUG_HISTORY) {
      debugHistory('ErrorBoundary caught', error.message, errorInfo.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          <p className="font-semibold">Something went wrong</p>
          <p className="mt-1 opacity-80">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
