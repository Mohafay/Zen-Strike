import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Keeps a crash on one tab from taking down the whole app — shows the
// actual error instead of a blank page, which is otherwise invisible since
// error boundaries must be class components (no hooks equivalent yet).
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('Tab crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-4 mt-6 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-white">
          <p className="font-semibold text-danger">This tab hit an error.</p>
          <p className="mt-2 text-xs text-muted">
            Switching tabs should recover. Details below (please report this):
          </p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-muted">
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
