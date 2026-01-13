import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-danger-500" />
                <div>
                  <CardTitle>Something went wrong</CardTitle>
                  <CardDescription>
                    We encountered an unexpected error. Your data should still be safe.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-semibold text-sm mb-2">Error Details (Dev Mode):</div>
                  <div className="text-xs font-mono text-muted-foreground overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        Component Stack
                      </summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload App
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/')}
                  className="flex-1"
                >
                  Go Home
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                If this problem persists, try clearing your browser cache or contact support. Your
                data is automatically saved to your browser&apos;s local storage.
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
