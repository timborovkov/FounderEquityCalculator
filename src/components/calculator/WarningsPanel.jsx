import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCalculatorStore from '@/store/useCalculatorStore'
import { getAllWarnings } from '@/lib/utils/validation'

export default function WarningsPanel() {
  const store = useCalculatorStore()
  const warnings = getAllWarnings(store)

  if (warnings.length === 0) {
    return null
  }

  const getIcon = severity => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />
      case 'low':
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getSeverityColor = severity => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'warning'
      case 'low':
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="border-l-4 border-l-warning-500">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning-600" />
          <CardTitle>Smart Insights</CardTitle>
        </div>
        <CardDescription>
          Potential issues and recommendations based on your current setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {warnings.map((warning, index) => (
          <Alert key={index} className="relative">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(warning.severity)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(warning.severity)} className="text-xs">
                    {warning.severity === 'high'
                      ? 'Important'
                      : warning.severity === 'medium'
                        ? 'Warning'
                        : 'Info'}
                  </Badge>
                  {warning.source && warning.source !== 'general' && (
                    <span className="text-xs text-muted-foreground">
                      {warning.round || warning.source}
                    </span>
                  )}
                </div>
                <AlertDescription className="text-sm">{warning.message}</AlertDescription>
                {warning.suggestion && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <strong>Suggestion:</strong> {warning.suggestion}
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
