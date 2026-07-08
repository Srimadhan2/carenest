import { Component } from 'react';
import { STRINGS } from '@/utils/constants/strings';
import { Button } from '@/components/ui/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <h1 className="text-title font-semibold text-text">{STRINGS.errors.generic}</h1>
          <Button onClick={() => window.location.reload()}>{STRINGS.errors.retry}</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
