import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface SectionErrorBoundaryProps {
  sectionName?: string;
  children: React.ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): SectionErrorBoundaryState {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Unexpected rendering error';
    return { hasError: true, errorMessage: msg };
  }

  componentDidCatch(error: unknown) {
    console.error(
      `[SectionErrorBoundary:${this.props.sectionName || 'Section'}]`,
      error
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  private handleHardReload = () => {
    if (typeof window === 'undefined') return;
    const cacheStorage = window.caches;
    if (cacheStorage) {
      cacheStorage
        .keys()
        .then((keys) =>
          Promise.all(keys.map((k) => cacheStorage.delete(k).catch(() => false)))
        )
        .finally(() => window.location.reload());
    } else {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="my-4 mx-auto max-w-lg rounded-3xl bg-white border border-[#D2DEEA] p-6 shadow-sm text-center space-y-3.5">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-[#1A2138]">
            {this.props.sectionName
              ? `Unable to load ${this.props.sectionName}`
              : 'Section failed to load'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            A new version of Food Science Portal may have just been published or your network briefly interrupted loading.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] border border-[#1673B8]/30 text-[#1A2138] text-xs font-extrabold cursor-pointer transition-colors"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={this.handleHardReload}
            className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Latest Version</span>
          </button>
        </div>
      </div>
    );
  }
}
