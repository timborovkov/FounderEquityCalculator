import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, PieChart, Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import useCalculatorStore from '@/store/useCalculatorStore'
import { calculateCurrentOwnership, calculateTotalDilution } from '@/lib/calculations/dilution'
import { useMemo } from 'react'

export default function SummaryPanel() {
  const { company, founders, rounds, employees, optionPool } = useCalculatorStore()

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalRounds = rounds.length
    const totalRaised = rounds.reduce((sum, r) => sum + r.investment, 0)
    const latestValuation = rounds.length > 0
      ? rounds[rounds.length - 1].postMoneyValuation
      : 0

    // Calculate ownership breakdown
    const { stakeholders } = calculateCurrentOwnership(founders, rounds, employees)
    const founderOwnership = stakeholders
      .filter(s => s.type === 'founder')
      .reduce((sum, s) => sum + s.ownership, 0)

    const investorOwnership = stakeholders
      .filter(s => s.type === 'investor')
      .reduce((sum, s) => sum + s.ownership, 0)

    // Calculate total dilution
    const totalDilution = rounds.length > 0
      ? calculateTotalDilution(rounds)
      : 0

    // Warnings
    const warnings = []
    if (founderOwnership < 20 && rounds.length > 0) {
      warnings.push('Low founder ownership (<20%)')
    }
    if (optionPool.size < 10) {
      warnings.push('Small option pool (<10%)')
    }
    if (rounds.some(r => {
      const dilution = (r.investment / r.postMoneyValuation) * 100
      return dilution > 40
    })) {
      warnings.push('High dilution in single round (>40%)')
    }

    return {
      totalRounds,
      totalRaised,
      latestValuation,
      founderOwnership,
      investorOwnership,
      totalDilution,
      warnings
    }
  }, [founders, rounds, employees, optionPool])

  const formatCurrency = (amount) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`
    return `$${amount.toFixed(0)}`
  }

  return (
    <aside className="hidden md:fixed md:block right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/20 to-muted/40 dark:from-muted/10 dark:to-muted/30 border-l-2 overflow-y-auto z-40 backdrop-blur-sm">
      <div className="p-5 space-y-4">
        {/* Company Header */}
        <div className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-xl border-2 border-primary-100 dark:border-primary-900 shadow-sm">
          <h2 className="text-lg font-bold mb-1 text-primary-900 dark:text-primary-100">
            {company.name || 'Your Company'}
          </h2>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Summary & Insights
          </p>
        </div>

        <Separator className="bg-border/50" />

        {/* Key Metrics */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="p-3 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-lg border border-primary-100 dark:border-primary-900">
              <div className="text-xs text-primary-600 dark:text-primary-400 mb-1 font-medium">Current Valuation</div>
              <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                {formatCurrency(summary.latestValuation)}
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-muted/50 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Total Raised</div>
                <div className="text-base font-semibold">
                  {formatCurrency(summary.totalRaised)}
                </div>
              </div>
              <div className="p-2.5 bg-muted/50 rounded-lg border">
                <div className="text-xs text-muted-foreground mb-1">Rounds</div>
                <div className="text-base font-semibold">
                  {summary.totalRounds}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ownership Breakdown */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary-600" />
              Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Founders</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{summary.founderOwnership.toFixed(1)}%</span>
                {summary.founderOwnership < 20 && (
                  <TrendingDown className="w-4 h-4 text-warning-500" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Investors</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{summary.investorOwnership.toFixed(1)}%</span>
                {summary.investorOwnership > 60 && (
                  <TrendingUp className="w-4 h-4 text-danger-500" />
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Dilution</span>
              <span className="font-semibold text-danger-600">
                {summary.totalDilution.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Option Pool</span>
              <span className="font-semibold">
                {optionPool.size}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Warnings */}
        {summary.warnings.length > 0 && (
          <Card className="border-2 border-warning-500 shadow-sm bg-warning-50 dark:bg-warning-950">
            <CardHeader className="pb-3 border-b border-warning-200 dark:border-warning-800">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold text-warning-700 dark:text-warning-300">
                <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.warnings.map((warning, index) => (
                  <Alert key={index} variant="warning" className="py-2">
                    <AlertDescription className="text-xs">
                      {warning}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Check */}
        {summary.warnings.length === 0 && rounds.length > 0 && (
          <Card className="border-2 border-success-500 shadow-sm bg-success-50 dark:bg-success-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-100 dark:bg-success-900 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <div className="font-semibold text-success-700 dark:text-success-300">Looking Good!</div>
                  <div className="text-xs text-success-600 dark:text-success-400">
                    No major issues detected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4 text-sm">
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Founders</span>
              <Badge variant="secondary" className="font-semibold">{founders.length}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground">Employees</span>
              <Badge variant="secondary" className="font-semibold">{employees.length}</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary-100 dark:border-primary-900">
              <span className="text-primary-700 dark:text-primary-300 font-medium">Total Stakeholders</span>
              <Badge className="bg-primary-600 text-white font-semibold">
                {founders.length + rounds.length + employees.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
