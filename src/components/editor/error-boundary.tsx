'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Rich Editor component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-10 w-10 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Editor failed to load</h2>
          <p className="text-sm text-center mb-6 max-w-sm">
            We encountered an unexpected error while rendering the rich text editor.
          </p>
          <Button 
            variant="outline" 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
